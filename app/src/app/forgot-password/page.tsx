"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { PublicOnlyPage } from "@/components/auth/PublicOnlyPage";

export default function ForgotPasswordPage() {
  return (
    <PublicOnlyPage>
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Back Button */}
        <Link
          href="/login"
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Login</span>
        </Link>

        <ForgotPasswordForm />
      </div>
    </PublicOnlyPage>
  );
}
