"use client";

import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import LandingHeader from "@/components/LandingHeader";
import Footer from "@/components/Footer";

export default function ForgotPasswordPageClient() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-light/90 dark:via-background-dark/90 to-background-light dark:to-background-dark z-0"></div>

      {/* Ambient Light Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      {/* Header */}
      <LandingHeader />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-start justify-center text-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-sm sm:max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
