"use client";

import { type ReactNode, useEffect, useCallback, useRef } from "react";
import { CloseIcon } from "@/components/icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Max-width class for the modal card (default: max-w-lg) */
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const SIZE_CLASS: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  "2xl": "max-w-5xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Lock body scroll while modal is open. The overlay itself scrolls.
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      // Overlay is scrollable so the modal card can never get clipped by the
      // viewport. Vertical centering is achieved with auto margins on the card
      // (items-center would prevent top-scroll access when the card is tall).
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="flex min-h-full items-start justify-center p-4 sm:items-center sm:p-8">
        <div
          className={`relative w-full ${SIZE_CLASS[size]} bg-geul-surface border border-geul-border rounded-lg shadow-xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)]`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header — sticky so it's always visible while scrolling */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-geul-border shrink-0">
            <h2 className="text-lg font-medium text-geul-text">{title}</h2>
            <button
              onClick={onClose}
              className="text-geul-text-muted hover:text-geul-text transition-colors cursor-pointer"
              aria-label="Close"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          {/* Body — scrolls independently when content overflows */}
          <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
