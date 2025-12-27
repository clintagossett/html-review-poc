"use client";

import { Button } from "@/components/ui/button";
import { Wrench, Unlock, Lock } from "lucide-react";

type DebugState = "auto" | "fresh" | "stale";

interface DebugToggleProps {
  onOverride: (state: DebugState) => void;
}

/**
 * Debug Toggle
 *
 * Development-only component for testing grace period states.
 * Allows instant switching between fresh/stale states.
 *
 * IMPORTANT: Only renders in development mode.
 * Usage in Settings page:
 * {process.env.NODE_ENV === 'development' && <DebugToggle />}
 */
export function DebugToggle({ onOverride }: DebugToggleProps) {
  return (
    <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Wrench className="w-4 h-4 text-purple-700" />
        <p className="text-sm font-medium text-purple-900">
          Debug Mode: Test Grace Period States
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onOverride("auto")}
          variant="outline"
          size="sm"
          className="bg-white hover:bg-purple-50 border-purple-300 text-purple-900"
        >
          Auto
        </Button>
        <Button
          onClick={() => onOverride("fresh")}
          variant="outline"
          size="sm"
          className="bg-white hover:bg-purple-50 border-purple-300 text-purple-900"
        >
          <Unlock className="w-4 h-4 mr-1" />
          Fresh
        </Button>
        <Button
          onClick={() => onOverride("stale")}
          variant="outline"
          size="sm"
          className="bg-white hover:bg-purple-50 border-purple-300 text-purple-900"
        >
          <Lock className="w-4 h-4 mr-1" />
          Stale
        </Button>
      </div>

      <p className="text-xs text-purple-700 mt-2">
        This control is only visible in development mode.
      </p>
    </div>
  );
}
