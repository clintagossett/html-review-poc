"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PublicOnlyPage } from "@/components/auth/PublicOnlyPage";

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/dashboard");
  };

  return (
    <PublicOnlyPage>
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-blue-50 via-white to-purple-50">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </Link>

        <LoginForm onSuccess={handleSuccess} />
      </div>
    </PublicOnlyPage>
  );
}
