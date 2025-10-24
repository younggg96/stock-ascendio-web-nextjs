import { Menu } from "lucide-react";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export default function Header({ title = "Home", onMenuClick }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-4 lg:px-6 py-3 lg:py-4 h-[48px] lg:h-[56px] border-b border-border-light dark:border-border-dark">
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/70 transition-all"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-[16px] lg:text-[18px] font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>
    </header>
  );
}
