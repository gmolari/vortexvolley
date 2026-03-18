"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, { dot: string; bg: string; text: string }> = {
  ACTIVE: { dot: "bg-success", bg: "bg-success/10 hover:bg-success/20", text: "text-success" },
  INACTIVE: { dot: "bg-muted-foreground", bg: "bg-muted hover:bg-muted/80", text: "text-muted-foreground" },
  DRAFT: { dot: "bg-warning", bg: "bg-warning/10 hover:bg-warning/20", text: "text-warning" },
  EXPIRED: { dot: "bg-destructive", bg: "bg-destructive/10 hover:bg-destructive/20", text: "text-destructive" },
  NEAR: { dot: "bg-primary", bg: "bg-primary/10 hover:bg-primary/20", text: "text-primary" },
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  DRAFT: "Rascunho",
  EXPIRED: "Expirado",
  NEAR: "Em breve",
};

interface InlineStatusSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function InlineStatusSelect({ value, options, onChange, disabled }: InlineStatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const style = statusStyles[value] || statusStyles.DRAFT;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
          "border-transparent",
          style.bg,
          style.text,
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
        {statusLabels[value] || value}
        <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      <div
        className={cn(
          "absolute left-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border border-border bg-card py-1 shadow-lg",
          "transition-all duration-150 origin-top",
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 -translate-y-1 pointer-events-none"
        )}
      >
        {options.map((opt) => {
          const optStyle = statusStyles[opt] || statusStyles.DRAFT;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors",
                "hover:bg-accent",
                opt === value ? optStyle.text : "text-foreground"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", optStyle.dot)} />
              {statusLabels[opt] || opt}
              {opt === value && <span className="ml-auto text-[10px] text-muted-foreground">atual</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
