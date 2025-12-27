"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { PublicOnlyPage } from "@/components/auth/PublicOnlyPage";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <PublicOnlyPage>
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </Link>

        <RegisterForm onSuccess={() => router.push("/dashboard")} />
      </div>
    </PublicOnlyPage>
  );
}
