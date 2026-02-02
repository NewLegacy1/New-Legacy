"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[120px] w-full rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-3 text-sm text-pure-white placeholder:text-ash-gray focus:outline-none focus:ring-2 focus:ring-phoenix-gold/30",
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
Textarea.displayName = "Textarea";

