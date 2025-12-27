"use client";

import { Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthMethodToggleProps {
  value: "password" | "magic-link";
  onChange: (value: "password" | "magic-link") => void;
  className?: string;
}

export function AuthMethodToggle({
  value,
  onChange,
  className,
}: AuthMethodToggleProps) {
  return (
    <div className={cn("flex gap-1 p-1 bg-gray-100 rounded-full", className)}>
      <button
        type="button"
        onClick={() => onChange("password")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
          value === "password"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        <Lock className="w-4 h-4" />
        Password
      </button>
      <button
        type="button"
        onClick={() => onChange("magic-link")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
          value === "magic-link"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        <Sparkles className="w-4 h-4" />
        Magic Link
      </button>
    </div>
  );
}
