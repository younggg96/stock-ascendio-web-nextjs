"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth, useUserProfile } from "@/hooks";
import { Button } from "./ui/button";

export default function LandingHeader() {
  const { theme } = useTheme();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { profile } = useUserProfile();
  const router = useRouter();
  const textColorClass =
    theme === "dark" ? "text-white" : "text-gray-900 dark:text-white";
  const isAuthRoute = usePathname() === "/auth";

  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const handleAvatarClick = () => {
    router.push("/dashboard");
  };

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
      <div className="flex items-center gap-3 sm:gap-4">
        {!isLoading && (
          <>
            {isAuthenticated ? (
              <>
                {/* Mobile: Simple avatar button to go to dashboard */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAvatarClick}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity dark:hover:!bg-transparent"
                  title="Go to Dashboard"
                >
                  {profile?.avatar_url ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                      <Image
                        src={profile.avatar_url}
                        alt="Profile"
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                      {getInitials()}
                    </div>
                  )}
                </Button>
              </>
            ) : (
              !isAuthRoute && (
                <Link
                  href="/auth"
                  className="text-sm text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 transition-colors"
                >
                  Sign In
                </Link>
              )
            )}
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
