"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-3 text-sm text-pure-white focus:outline-none focus:ring-2 focus:ring-phoenix-gold/30",
          className
        )}
        style={{
          backgroundColor: "rgba(15, 15, 15, 0.7)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          ...props.style,
        }}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

