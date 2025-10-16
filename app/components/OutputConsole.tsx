import { Terminal, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface OutputConsoleProps {
  output: string;
  isRunning: boolean;
  error?: string;
  exitCode?: number;
}

export function OutputConsole({
  output,
  isRunning,
  error,
  exitCode,
}: OutputConsoleProps) {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300">Output</span>
        </div>
        {!isRunning && output && (
          <div className="flex items-center gap-2">
            {error || (exitCode !== undefined && exitCode !== 0) ? (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="w-3 h-3" />
                Failed
              </Badge>
            ) : (
              <Badge className="gap-1 bg-green-600">
                <CheckCircle2 className="w-3 h-3" />
                Success
              </Badge>
            )}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 font-mono text-sm">
          {isRunning ? (
            <div className="flex items-center gap-2 text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running code...</span>
            </div>
          ) : output || error ? (
            <div className="space-y-2">
              {error && (
                <div className="text-red-400">
                  <div className="mb-1">Error:</div>
                  <pre className="whitespace-pre-wrap">{error}</pre>
                </div>
              )}
              {output && (
                <div className="text-green-400">
                  <pre className="whitespace-pre-wrap">{output}</pre>
                </div>
              )}
              {exitCode !== undefined && (
                <div className="text-slate-500 text-xs mt-4">
                  Exit code: {exitCode}
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500">
              Click &quot;Run Code&quot; to see the output here...
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
