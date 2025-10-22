import Image from "next/image";
import { Menu } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  currentTime: Date | null;
  isLoading?: boolean;
  hasError?: boolean;
  onMenuClick?: () => void;
}

export default function Header({
  title = "Market Overview",
  subtitle,
  currentTime,
  isLoading,
  hasError,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-3 lg:mb-5 px-4 lg:px-6 pt-3 lg:pt-6 h-[60px] lg:h-[76px]">
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/70 transition-all"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-[18px] lg:text-[22px] font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-[10px] lg:text-[12px] text-gray-500 dark:text-white/40 mt-0.5 lg:mt-1">
            {subtitle ? (
              subtitle
            ) : currentTime ? (
              <>
                Last updated:{" "}
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </>
            ) : null}
          </p>
        </div>
      </div>
    </header>
  );
}
