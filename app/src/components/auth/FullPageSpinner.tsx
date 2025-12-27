/**
 * FullPageSpinner Component
 *
 * Displays a centered loading spinner that takes up the full page.
 * Used during authentication checks and redirects.
 */

import { Loader2 } from "lucide-react";

interface FullPageSpinnerProps {
  message?: string;
}

export function FullPageSpinner({
  message = "Loading...",
}: FullPageSpinnerProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
