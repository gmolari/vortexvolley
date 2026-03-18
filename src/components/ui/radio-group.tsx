"use client";

import { forwardRef, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue>({ name: "" });

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, name, value, onValueChange, children, ...props }, ref) => (
    <RadioGroupContext.Provider value={{ name, value, onChange: onValueChange }}>
      <div ref={ref} role="radiogroup" className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: string;
  label?: string;
}

const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, label, id, ...props }, ref) => {
    const ctx = useContext(RadioGroupContext);
    const inputId = id || `radio-${ctx.name}-${value}`;
    const checked = ctx.value === value;

    return (
      <label
        htmlFor={inputId}
        className={cn("group flex items-center gap-2.5 cursor-pointer select-none", className)}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            name={ctx.name}
            value={value}
            checked={checked}
            onChange={() => ctx.onChange?.(value)}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-5 w-5 rounded-full border-2 border-input bg-background transition-all",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
              "peer-checked:border-primary",
              "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
              "group-hover:border-primary/60"
            )}
          />
          <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-primary scale-0 transition-transform peer-checked:scale-100" />
        </div>
        {label && (
          <span className="text-sm text-foreground">{label}</span>
        )}
      </label>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
