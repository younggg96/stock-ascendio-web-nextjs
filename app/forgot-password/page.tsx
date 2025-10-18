"use client";

import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#060806]">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060806]/90 to-[#060806] z-0"></div>

      {/* Ambient Light Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-2 group transition-all"
        >
          <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
            candlestick_chart
          </span>
          <span className="text-white text-lg sm:text-xl font-bold group-hover:text-primary transition-colors">
            Ascendio
          </span>
        </Link>
        <Link
          href="/dashboard"
          className="text-white/80 hover:text-white transition-all duration-200 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 hover:border-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20"
        >
          Dashboard
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-start justify-center text-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-sm sm:max-w-md">
          <ForgotPasswordForm />
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
