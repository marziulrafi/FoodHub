"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "./dialog";

export function Modal({
  children,
  label,
  onClose,
}: {
  children: ReactNode;
  label: string;
  onClose: () => void;
}) {
  const previouslyFocused = useRef<HTMLElement | null>(null);
  useEffect(() => {
    return () => {
      previouslyFocused.current?.focus();
    };
  }, []);
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        onOpenAutoFocus={() => {
          previouslyFocused.current =
            document.activeElement as HTMLElement | null;
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          previouslyFocused.current?.focus();
        }}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogTitle className="sr-only">{label}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}
