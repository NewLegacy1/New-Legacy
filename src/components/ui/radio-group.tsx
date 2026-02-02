"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type RadioGroupContextValue = {
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null
);

export function RadioGroup({
  className,
  name,
  value,
  onValueChange,
  disabled,
  children,
}: {
  className?: string;
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <RadioGroupContext.Provider
      value={{ name, value, onValueChange, disabled }}
    >
      <div className={cn("grid gap-2", className)}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({
  className,
  value,
  label,
}: {
  className?: string;
  value: string;
  label: string;
}) {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioGroupItem must be used within RadioGroup");

  const id = React.useId();
  const checked = ctx.value === value;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-3 text-sm text-pure-white/90 transition hover:border-phoenix-gold/40",
        checked && "border-phoenix-gold/60 bg-charcoal/95",
        ctx.disabled && "opacity-60 pointer-events-none",
        className
      )}
    >
      <input
        id={id}
        type="radio"
        name={ctx.name}
        value={value}
        checked={checked}
        onChange={() => ctx.onValueChange?.(value)}
        className="mt-1 h-4 w-4 accent-phoenix-gold"
      />
      <span>{label}</span>
    </label>
  );
}

