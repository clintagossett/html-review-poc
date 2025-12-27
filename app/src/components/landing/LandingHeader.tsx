import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

interface LandingHeaderProps {
  className?: string;
}

export function LandingHeader({ className = "" }: LandingHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 ${className}`}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-4 flex items-center justify-between">
        {/* Left Section - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold text-gray-900">Artifact Review</span>
        </Link>

        {/* Center Section - Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            FAQ
          </a>
        </nav>

        {/* Right Section - CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Start Free
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
