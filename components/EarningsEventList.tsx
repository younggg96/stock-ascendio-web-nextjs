"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EarningsEvent } from "@/lib/earningsApi";

interface EarningsEventListProps {
  events: EarningsEvent[];
  timeType: "bmo" | "amc";
  onEventClick?: () => void;
}

interface ThemeConfig {
  title: string;
  bgColor: string;
  borderColor: string;
  hoverBorderColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  logoBorder: string;
  hoverTextColor: string;
  dataBorder: string;
  dotColor: string;
}

const themeConfigs: Record<"bmo" | "amc", ThemeConfig> = {
  bmo: {
    title: "Pre-market",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    hoverBorderColor: "hover:border-blue-400 dark:hover:border-blue-600",
    textColor: "text-blue-700 dark:text-blue-300",
    badgeBg: "bg-blue-100 dark:bg-blue-900/40",
    badgeText: "text-blue-700 dark:text-blue-300",
    logoBorder: "border-blue-200 dark:border-blue-700",
    hoverTextColor: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    dataBorder: "border-blue-200 dark:border-blue-700",
    dotColor: "bg-blue-600 dark:bg-blue-400",
  },
  amc: {
    title: "After hours",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    hoverBorderColor: "hover:border-orange-400 dark:hover:border-orange-600",
    textColor: "text-orange-700 dark:text-orange-300",
    badgeBg: "bg-orange-100 dark:bg-orange-900/40",
    badgeText: "text-orange-700 dark:text-orange-300",
    logoBorder: "border-orange-200 dark:border-orange-700",
    hoverTextColor:
      "group-hover:text-orange-600 dark:group-hover:text-orange-400",
    dataBorder: "border-orange-200 dark:border-orange-700",
    dotColor: "bg-orange-600 dark:bg-orange-400",
  },
};

export default function EarningsEventList({
  events,
  timeType,
  onEventClick,
}: EarningsEventListProps) {
  const router = useRouter();
  const theme = themeConfigs[timeType];

  // 按 Revenue 从大到小排序
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const revenueA = a.revenueEstimate || 0;
      const revenueB = b.revenueEstimate || 0;
      return revenueB - revenueA; // 从大到小
    });
  }, [events]);

  if (events.length === 0) return null;

  const handleEventClick = (symbol: string) => {
    router.push(`/dashboard/stock/${symbol}`);
    onEventClick?.();
  };

  return (
    <div className="w-1/2">
      <div className="flex items-center gap-2 mb-3">
        {timeType === "amc" && (
          <div className={`w-2 h-2 rounded-full ${theme.dotColor}`}></div>
        )}
        <h3 className={`text-sm font-bold ${theme.textColor}`}>
          {theme.title} ({sortedEvents.length})
        </h3>
      </div>
      <div className="space-y-1.5">
        {sortedEvents.map((event, index) => (
          <div
            key={index}
            className={`group ${theme.bgColor} rounded-md p-2.5 border ${theme.borderColor} ${theme.hoverBorderColor} hover:shadow-md transition-all cursor-pointer`}
            onClick={() => handleEventClick(event.symbol)}
          >
            <div className="flex items-start justify-between gap-3">
              {/* 左侧：公司信息 */}
              <div className="flex items-start gap-2 flex-1">
                {event.logo && (
                  <div
                    className={`w-5 h-5 bg-white dark:bg-gray-800 rounded flex items-center justify-center flex-shrink-0 border ${theme.logoBorder} overflow-hidden`}
                  >
                    <Image
                      src={event.logo}
                      alt={event.companyName}
                      width={20}
                      height={20}
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`text-sm font-bold text-gray-900 dark:text-white ${theme.hoverTextColor} transition-colors`}
                    >
                      {event.symbol}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 ${theme.badgeBg} rounded-full ${theme.badgeText} font-semibold`}
                    >
                      {theme.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-white/80 mb-0.5 truncate">
                    {event.companyName}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-white/50">
                    {event.sector && (
                      <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded">
                        {event.sector}
                      </span>
                    )}
                    {event.quarter && event.year && (
                      <span className="px-1.5 py-0.5 bg-primary/10 rounded text-primary font-semibold">
                        Q{event.quarter} {event.year}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 右侧：财务数据 */}
              <div className="flex gap-2 flex-shrink-0">
                {event.epsEstimate !== null &&
                  event.epsEstimate !== undefined && (
                    <div
                      className={`text-right rounded p-2 min-w-[70px] border ${theme.dataBorder}`}
                    >
                      <div className="text-[9px] text-gray-500 dark:text-white/50 mb-0.5">
                        EPS Est.
                      </div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">
                        ${event.epsEstimate.toFixed(2)}
                      </div>
                      {event.epsActual !== null &&
                        event.epsActual !== undefined && (
                          <div
                            className={`text-[10px] font-semibold mt-0.5 ${
                              event.epsActual >= event.epsEstimate
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            Act: ${event.epsActual.toFixed(2)}
                          </div>
                        )}
                    </div>
                  )}
                {event.revenueEstimate && (
                  <div
                    className={`text-right rounded p-2 min-w-[70px] border ${theme.dataBorder}`}
                  >
                    <div className="text-[9px] text-gray-500 dark:text-white/50 mb-0.5">
                      Revenue Est.
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                      ${(event.revenueEstimate / 1e9).toFixed(1)}B
                    </div>
                    {event.revenueActual && (
                      <div
                        className={`text-[10px] font-semibold mt-0.5 ${
                          event.revenueActual >= event.revenueEstimate
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        Act: ${(event.revenueActual / 1e9).toFixed(1)}B
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
