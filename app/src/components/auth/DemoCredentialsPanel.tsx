import { cn } from "@/lib/utils";

interface DemoCredentialsPanelProps {
  email?: string;
  password?: string;
  className?: string;
}

export function DemoCredentialsPanel({
  email = "test@example.com",
  password = "password123",
  className,
}: DemoCredentialsPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-yellow-100 border border-yellow-200 p-4",
        className
      )}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg" role="img" aria-label="magic wand">
          🪄
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-yellow-900 mb-2">
            Demo Account
          </p>
          <div className="space-y-1">
            <p className="text-sm text-yellow-800">
              <span className="font-mono font-semibold">{email}</span>
            </p>
            <p className="text-sm text-yellow-800">
              <span className="font-mono font-semibold">{password}</span>
            </p>
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            Try out the app with this demo account
          </p>
        </div>
      </div>
    </div>
  );
}
