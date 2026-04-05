"use client";

import Link from "next/link";
import { ConnectedIcon, DisconnectedIcon } from "@/components/icons";

interface ConnectionStatusProps {
  connected: boolean;
}

export function ConnectionStatus({ connected }: ConnectionStatusProps) {
  if (connected) {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <ConnectedIcon size={12} className="text-geul-primary" />
        <span className="text-geul-primary">연결됨</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <DisconnectedIcon size={12} className="text-geul-error" />
      <span className="text-geul-error">에이전트 미연결</span>
      <Link
        href="/playground/setup"
        className="text-geul-text-muted hover:text-geul-text-secondary underline underline-offset-2 transition-colors ml-1"
      >
        설정 안내
      </Link>
    </div>
  );
}
