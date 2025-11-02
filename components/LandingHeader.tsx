"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export default function LandingHeader() {
  const { theme } = useTheme();
  const textColorClass =
    theme === "dark" ? "text-white" : "text-gray-900 dark:text-white";
  const isAuthRoute = usePathname() === "/auth";

  return (
    <header className="relative z-10 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 flex justify-between items-center">
      <Link
        href="/"
        className="flex items-center gap-1.5 sm:gap-2 group transition-all"
      >
        <Image
          src="/logo.svg"
          alt="Ascendio Logo"
          width={24}
          height={24}
          className="w-6 h-6 group-hover:scale-110 transition-transform"
          priority
          unoptimized
        />
        <span
          className={`${textColorClass} text-lg sm:text-xl font-bold group-hover:text-primary transition-colors`}
        >
          Ascendio
        </span>
      </Link>
      <div className="flex items-center gap-4">
        {!isAuthRoute && (
          <Link
            href="/auth"
            className="text-sm text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 transition-colors"
          >
            Sign In
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
