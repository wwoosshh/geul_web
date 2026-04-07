function getAgentUrl() {
  if (typeof window === "undefined") return "ws://localhost:9400";
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://localhost:9400`;
}

type MessageType =
  | "compile_start"
  | "compile_success"
  | "compile_error"
  | "stdout"
  | "stderr"
  | "run_exit"
  | "pong"
  | "connected"
  | "disconnected";

export interface AgentMessage {
  type: MessageType;
  data?: string;
  errors?: string;
  exe_path?: string;
  code?: number;
}

type MessageHandler = (msg: AgentMessage) => void;

export class AgentClient {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, MessageHandler[]>();
  private _connected = false;

  get connected() {
    return this._connected;
  }

  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      let resolved = false;
      const settle = (value: boolean) => {
        if (!resolved) {
          resolved = true;
          resolve(value);
        }
      };

      try {
        this.ws = new WebSocket(getAgentUrl());

        this.ws.onopen = () => {
          this._connected = true;
          this.emit("connected", { type: "connected" });
          settle(true);
        };

        this.ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data as string) as AgentMessage;
            this.emit(msg.type, msg);
          } catch {
            // ignore malformed messages
          }
        };

        this.ws.onclose = () => {
          this._connected = false;
          this.emit("disconnected", { type: "disconnected" });
        };

        this.ws.onerror = () => {
          this._connected = false;
          settle(false);
        };

        setTimeout(() => {
          if (!this._connected) settle(false);
        }, 3000);
      } catch {
        settle(false);
      }
    });
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this._connected = false;
  }

  compile(code: string) {
    this.send({ type: "compile", code });
  }

  run() {
    this.send({ type: "run" });
  }

  stop() {
    this.send({ type: "stop" });
  }

  on(type: string, handler: MessageHandler) {
    const list = this.handlers.get(type) || [];
    list.push(handler);
    this.handlers.set(type, list);
  }

  off(type: string, handler: MessageHandler) {
    const list = this.handlers.get(type) || [];
    this.handlers.set(
      type,
      list.filter((h) => h !== handler)
    );
  }

  private send(msg: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  private emit(type: string, msg: AgentMessage) {
    (this.handlers.get(type) || []).forEach((h) => h(msg));
  }
}
