// In-browser code execution for JavaScript, TypeScript, Python, SQL, PHP and
// Ruby. Each run happens inside a Web Worker, so user code can't touch the
// page and infinite loops are stopped by terminating the worker. Compiled
// languages (Java, C#, Go, Rust, C++) can't run in the browser.

export interface RunResult {
  output: string;
  error?: string;
  exitCode: number;
}

type BrowserLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "sql"
  | "php"
  | "ruby";
// Languages whose runtime is downloaded once and kept in a long-lived worker
type PersistentLanguage = Exclude<BrowserLanguage, "javascript" | "typescript">;

const PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
const SQLJS_BASE = "https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/";
const PHP_WASM = "https://cdn.jsdelivr.net/npm/php-wasm@0.2.0/PhpWeb.mjs";
const RUBY_VM = "https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.10.1/dist/browser/+esm";
const RUBY_WASM =
  "https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.10.1/dist/ruby+stdlib.wasm";

const RUN_TIMEOUT_MS = 10_000;
// Runtimes are several MB on first load, so allow time before the run starts
const LOAD_TIMEOUT_MS = 120_000;

const BROWSER_LANGUAGES: BrowserLanguage[] = [
  "javascript",
  "typescript",
  "python",
  "sql",
  "php",
  "ruby",
];

export function canRunInBrowser(language: string): boolean {
  return BROWSER_LANGUAGES.includes(language.toLowerCase() as BrowserLanguage);
}

// ---------------------------------------------------------------------------
// Worker sources. Every worker speaks the same protocol:
//   in:  { id, code }
//   out: { id, type: "started" }            run timer starts (after loading)
//        { id, type: "stdout"|"stderr", text }
//        { id, type: "loadError", text }    runtime couldn't be downloaded
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

// Shared by the persistent workers: wait for the runtime, then hand over to run()
const LOADER = `
const handle = (ready, run) => {
  self.onmessage = async (e) => {
    const { id, code } = e.data;
    const post = (type, extra) => self.postMessage({ id, type, ...extra });
    let runtime;
    try {
      runtime = await ready;
    } catch (err) {
      post("loadError", { text: String((err && err.message) || err) });
      return;
    }
    post("done", { exitCode: await run(runtime, code, post) });
  };
};
`;

const PYTHON_WORKER = `
importScripts("${PYODIDE_BASE}pyodide.js");
${LOADER}
handle(loadPyodide({ indexURL: "${PYODIDE_BASE}" }), async (py, code, post) => {
  py.setStdout({ batched: (t) => post("stdout", { text: t + "\\n" }) });
  py.setStderr({ batched: (t) => post("stderr", { text: t + "\\n" }) });
  // Loads numpy, pandas, scikit-learn, ... when imported; unknown packages are skipped
  try { await py.loadPackagesFromImports(code, { messageCallback: () => {} }); } catch {}
  const globals = py.globals.get("dict")();
  globals.set("__name__", "__main__");
  post("started");
  try {
    await py.runPythonAsync(code, { globals });
    return 0;
  } catch (err) {
    // Drop Pyodide's own frames so the traceback starts at the user's code
    const text = String(err.message || err);
    const userFrames = text.indexOf('  File "<exec>"');
    post("stderr", {
      text: userFrames === -1 ? text
        : "Traceback (most recent call last):\\n" + text.slice(userFrames),
    });
    return 1;
  } finally {
    globals.destroy();
  }
});
`;

const SQL_WORKER = `
importScripts("${SQLJS_BASE}sql-wasm.js");
${LOADER}
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
handle(initSqlJs({ locateFile: (f) => "${SQLJS_BASE}" + f }), async (SQL, code, post) => {
  post("started");
  const db = new SQL.Database(); // fresh database every run
  try {
    const results = db.exec(code);
    const text = results.length
      ? results.map(table).join("\\n\\n")
      : "Query OK (" + db.getRowsModified() + " rows affected)";
    post("stdout", { text: text + "\\n" });
    return 0;
  } catch (err) {
    post("stderr", { text: String(err.message || err) + "\\n" });
    return 1;
  } finally {
    db.close();
  }
});
`;

// Module worker: php-wasm is published as ES modules. Its web build bundles
// Emscripten canvas/SDL helpers that reference document and window at load
// time, so give it inert stand-ins (workers have neither) before importing.
const PHP_WORKER = `
${LOADER}
self.window = self;
self.document = {
  addEventListener() {}, removeEventListener() {},
  querySelector: () => null, getElementById: () => null,
  currentScript: null, body: null,
};
let sink = null;
let used = false;
let fatal = false;
const ready = (async () => {
  const { PhpWeb } = await import("${PHP_WASM}");
  const php = new PhpWeb({ version: "8.4" });
  const text = (e) => [].concat(e.detail).join("");
  // PHP prints its errors to stdout; route them (and a fatal's stack trace) to stderr
  php.addEventListener("output", (e) => {
    if (!sink) return;
    const t = text(e);
    if (/^(PHP )?(Fatal|Parse) error:/m.test(t)) fatal = true;
    const isError = fatal || /^(PHP )?(Warning|Notice|Deprecated):/m.test(t);
    sink(isError ? "stderr" : "stdout", t);
  });
  php.addEventListener("error", (e) => sink && sink("stderr", text(e)));
  await php.binary;
  return php;
})();
handle(ready, async (php, code, post) => {
  if (used) await php.refresh(); // fresh PHP state every run
  used = true;
  fatal = false;
  sink = (type, text) => post(type, { text });
  post("started");
  try {
    const status = await php.run(code);
    return typeof status === "number" ? status : 0;
  } catch (err) {
    post("stderr", { text: String(err.message || err) + "\\n" });
    return 1;
  } finally {
    sink = null;
  }
});
`;

// Module worker: ruby.wasm prints through console.log / console.warn
const RUBY_WORKER = `
import { DefaultRubyVM } from "${RUBY_VM}";
${LOADER}
let sink = null;
console.log = (text) => sink && sink("stdout", String(text));
console.warn = (text) => sink && sink("stderr", String(text));
const ready = WebAssembly.compileStreaming(fetch("${RUBY_WASM}"));
handle(ready, async (rubyModule, code, post) => {
  const { vm } = await DefaultRubyVM(rubyModule); // fresh VM every run
  sink = (type, text) => post(type, { text });
  post("started");
  try {
    vm.eval(code);
    return 0;
  } catch (err) {
    // Strip terminal colors and the eval wrapper's own frame
    const text = String(err.message || err)
      .replace(/\\u001b\\[[0-9;]*m|\\u0000/g, "")
      .replace(/^-e:in 'Kernel\\.eval': /, "")
      .split("\\n")
      .filter((line) => !line.startsWith("-e:in 'Kernel.eval'"))
      .join("\\n")
      .trim();
    post("stderr", { text: text + "\\n" });
    return 1;
  } finally {
    try { vm.eval("$stdout.flush; $stderr.flush"); } catch {}
    sink = null;
  }
});
`;

// ---------------------------------------------------------------------------

const RUNTIME_NAMES: Record<BrowserLanguage, string> = {
  javascript: "JavaScript",
  typescript: "JavaScript",
  python: "Python",
  sql: "SQL",
  php: "PHP",
  ruby: "Ruby",
};

const PERSISTENT_WORKERS: Record<
  PersistentLanguage,
  { source: string; module: boolean }
> = {
  python: { source: PYTHON_WORKER, module: false },
  sql: { source: SQL_WORKER, module: false },
  php: { source: PHP_WORKER, module: true },
  ruby: { source: RUBY_WORKER, module: true },
};

// Kept between runs so each runtime downloads and starts only once
const persistentWorkers = new Map<PersistentLanguage, Worker>();
let nextRunId = 0;

const isPersistent = (lang: BrowserLanguage): lang is PersistentLanguage =>
  lang in PERSISTENT_WORKERS;

function createWorker(source: string, module: boolean): Worker {
  const url = URL.createObjectURL(
    new Blob([source], { type: "text/javascript" })
  );
  const worker = new Worker(url, module ? { type: "module" } : undefined);
  URL.revokeObjectURL(url);
  return worker;
}

function getWorker(lang: BrowserLanguage): Worker {
  if (!isPersistent(lang)) return createWorker(JS_WORKER, false);

  let worker = persistentWorkers.get(lang);
  if (!worker) {
    const { source, module } = PERSISTENT_WORKERS[lang];
    worker = createWorker(source, module);
    persistentWorkers.set(lang, worker);
  }
  return worker;
}

function discardWorker(lang: BrowserLanguage, worker: Worker) {
  worker.terminate();
  if (isPersistent(lang) && persistentWorkers.get(lang) === worker) {
    persistentWorkers.delete(lang);
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

  const worker = getWorker(lang);
  const id = ++nextRunId;
  const loadFailure = (detail?: string) =>
    `Couldn't load the ${RUNTIME_NAMES[lang]} runtime${
      detail ? ` (${detail})` : ""
    }. Check your internet connection and try again.`;

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
      } else if (!isPersistent(lang)) {
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
      } else if (msg.type === "loadError") {
        done(1, loadFailure(msg.text));
      } else if (msg.type === "done") {
        done(msg.exitCode);
      }
    };

    // Fires when the worker script itself can't load (offline, CDN blocked)
    const onError = (e: ErrorEvent) => {
      e.preventDefault();
      done(1, loadFailure(e.message));
    };

    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);
    worker.postMessage({ id, code: source });
  });
}
