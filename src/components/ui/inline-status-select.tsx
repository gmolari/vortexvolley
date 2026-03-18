"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => setIsOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, updatePosition]);

  const style = statusStyles[value] || statusStyles.DRAFT;

  return (
    <>
      <button
        ref={buttonRef}
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

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999 }}
          className="min-w-[140px] rounded-lg border border-border bg-card py-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150"
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
        </div>,
        document.body
      )}
    </>
  );
}
