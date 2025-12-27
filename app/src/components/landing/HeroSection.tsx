import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className = "" }: HeroSectionProps) {
  const avatars = ["SC", "MJ", "ED", "AT", "JR"];

  return (
    <section className={`max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24 ${className}`}>
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Left Column - Content */}
        <div>
          {/* Gradient Badge */}
          <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700">
            AI-Powered Review Platform
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            From AI output to stakeholder feedback in one click
          </h1>

          {/* Subheadline/Description */}
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Share HTML artifacts from Claude Code, Cursor, or any AI tool. Get inline feedback from your team. Zero format loss.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-base font-semibold rounded-lg shadow-sm"
              >
                Start Free
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-2 px-8 py-6 text-base font-semibold rounded-lg"
            >
              See Demo
            </Button>
          </div>

          {/* Social Proof - Avatar Stack */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {avatars.map((initials, i) => (
                <Avatar key={i} className="w-8 h-8 border-2 border-white">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Trusted by <span className="font-semibold">500+ product teams</span> at tech companies
            </p>
          </div>
        </div>

        {/* Right Column - Product Mockup */}
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-2xl">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              {/* Mock Browser Window */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 font-mono">
                  artifactreview.com/doc/abc123
                </div>
              </div>

              {/* Mock Document Content */}
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>

                {/* Mock Comment */}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                        SC
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-gray-900">Sarah Chen</span>
                    <span className="text-xs text-gray-500">2 mins ago</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Love this section! Can we add more details about the pricing model?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
