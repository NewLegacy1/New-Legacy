"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none disabled:opacity-60 disabled:pointer-events-none";

    const variants: Record<ButtonVariant, string> = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost:
        "border border-ash-gray/20 bg-transparent text-pure-white hover:border-phoenix-gold/40",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

