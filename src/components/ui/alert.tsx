import * as React from "react";
import { cn } from "@/lib/utils";

export function Alert({
  className,
  variant = "info",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "info" | "warning" | "error" | "success";
}) {
  const variants: Record<string, string> = {
    info: "border-ash-gray/20 bg-charcoal/70 text-pure-white/90",
    warning: "border-phoenix-gold/30 bg-phoenix-gold/10 text-pure-white/90",
    error: "border-sunset-orange/30 bg-sunset-orange/10 text-pure-white/90",
    success: "border-phoenix-gold/30 bg-phoenix-gold/10 text-pure-white/90",
  };

  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

