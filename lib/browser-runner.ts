// In-browser code execution for JavaScript, TypeScript, Python and SQL.
// Each run happens inside a Web Worker, so user code can't touch the page and
// infinite loops are stopped by terminating the worker. Other languages still
// go through the Piston server route (see lib/piston.ts).

export interface RunResult {
  output: string;
  error?: string;
  exitCode: number;
}

type BrowserLanguage = "javascript" | "typescript" | "python" | "sql";

const PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
const SQLJS_BASE = "https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/";

const RUN_TIMEOUT_MS = 10_000;
// Pyodide is ~10 MB on first load, so allow time before the run itself starts
const LOAD_TIMEOUT_MS = 120_000;

export function canRunInBrowser(language: string): boolean {
  return ["javascript", "typescript", "python", "sql"].includes(
    language.toLowerCase()
  );
}

// ---------------------------------------------------------------------------
// Worker sources. Every worker speaks the same protocol:
//   in:  { id, code }
//   out: { id, type: "started" }            run timer starts (after loading)
//        { id, type: "stdout"|"stderr", text }
//        { id, type: "done", exitCode }
// ---------------------------------------------------------------------------

const JS_WORKER = `
const pending = new Set();
let mainDone = false, finished = false, exitCode = 0, runId = null;
const post = (type, extra) => self.postMessage({ id: runId, type, ...extra });
// User code runs inside an AsyncFunction, whose body starts 2 lines in
const userLine = (err) => {
  const m = /<anonymous>:(\\d+):(\\d+)/.exec(err.stack || "");
  return m ? " (line " + (m[1] - 2) + ")" : "";
};
const fmt = (v) => {
  if (typeof v === "string") return v;
  if (v instanceof Error) return v.name + ": " + v.message + userLine(v);
  if (typeof v === "function") return "[Function: " + (v.name || "anonymous") + "]";
  if (typeof v === "undefined") return "undefined";
  try { return JSON.stringify(v, null, 2) ?? String(v); } catch { return String(v); }
};
const write = (type) => (...args) => post(type, { text: args.map(fmt).join(" ") + "\\n" });
const finish = () => {
  if (finished || !mainDone || pending.size) return;
  finished = true;
  post("done", { exitCode });
};
const fail = (err) => { exitCode = 1; write("stderr")(err); };

console.log = console.info = console.debug = write("stdout");
console.error = console.warn = write("stderr");
console.table = (data) => write("stdout")(data);

const _setTimeout = self.setTimeout, _setInterval = self.setInterval;
const _clearTimeout = self.clearTimeout, _clearInterval = self.clearInterval;
self.setTimeout = (fn, ms, ...a) => {
  const t = _setTimeout(() => {
    pending.delete(t);
    try { typeof fn === "function" && fn(...a); } catch (e) { fail(e); }
    finish();
  }, ms);
  pending.add(t);
  return t;
};
self.setInterval = (fn, ms, ...a) => {
  const t = _setInterval(() => { try { fn(...a); } catch (e) { fail(e); } }, ms);
  pending.add(t);
  return t;
};
self.clearTimeout = (t) => { _clearTimeout(t); pending.delete(t); finish(); };
self.clearInterval = (t) => { _clearInterval(t); pending.delete(t); finish(); };
self.addEventListener("unhandledrejection", (e) => { fail(e.reason); finish(); });

const require = (name) => {
  throw new Error(
    "Cannot use require('" + name + "'): the in-browser runner supports plain JavaScript only, " +
    "so npm packages and Node modules (express, fs, http, ...) aren't available here."
  );
};
const process = { env: {}, argv: ["node", "main.js"], exit: (c = 0) => { exitCode = c; throw { __exit: true }; } };

self.onmessage = async (e) => {
  runId = e.data.id;
  post("started");
  const module = { exports: {} };
  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const fn = new AsyncFunction("require", "module", "exports", "process", e.data.code);
    await fn(require, module, module.exports, process);
  } catch (err) {
    if (!(err && err.__exit)) fail(err);
  }
  mainDone = true;
  finish();
};
`;

const PYTHON_WORKER = `
importScripts("${PYODIDE_BASE}pyodide.js");
const ready = loadPyodide({ indexURL: "${PYODIDE_BASE}" });
self.onmessage = async (e) => {
  const { id, code } = e.data;
  const post = (type, extra) => self.postMessage({ id, type, ...extra });
  const py = await ready;
  py.setStdout({ batched: (t) => post("stdout", { text: t + "\\n" }) });
  py.setStderr({ batched: (t) => post("stderr", { text: t + "\\n" }) });
  // Loads numpy, pandas, scikit-learn, ... when imported; unknown packages are skipped
  try { await py.loadPackagesFromImports(code, { messageCallback: () => {} }); } catch {}
  const globals = py.globals.get("dict")();
  globals.set("__name__", "__main__");
  post("started");
  let exitCode = 0;
  try {
    await py.runPythonAsync(code, { globals });
  } catch (err) {
    exitCode = 1;
    // Drop Pyodide's own frames so the traceback starts at the user's code
    const text = String(err.message || err);
    const userFrames = text.indexOf('  File "<exec>"');
    post("stderr", {
      text: userFrames === -1 ? text
        : "Traceback (most recent call last):\\n" + text.slice(userFrames),
    });
  } finally {
    globals.destroy();
  }
  post("done", { exitCode });
};
`;

const SQL_WORKER = `
importScripts("${SQLJS_BASE}sql-wasm.js");
const ready = initSqlJs({ locateFile: (f) => "${SQLJS_BASE}" + f });
const table = ({ columns, values }) => {
  const cell = (v) => (v === null ? "NULL" : String(v));
  const widths = columns.map((c, i) =>
    Math.max(c.length, ...values.map((row) => cell(row[i]).length))
  );
  const line = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join(" | ");
  return [
    line(columns),
    widths.map((w) => "-".repeat(w)).join("-+-"),
    ...values.map((row) => line(row.map(cell))),
    "(" + values.length + " row" + (values.length === 1 ? "" : "s") + ")",
  ].join("\\n");
};
self.onmessage = async (e) => {
  const { id, code } = e.data;
  const post = (type, extra) => self.postMessage({ id, type, ...extra });
  const SQL = await ready;
  post("started");
  const db = new SQL.Database(); // fresh database every run
  let exitCode = 0;
  try {
    const results = db.exec(code);
    const text = results.length
      ? results.map(table).join("\\n\\n")
      : "Query OK (" + db.getRowsModified() + " rows affected)";
    post("stdout", { text: text + "\\n" });
  } catch (err) {
    exitCode = 1;
    post("stderr", { text: String(err.message || err) + "\\n" });
  } finally {
    db.close();
  }
  post("done", { exitCode });
};
`;

// ---------------------------------------------------------------------------

const RUNTIME_NAMES: Record<BrowserLanguage, string> = {
  javascript: "JavaScript",
  typescript: "JavaScript",
  python: "Python",
  sql: "SQL",
};

// Python and SQL workers are kept between runs so the runtime loads only once
const persistentWorkers = new Map<"python" | "sql", Worker>();
let nextRunId = 0;

function createWorker(source: string): Worker {
  const url = URL.createObjectURL(
    new Blob([source], { type: "text/javascript" })
  );
  const worker = new Worker(url);
  URL.revokeObjectURL(url);
  return worker;
}

function getWorker(language: BrowserLanguage): {
  worker: Worker;
  persistent: boolean;
} {
  if (language === "python" || language === "sql") {
    let worker = persistentWorkers.get(language);
    if (!worker) {
      worker = createWorker(language === "python" ? PYTHON_WORKER : SQL_WORKER);
      persistentWorkers.set(language, worker);
    }
    return { worker, persistent: true };
  }
  return { worker: createWorker(JS_WORKER), persistent: false };
}

function discardWorker(language: BrowserLanguage, worker: Worker) {
  worker.terminate();
  if (language === "python" || language === "sql") {
    if (persistentWorkers.get(language) === worker) {
      persistentWorkers.delete(language);
    }
  }
}

// Convert TypeScript and ES module syntax into plain JS the worker can run
async function prepareJavaScript(
  code: string,
  language: BrowserLanguage
): Promise<string> {
  const usesModules = /^\s*(import|export)\s/m.test(code);
  if (language !== "typescript" && !usesModules) return code;

  const { transform } = await import("sucrase");
  const transforms: ("typescript" | "imports")[] =
    language === "typescript" ? ["typescript"] : [];
  if (usesModules) transforms.push("imports");
  return transform(code, { transforms }).code;
}

export async function runInBrowser(
  code: string,
  language: string
): Promise<RunResult> {
  const lang = language.toLowerCase() as BrowserLanguage;
  if (!canRunInBrowser(lang)) {
    throw new Error(`${language} can't run in the browser`);
  }

  let source = code;
  if (lang === "javascript" || lang === "typescript") {
    try {
      source = await prepareJavaScript(code, lang);
    } catch (err) {
      return {
        output: "",
        error: `SyntaxError: ${err instanceof Error ? err.message : err}`,
        exitCode: 1,
      };
    }
  }

  const { worker, persistent } = getWorker(lang);
  const id = ++nextRunId;

  return new Promise<RunResult>((resolve) => {
    let stdout = "";
    let stderr = "";
    let combined = "";
    let timer = setTimeout(
      () =>
        done(124, `Timed out loading the ${RUNTIME_NAMES[lang]} runtime.`),
      LOAD_TIMEOUT_MS
    );

    const done = (exitCode: number, failure?: string) => {
      clearTimeout(timer);
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
      if (failure) {
        stderr += (stderr && !stderr.endsWith("\n") ? "\n" : "") + failure;
        discardWorker(lang, worker);
      } else if (!persistent) {
        worker.terminate();
      }
      resolve(
        exitCode === 0
          ? { output: combined, exitCode }
          : { output: stdout, error: stderr || "Execution failed", exitCode }
      );
    };

    const onMessage = (e: MessageEvent) => {
      const msg = e.data;
      if (msg.id !== id) return;
      if (msg.type === "started") {
        clearTimeout(timer);
        timer = setTimeout(
          () =>
            done(
              124,
              `Timed out after ${RUN_TIMEOUT_MS / 1000}s. Check for an infinite loop, a never-cleared setInterval, or a server that keeps listening.`
            ),
          RUN_TIMEOUT_MS
        );
      } else if (msg.type === "stdout") {
        stdout += msg.text;
        combined += msg.text;
      } else if (msg.type === "stderr") {
        stderr += msg.text;
        combined += msg.text;
      } else if (msg.type === "done") {
        done(msg.exitCode);
      }
    };

    // Fires when the runtime script itself can't load (offline, CDN blocked)
    const onError = (e: ErrorEvent) => {
      e.preventDefault();
      done(
        1,
        `Couldn't load the ${RUNTIME_NAMES[lang]} runtime${
          e.message ? ` (${e.message})` : ""
        }. Check your internet connection and try again.`
      );
    };

    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);
    worker.postMessage({ id, code: source });
  });
}
