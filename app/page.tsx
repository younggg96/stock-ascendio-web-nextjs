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
      <header className="relative z-10 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">
            candlestick_chart
          </span>
          <span className="text-white text-xl font-bold">Ascendio</span>
        </div>
        <Link
          href="/dashboard"
          className="text-white/80 hover:text-white transition-colors text-sm font-medium"
        >
          Dashboard
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center text-center px-4">
        <div className="w-full max-w-2xl">
          <div className="flex min-h-[480px] flex-col gap-8 items-center justify-center">
            <div className="flex flex-col gap-3">
              <h1 className="text-white text-5xl font-black tracking-tighter min-h-[120px] flex items-center justify-center">
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
              <h2 className="text-white/70 text-lg font-normal">
                Sign up for early access or updates.
              </h2>
            </div>
            <EmailSignup />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>© 2025 Ascendio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
          {/* <div className="flex justify-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">group</span>
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">hub</span>
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">
                apartment
              </span>
            </Link>
          </div> */}
        </div>
      </footer>
    </div>
  );
}
