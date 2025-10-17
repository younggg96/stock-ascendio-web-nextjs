"use client";

import Link from "next/link";

const navItems = [
  { icon: "dashboard", title: "Dashboard", href: "/dashboard", active: true },
  { icon: "analytics", title: "Portfolio", href: "#" },
  { icon: "swap_horiz", title: "Trade", href: "#" },
  { icon: "notifications", title: "Alerts", href: "#" },
  { icon: "settings", title: "Settings", href: "#" },
];

export default function Sidebar() {
  return (
    <aside className="w-[72px] bg-card-dark/40 flex flex-col p-3.5 border-r border-border-dark/50 items-center">
      <div className="flex items-center justify-center mb-7">
        <Link href="/">
          <span className="material-symbols-outlined text-primary text-[28px] cursor-pointer">
            candlestick_chart
          </span>
        </Link>
      </div>

      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            title={item.title}
            className={`flex items-center justify-center h-11 w-11 rounded-lg transition-all duration-200 ${
              item.active
                ? "bg-primary/15 text-primary"
                : "text-white/50 hover:bg-white/5 hover:text-white/70"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <Link
          href="#"
          title="Logout"
          className="flex items-center justify-center h-11 w-11 text-white/50 hover:bg-white/5 hover:text-white/70 rounded-lg transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </Link>
      </div>
    </aside>
  );
}
