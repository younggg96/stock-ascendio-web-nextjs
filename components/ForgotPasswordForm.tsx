"use client";

import { useState, FormEvent } from "react";
import { KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Basic validation
    if (!email) {
      setMessage("Please enter your email address");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      setMessage(
        "If an account exists with this email, you will receive password reset instructions."
      );
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-0 animate-fade-in-up">
      <div className="relative bg-[#0a0e0a] backdrop-blur-xl border border-[#1a1f1a] rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div className="relative z-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <KeyRound className="text-primary w-8 h-8" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Forgot Password?
            </h2>
            <p className="text-white/60 text-sm">
              Enter your email and we&apos;ll send you instructions to reset
              your password.
            </p>
          </div>

          {/* Form */}
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-white/90 text-sm font-medium text-left"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full h-12 rounded-lg text-white bg-black/30 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-white/30 px-4 text-sm font-normal focus:outline-none transition-all duration-300 hover:border-white/20"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-2 rounded-lg bg-gradient-to-r from-primary to-primary/90 text-background-dark text-sm font-bold tracking-wide hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>

              {message && !isSuccess && (
                <p className="text-xs text-center animate-fade-in text-red-400">
                  {message}
                </p>
              )}
            </form>
          ) : (
            <div className="animate-fade-in">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                <p className="text-primary text-sm text-center">{message}</p>
              </div>
              <div className="text-center text-white/60 text-xs mb-4">
                <p>Didn&apos;t receive the email? Check your spam folder.</p>
              </div>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail("");
                  setMessage("");
                }}
                className="w-full h-12 rounded-lg bg-black/30 border border-white/10 text-white text-sm font-medium hover:bg-black/50 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Try Another Email
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 text-white/60 hover:text-primary text-sm transition-all duration-200 group"
            >
              <ArrowLeft className="w-[18px] h-[18px] group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
