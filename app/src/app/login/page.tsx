"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { Button } from "@/components/ui/button";

type AuthMethod = "password" | "magic-link";

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<AuthMethod>("password");

  const handleSuccess = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <div className="space-y-4">
        {authMethod === "password" ? (
          <>
            <LoginForm onSuccess={handleSuccess} />
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setAuthMethod("magic-link")}
                className="text-sm text-muted-foreground"
              >
                Sign in with Email Link
              </Button>
            </div>
          </>
        ) : (
          <>
            <MagicLinkForm onSuccess={() => {}} />
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setAuthMethod("password")}
                className="text-sm text-muted-foreground"
              >
                Sign in with Password
              </Button>
            </div>
          </>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <span>Need an account? </span>
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
