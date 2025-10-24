import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  // Header props
  title?: string;
  titleSize?: "sm" | "md" | "lg";
  icon?: ReactNode;
  showLiveIndicator?: boolean;
  headerExtra?: ReactNode;
  headerBorder?: boolean;

  // SectionHeader props (optional, 使用这些会替换默认的简单 header)
  useSectionHeader?: boolean;
  sectionHeaderIcon?: LucideIcon;
  sectionHeaderSubtitle?: string;
  sectionHeaderAction?: ReactNode;

  // Content props
  children: ReactNode;
  scrollable?: boolean;
  contentClassName?: string;
  maxHeight?: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;

  // Container props
  className?: string;
  padding?: "sm" | "md" | "lg" | "none";
}

export default function SectionCard({
  title,
  titleSize = "md",
  icon,
  showLiveIndicator = false,
  headerExtra,
  headerBorder = false,
  useSectionHeader = false,
  sectionHeaderIcon,
  sectionHeaderSubtitle,
  sectionHeaderAction,
  children,
  scrollable = false,
  contentClassName = "",
  maxHeight,
  onScroll,
  className = "",
  padding = "md",
}: SectionCardProps) {
  const titleSizeClasses = {
    sm: "text-[16px]",
    md: "text-[17px]",
    lg: "text-lg",
  };

  const headerPaddingClasses = {
    none: "px-4 pt-4",
    sm: "px-3 pt-3",
    md: "px-4 pt-4",
    lg: "px-4 pt-4",
  };

  const headerBottomClasses = {
    withBorder: "pb-4",
    withoutBorder: "pb-4",
  };

  return (
    <div
      className={`bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg transition-colors duration-300 flex flex-col ${
        scrollable ? "overflow-hidden" : ""
      } ${className}`}
    >
      {/* Header */}
      {useSectionHeader && sectionHeaderIcon ? (
        <div className={headerPaddingClasses[padding]}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                {(() => {
                  const Icon = sectionHeaderIcon;
                  return <Icon className="w-3.5 h-3.5 text-primary" />;
                })()}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                {sectionHeaderSubtitle && (
                  <p className="text-[11px] sm:text-xs text-gray-600 dark:text-white/60">
                    {sectionHeaderSubtitle}
                  </p>
                )}
              </div>
            </div>
            {sectionHeaderAction && (
              <div className="w-full sm:w-auto">{sectionHeaderAction}</div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`flex items-center justify-between ${
            headerBorder
              ? `border-b border-border-light dark:border-border-dark ${headerBottomClasses.withBorder}`
              : headerBottomClasses.withoutBorder
          } ${headerPaddingClasses[padding]}`}
        >
          <div className="flex items-center gap-2">
            {icon && icon}
            {title && (
              <h2
                className={`${titleSizeClasses[titleSize]} font-bold text-gray-900 dark:text-white`}
              >
                {title}
              </h2>
            )}
            {headerExtra && (
              <div className="w-full sm:w-auto">{headerExtra}</div>
            )}
          </div>
          {showLiveIndicator && (
            <span className="text-primary text-xs font-bold flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              LIVE
            </span>
          )}
        </div>
      )}

      {/* Content */}
      {scrollable ? (
        <div
          className={`flex-1 overflow-y-auto ${contentClassName}`}
          onScroll={onScroll}
          style={{
            maxHeight,
          }}
        >
          {children}
        </div>
      ) : (
        <div className={contentClassName}>{children}</div>
      )}
    </div>
  );
}
