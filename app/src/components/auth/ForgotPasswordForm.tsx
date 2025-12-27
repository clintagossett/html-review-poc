"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GradientLogo } from "@/components/shared/GradientLogo";
import { IconInput } from "@/components/shared/IconInput";
import { Mail, ArrowRight, AlertCircle, CheckCircle2, Lock } from "lucide-react";

export function ForgotPasswordForm() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    setIsLoading(true);

    try {
      // Send standard magic link (no custom template needed)
      await signIn("resend", {
        email,
        redirectTo: "/settings", // Redirect to settings after auth
      });
      setSuccess(true);
    } catch {
      setError("Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Logo */}
      <div className="flex justify-center">
        <GradientLogo icon={Lock} />
      </div>

      {/* Headings */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
        <p className="text-gray-600">
          We&apos;ll send you a magic link to sign in and reset your password
        </p>
      </div>

      {success ? (
        /* Success State */
        <div className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Check your email!</strong> We&apos;ve sent a magic link to{" "}
              <span className="font-medium">{email}</span>
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              What to do next:
            </h3>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Check your email inbox for the magic link</li>
              <li>Click the link to sign in automatically</li>
              <li>Go to Settings to change your password</li>
              <li>
                You&apos;ll have <strong>15 minutes</strong> to change your password
                without entering your current password
              </li>
            </ol>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setSuccess(false)}
          >
            Send another link
          </Button>
        </div>
      ) : (
        /* Form State */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-purple-900 mb-1">
                  How password reset works
                </p>
                <p className="text-xs text-purple-700">
                  We&apos;ll email you a secure link. After clicking it, you&apos;ll have
                  15 minutes to change your password in Settings—no current
                  password needed.
                </p>
              </div>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <IconInput
              id="email"
              type="email"
              icon={Mail}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Magic Link
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      )}

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
