"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
} from "lucide-react";
import UserMenu from "./UserMenu";

const navItems = [
  {
    icon: LayoutDashboard,
    title: "Home",
    href: "/dashboard",
  },
  { icon: Newspaper, title: "News", href: "/dashboard/news" },
  { icon: TrendingUp, title: "Stocks", href: "/dashboard/stocks" },
  { icon: Users, title: "KOL Tracker", href: "/dashboard/kol" },
  { icon: Settings, title: "Settings", href: "/dashboard/settings" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-card-dark flex flex-col p-2.5 border-r border-border-light dark:border-border-dark transition-all duration-300 
        ${isCollapsed ? "w-[60px]" : "w-[200px]"}
        lg:relative lg:translate-x-0
        fixed inset-y-0 left-0 z-50 lg:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo and Toggle */}
        <div
          className={`flex items-center mb-5 mt-2 ${
            isCollapsed ? "justify-center" : "justify-between px-1.5"
          }`}
        >
          <Link href="/" className="flex items-center justify-center gap-1">
            <Image
              src="/logo.svg"
              alt="Ascendio AI Logo"
              width={20}
              height={20}
              className="cursor-pointer"
              priority
              unoptimized
            />
            {!isCollapsed && (
              <span className="text-gray-900 dark:text-white text-base font-bold">
                Ascendio
              </span>
            )}
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 transition-colors"
            title="Close menu"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Collapse button for desktop */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:flex items-center justify-center text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapse button when collapsed (desktop only) */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="hidden lg:flex items-center justify-center h-9 w-9 mx-auto mb-3 text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 hover:bg-gray-200 dark:hover:bg-white/5 rounded-lg transition-all duration-200"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Check if current path matches this nav item
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href) && item.href !== "#";

            return (
              <Link
                key={item.title}
                href={item.href}
                title={item.title}
                onClick={onClose}
                className={`flex items-center gap-2 h-9 rounded-lg transition-all duration-200 ${
                  isCollapsed ? "justify-center w-9 mx-auto lg:flex" : "px-2.5"
                } ${
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/70"
                }`}
              >
                <Icon className="w-4 h-4" />
                {!isCollapsed && (
                  <span className="text-xs font-medium">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Menu */}
        <div className="mt-auto">
          <UserMenu isCollapsed={isCollapsed} />
        </div>
      </aside>
    </>
  );
}
