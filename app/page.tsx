"use client";

import EmailSignup from "@/components/EmailSignup";
import TypewriterText from "@/components/TypewriterText";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-dark">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/80 to-background-dark z-0"></div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 flex justify-between items-center">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
            candlestick_chart
          </span>
          <span className="text-white text-lg sm:text-xl font-bold">
            Ascendio
          </span>
        </div>
        {/* <Link
          href="/dashboard"
          className="text-white/80 hover:text-white transition-colors text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 hover:border-primary hover:bg-primary/10"
        >
          Dashboard
        </Link> */}
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-start justify-center text-center px-4 sm:px-6 md:px-8 pt-12 sm:pt-16 md:pt-20">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <div className="flex flex-col gap-8 sm:gap-12 items-center justify-center">
            <div className="flex flex-col gap-1 sm:gap-2">
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter min-h-[80px] sm:min-h-[100px] md:min-h-[120px] flex items-center justify-center px-2">
                <TypewriterText
                  phrases={[
                    "Welcome to Ascendio",
                    "The Future of Investing",
                    "Smart Stock Analysis",
                    "Real-Time Market Data",
                    "Your Investment Partner",
                  ]}
                  typingSpeed={80}
                  deletingSpeed={40}
                  delayBetweenPhrases={2500}
                />
              </h1>
              <h2 className="text-white/70 text-sm sm:text-base md:text-lg font-normal px-4">
                Sign up for early access or updates.
              </h2>
            </div>
            <EmailSignup />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-white/50">
          <p className="order-2 md:order-1">
            © 2025 Ascendio. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 order-1 md:order-2">
            <Link
              href="#"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
