"use client";

import EmailSignup from "@/components/EmailSignup";
import TypewriterText from "@/components/TypewriterText";
import LandingHeader from "@/components/LandingHeader";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-light/90 dark:via-background-dark/90 to-background-light dark:to-background-dark z-0"></div>

      {/* Header */}
      <LandingHeader variant="light" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center text-center px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <div className="flex flex-col gap-8 sm:gap-12 items-center justify-center">
            <div className="flex flex-col gap-1 sm:gap-2">
              <h1 className="text-gray-900 dark:text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter min-h-[80px] sm:min-h-[100px] md:min-h-[120px] flex items-center justify-center px-2">
                <TypewriterText
                  phrases={[
                    "Welcome to Ascendio AI",
                    "Track Social Media KOLs",
                    "AI-Powered Investment Analysis",
                    "Monitor Retail Sentiment",
                    "Follow the Smart Money",
                    "AI-Ranked Stock Ideas",
                    "Multi-Platform Intelligence",
                  ]}
                  typingSpeed={80}
                  deletingSpeed={40}
                  delayBetweenPhrases={2500}
                />
              </h1>
              <h2 className="text-gray-700 dark:text-white/70 text-sm sm:text-base md:text-lg font-normal px-4">
                Sign up for early access or updates.
              </h2>
            </div>
            <EmailSignup />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-white/50">
          <p className="order-2 md:order-1">
            © 2025 Ascendio AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 order-1 md:order-2">
            <Link
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
