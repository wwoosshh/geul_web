"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AgentClient, type AgentMessage } from "@/lib/agent";
import { CodeEditor } from "@/components/playground/code-editor";
import { OutputPanel, type OutputLine } from "@/components/playground/output-panel";
import { Toolbar, EXAMPLES } from "@/components/playground/toolbar";
import { ConnectionStatus } from "@/components/playground/connection-status";

const DEFAULT_CODE = EXAMPLES["안녕세계"];

let outputIdCounter = 0;
function createLine(type: OutputLine["type"], text: string): OutputLine {
  return { id: `out-${++outputIdCounter}`, type, text };
}

export default function PlaygroundPage() {
  const router = useRouter();
  const agentRef = useRef<AgentClient | null>(null);

  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [compileLog, setCompileLog] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [connected, setConnected] = useState(false);
  const [errors, setErrors] = useState<{ line: number; message: string }[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize agent connection
  useEffect(() => {
    const agent = new AgentClient();
    agentRef.current = agent;

    agent.on("connected", () => setConnected(true));
    agent.on("disconnected", () => setConnected(false));

    agent.on("compile_start", () => {
      setOutput([]);
      setErrors([]);
      setIsCompiling(true);
      setCompileLog("");
    });

    agent.on("compile_success", (msg: AgentMessage) => {
      setIsCompiling(false);
      setCompileLog(msg.data ?? "컴파일 성공");
      setOutput((prev) => [
        ...prev,
        createLine("system", "-- 컴파일 완료. 실행 중... --"),
      ]);
      setIsRunning(true);
      agent.run();
    });

    agent.on("compile_error", (msg: AgentMessage) => {
      setIsCompiling(false);
      setCompileLog(msg.errors ?? msg.data ?? "컴파일 오류");
      setOutput((prev) => [
        ...prev,
        createLine("stderr", msg.errors ?? "컴파일 오류 발생"),
      ]);

      // Parse error lines if possible. Accept only patterns that look like
      // "file:line:col" or "line N" forms. Guard against bogus matches that
      // would later crash Monaco with "Illegal value for lineNumber".
      if (msg.errors) {
        const totalLines = code.split("\n").length;
        const lineErrors: { line: number; message: string }[] = [];
        const lines = msg.errors.split("\n");
        for (const line of lines) {
          // Match "...:<line>:<col>:" or "line <N>" style
          const m1 = line.match(/[:\s](\d+):(\d+)[:\s]/);
          const m2 = line.match(/(?:line|라인|줄)\s*(\d+)/i);
          const match = m1 || m2;
          if (!match) continue;
          const lineNum = parseInt(match[1], 10);
          if (!Number.isFinite(lineNum) || lineNum < 1 || lineNum > totalLines) {
            continue;
          }
          lineErrors.push({
            line: lineNum,
            message: line.trim(),
          });
        }
        if (lineErrors.length > 0) setErrors(lineErrors);
      }
    });

    agent.on("stdout", (msg: AgentMessage) => {
      if (msg.data) {
        setOutput((prev) => [...prev, createLine("stdout", msg.data!)]);
      }
    });

    agent.on("stderr", (msg: AgentMessage) => {
      if (msg.data) {
        setOutput((prev) => [...prev, createLine("stderr", msg.data!)]);
      }
    });

    agent.on("run_exit", (msg: AgentMessage) => {
      setIsRunning(false);
      const exitCode = msg.code ?? 0;
      setOutput((prev) => [
        ...prev,
        createLine("system", `-- 프로그램 종료 (코드: ${exitCode}) --`),
      ]);
    });

    agent.connect().then((ok) => {
      setInitialized(true);
      if (!ok) {
        router.push("/playground/setup");
      }
    });

    return () => {
      agent.disconnect();
    };
  }, [router]);

  const handleBuildRun = useCallback(() => {
    if (!agentRef.current?.connected) return;
    setErrors([]);
    agentRef.current.compile(code);
  }, [code]);

  const handleStop = useCallback(() => {
    agentRef.current?.stop();
    setIsRunning(false);
  }, []);

  const handleExampleSelect = useCallback((exampleCode: string) => {
    setCode(exampleCode);
    setErrors([]);
  }, []);

  const handleClearOutput = useCallback(() => {
    setOutput([]);
    setCompileLog("");
  }, []);

  // Show nothing until connection attempt completes
  if (!initialized) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-geul-text-muted text-sm">에이전트 연결 중...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Top bar: connection status */}
      <div className="flex items-center justify-between border-b border-geul-border px-4 py-2">
        <h1 className="text-sm font-semibold text-geul-text">플레이그라운드</h1>
        <ConnectionStatus connected={connected} />
      </div>

      {/* Main content: editor + output */}
      <div className="flex flex-1 min-h-0">
        {/* Code editor - left */}
        <div className="flex-[3] min-w-0 p-2">
          <CodeEditor value={code} onChange={setCode} errors={errors} />
        </div>

        {/* Output panel - right */}
        <div className="flex-[2] min-w-0 p-2 pl-0">
          <OutputPanel
            output={output}
            compileLog={compileLog}
            onClear={handleClearOutput}
          />
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="border-t border-geul-border p-2">
        <Toolbar
          onBuildRun={handleBuildRun}
          onStop={handleStop}
          onExampleSelect={handleExampleSelect}
          isCompiling={isCompiling}
          isRunning={isRunning}
          connected={connected}
        />
      </div>
    </div>
  );
}
