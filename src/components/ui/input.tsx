"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-3 text-sm text-pure-white placeholder:text-ash-gray focus:outline-none focus:ring-2 focus:ring-phoenix-gold/30",
          className
        )}
        style={{
          backgroundColor: "rgba(15, 15, 15, 0.7)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          ...props.style,
        }}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

