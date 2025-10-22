import { ReactNode } from "react";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export default function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div
      className={`bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
