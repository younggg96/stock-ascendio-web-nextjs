import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

interface LandingHeaderProps {
  variant?: "light" | "dark";
}

export default function LandingHeader({
  variant = "light",
}: LandingHeaderProps) {
  const textColorClass =
    variant === "dark" ? "text-white" : "text-gray-900 dark:text-white";

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
        />
        <span
          className={`${textColorClass} text-lg sm:text-xl font-bold group-hover:text-primary transition-colors`}
        >
          Ascendio
        </span>
      </Link>
      <ThemeToggle />
    </header>
  );
}
