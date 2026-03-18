"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      type="date"
      className={cn(
        "[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
        className
      )}
      {...props}
    />
  )
);
DatePicker.displayName = "DatePicker";

export { DatePicker };
