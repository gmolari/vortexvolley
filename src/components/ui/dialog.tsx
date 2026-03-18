"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (open) {
      setShouldRender(true);
      if (!el.open) el.showModal();
      requestAnimationFrame(() => setIsAnimating(true));
    } else if (el.open) {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        el.close();
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  return (
    <dialog
      ref={ref}
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === ref.current) handleClose();
      }}
      className={cn(
        "fixed inset-0 z-50 m-auto max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-0 shadow-2xl",
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        "transition-all duration-200 ease-out",
        isAnimating
          ? "scale-100 opacity-100 translate-y-0"
          : "scale-95 opacity-0 translate-y-2",
        "backdrop:transition-opacity backdrop:duration-200",
        isAnimating ? "backdrop:opacity-100" : "backdrop:opacity-0"
      )}
    >
      {shouldRender && children}
    </dialog>
  );
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-1.5 pb-4", className)}>{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-semibold text-foreground", className)}>{children}</h2>;
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex justify-end gap-2 pt-4", className)}>{children}</div>;
}

export function DialogClose({ onClose, className }: { onClose: () => void; className?: string }) {
  return (
    <button
      onClick={onClose}
      className={cn(
        "absolute right-4 top-4 rounded-sm p-1 text-muted-foreground hover:text-foreground transition-colors",
        className
      )}
    >
      <X className="h-4 w-4" />
    </button>
  );
}
