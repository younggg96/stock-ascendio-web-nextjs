"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn, getErrorMessage } from "@/lib/supabase/auth";
import { toast } from "sonner";
import { Button } from "./ui/button";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (mode === "signup" && !name) {
      toast.error("Please enter your name");
      setIsLoading(false);
      return;
    }

    // Call Supabase Auth
    if (mode === "login") {
      // Sign in
      const result = await signIn({ email, password });

      if (result.success) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        toast.error(getErrorMessage(result.errorCode, result.error));
      }
      setIsLoading(false);
    } else {
      // Sign up
      const result = await signUp({ email, password, name });

      if (result.success) {
        toast.success(
          "Account created! Please check your email to verify your account."
        );
        setIsLoading(false);
      } else {
        toast.error(getErrorMessage(result.errorCode, result.error));
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-0 animate-fade-in-up">
      <div className="relative bg-white dark:bg-[#0a0e0a] backdrop-blur-xl border border-gray-200 dark:border-[#1a1f1a] rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div className="relative z-10">
          {/* Mode Toggle */}
          <div className="relative flex gap-2 mb-6 sm:mb-8 bg-gray-100 dark:bg-black/40 rounded-full p-1.5 border border-gray-200 dark:border-white/5">
            {/* Sliding Background Indicator */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-10px)] bg-primary rounded-full shadow-lg shadow-primary/30 transition-all duration-300 ease-out ${
                mode === "login" ? "left-1.5" : "left-[calc(50%+4px)]"
              }`}
            ></div>

            <Button
              variant="ghost"
              type="button"
              onClick={() => onModeChange("login")}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-300 relative z-10 hover:bg-transparent dark:hover:bg-transparent ${
                mode === "login"
                  ? "text-white dark:text-background-dark"
                  : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Login
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => onModeChange("signup")}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-300 relative z-10 hover:bg-transparent dark:hover:bg-transparent ${
                mode === "signup"
                  ? "text-white dark:text-background-dark"
                  : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Sign Up
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div
              className={`transition-all duration-300 overflow-hidden ${
                mode === "signup"
                  ? "max-h-24 opacity-100 mb-0"
                  : "max-h-0 opacity-0 -mb-4"
              }`}
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-gray-800 dark:text-white/90 text-sm font-medium text-left"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full h-12 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-black/30 border border-gray-300 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 dark:placeholder:text-white/30 px-4 text-sm font-normal focus:outline-none transition-all duration-300 hover:border-gray-400 dark:hover:border-white/20"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-gray-800 dark:text-white/90 text-sm font-medium text-left"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full h-12 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-black/30 border border-gray-300 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 dark:placeholder:text-white/30 px-4 text-sm font-normal focus:outline-none transition-all duration-300 hover:border-gray-400 dark:hover:border-white/20"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-gray-800 dark:text-white/90 text-sm font-medium text-left"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full h-12 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-black/30 border border-gray-300 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 dark:placeholder:text-white/30 px-4 text-sm font-normal focus:outline-none transition-all duration-300 hover:border-gray-400 dark:hover:border-white/20"
                placeholder={
                  mode === "login" ? "Enter your password" : "Create a password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                mode === "login" ? "max-h-8 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-primary text-xs hover:text-primary/80 transition-all duration-200 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 rounded-lg bg-gradient-to-r from-primary to-primary/90 text-white dark:text-background-dark text-sm font-bold tracking-wide hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading
                ? "Processing..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent"></div>
            <span className="text-gray-500 dark:text-white/40 text-xs font-medium">
              OR
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent"></div>
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="w-full h-11 rounded-lg bg-gray-50 dark:bg-black/30 border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white text-sm font-medium hover:bg-gray-100 dark:hover:bg-black/50 hover:border-gray-400 dark:hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
