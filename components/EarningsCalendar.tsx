"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Building2,
  RefreshCw,
} from "lucide-react";
import {
  EarningsEvent,
  groupEarningsByDate,
  formatEarningsDate,
  getEarningsTimeLabel,
} from "@/lib/earningsApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EarningsEventList from "@/components/EarningsEventList";

interface EarningsCalendarProps {
  from?: string;
  to?: string;
  compact?: boolean;
  maxEvents?: number;
}

export default function EarningsCalendar({
  from,
  to,
  compact = false,
  maxEvents,
}: EarningsCalendarProps) {
  const router = useRouter();
  const [earnings, setEarnings] = useState<EarningsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 缓存配置
  const CACHE_PREFIX = "earnings_cache_";
  const CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存

  // 生成缓存key
  const getCacheKey = (fromDate: string, toDate: string) => {
    return `${CACHE_PREFIX}${fromDate}_${toDate}`;
  };

  // 从缓存读取数据
  const getFromCache = (key: string) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // 检查缓存是否过期
      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error reading from cache:", err);
      return null;
    }
  };

  // 保存到缓存
  const saveToCache = (key: string, data: any) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (err) {
      console.error("Error saving to cache:", err);
    }
  };

  // 清理过期的缓存
  const cleanExpiredCache = () => {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      let cleanedCount = 0;

      keys.forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          try {
            const cached = localStorage.getItem(key);
            if (cached) {
              const { timestamp } = JSON.parse(cached);
              if (now - timestamp > CACHE_DURATION) {
                localStorage.removeItem(key);
                cleanedCount++;
              }
            }
          } catch {
            // 如果解析失败，删除该缓存
            localStorage.removeItem(key);
            cleanedCount++;
          }
        }
      });

      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
      }
    } catch (err) {
      console.error("Error cleaning cache:", err);
    }
  };

  const fetchEarnings = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        // 如果没有指定日期范围，获取当前月份的财报
        let fromDate = from;
        let toDate = to;

        if (!from || !to) {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();

          // 月初
          const firstDay = new Date(year, month, 1);
          // 月末
          const lastDay = new Date(year, month + 1, 0);

          fromDate = firstDay.toISOString().split("T")[0];
          toDate = lastDay.toISOString().split("T")[0];
        }

        const cacheKey = getCacheKey(fromDate!, toDate!);

        // 尝试从缓存读取（除非强制刷新）
        if (!forceRefresh) {
          const cachedData = getFromCache(cacheKey);
          if (cachedData) {
            console.log("✅ Loading earnings from cache");
            setEarnings(
              maxEvents ? cachedData.slice(0, maxEvents) : cachedData
            );
            setIsFromCache(true);
            setLoading(false);
            return;
          }
        }

        // 从API获取数据
        let url = "/api/earnings";
        const params = new URLSearchParams();
        if (fromDate) params.append("from", fromDate);
        if (toDate) params.append("to", toDate);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch earnings");

        const data = await response.json();

        // 保存到缓存
        saveToCache(cacheKey, data);
        setIsFromCache(false);

        setEarnings(maxEvents ? data.slice(0, maxEvents) : data);
      } catch (err) {
        console.error("Error fetching earnings:", err);
        setError("Failed to load earnings calendar");
      } finally {
        setLoading(false);
      }
    },
    [from, to, currentDate, maxEvents]
  );

  useEffect(() => {
    // 清理过期缓存
    cleanExpiredCache();
    // 获取数据
    fetchEarnings();
  }, [fetchEarnings]);

  const groupedEarnings = useMemo(
    () => groupEarningsByDate(earnings),
    [earnings]
  );

  // 获取有财报事件的日期集合
  const datesWithEarnings = useMemo(() => {
    return new Set(Object.keys(groupedEarnings));
  }, [groupedEarnings]);

  // 生成周视图日历（只显示工作日和有财报的周）
  const weeksWithEarnings = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 本月第一天和最后一天
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // 计算第一周的起始日期（从周日开始，但我们只会使用周一到周五）
    const firstDayWeekday = firstDayOfMonth.getDay();
    const firstWeekStart = new Date(firstDayOfMonth);
    firstWeekStart.setDate(firstDayOfMonth.getDate() - firstDayWeekday);

    const weeks = [];
    let currentWeekStart = new Date(firstWeekStart);

    // 生成所有可能的周
    while (
      currentWeekStart <= lastDayOfMonth ||
      currentWeekStart.getMonth() === month
    ) {
      const week = [];
      let hasEarnings = false;

      // 只生成工作日（周一到周五，即 weekday 1-5）
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        const weekday = date.getDay();

        // 跳过周末（0=周日, 6=周六）
        if (weekday === 0 || weekday === 6) {
          continue;
        }

        const dateStr = date.toISOString().split("T")[0];
        const isCurrentMonth = date.getMonth() === month;

        week.push({
          date,
          dateStr,
          isCurrentMonth,
          hasEarnings: datesWithEarnings.has(dateStr),
        });

        // 如果这一周有任何财报事件，标记这一周
        if (datesWithEarnings.has(dateStr)) {
          hasEarnings = true;
        }
      }

      // 只添加有财报的周
      if (hasEarnings && week.length > 0) {
        weeks.push(week);
      }

      // 移动到下一周
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);

      // 如果已经超出本月很多，停止
      if (
        currentWeekStart.getMonth() > month &&
        currentWeekStart.getDate() > 7
      ) {
        break;
      }
    }

    return weeks;
  }, [currentDate, datesWithEarnings]);

  // 获取指定日期的财报事件
  const getEventsForDate = (dateStr: string) => {
    return groupedEarnings[dateStr] || [];
  };

  // 按盘前/盘后分组财报事件
  const groupEventsByTime = (events: any[]) => {
    const bmo = events.filter((e) => e.time === "bmo");
    const amc = events.filter((e) => e.time === "amc");
    const other = events.filter(
      (e) => !e.time || (e.time !== "bmo" && e.time !== "amc")
    );
    return { bmo, amc, other };
  };

  // 判断是否是今天
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // 切换月份
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 手动刷新数据
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchEarnings(true); // 强制刷新
    setTimeout(() => setIsRefreshing(false), 500); // 延迟一下让动画更明显
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-100 dark:bg-white/5 rounded-lg"></div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 dark:bg-white/5 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-white/50">
        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // 紧凑模式（列表视图）
  if (compact) {
    return (
      <div className="space-y-3">
        {earnings.slice(0, maxEvents).map((event, index) => {
          const isBMO = event.time === "bmo";
          const isAMC = event.time === "amc";

          return (
            <div
              key={`${event.symbol}-${index}`}
              className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10 last:border-0"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${
                    isBMO
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : isAMC
                      ? "bg-orange-100 dark:bg-orange-900/30"
                      : "bg-primary/10"
                  }
                `}
                >
                  <Building2
                    className={`
                    w-5 h-5
                    ${
                      isBMO
                        ? "text-blue-600 dark:text-blue-400"
                        : isAMC
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-primary"
                    }
                  `}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                      {event.symbol}
                    </span>
                    {event.time && (
                      <span
                        className={`
                        text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                        ${
                          isBMO
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                            : isAMC
                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-700"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }
                      `}
                      >
                        {isBMO
                          ? "盘前"
                          : isAMC
                          ? "盘后"
                          : getEarningsTimeLabel(event.time)}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-white/50 truncate">
                      {event.companyName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-500 dark:text-white/50">
                      {formatEarningsDate(event.date)}
                    </span>
                  </div>
                </div>
              </div>
              {event.epsEstimate !== null &&
                event.epsEstimate !== undefined && (
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-white/50">
                      EPS Est.
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${event.epsEstimate.toFixed(2)}
                    </div>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    );
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"]; // 只显示工作日
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // 周日历视图（只显示工作日和有财报的周）
  return (
    <div className="space-y-4">
      {/* 月份导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          {isFromCache && !loading && (
            <span className="text-[10px] px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
              Cached
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 dark:text-white/70 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-md text-gray-700 dark:text-white transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-white/70" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-white/70" />
          </button>
        </div>
      </div>

      {/* 星期标题（只显示工作日） */}
      <div className="grid grid-cols-5 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 dark:text-white/50 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 只显示有财报的周（只显示工作日） */}
      {weeksWithEarnings.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-white/50">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No earnings reports this month</p>
        </div>
      ) : (
        <div className="space-y-2">
          {weeksWithEarnings.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-5 gap-1">
              {week.map((dayInfo, dayIndex) => {
                const events = getEventsForDate(dayInfo.dateStr);
                const hasEvents = dayInfo.hasEarnings;
                const isTodayDate = isToday(dayInfo.date);
                const { bmo, amc } = groupEventsByTime(events);

                return (
                  <div
                    key={dayIndex}
                    className={`
                      min-h-[160px] p-2 rounded-lg border transition-all
                      ${
                        dayInfo.isCurrentMonth
                          ? "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-white/10"
                          : "bg-gray-50 dark:bg-gray-900/30 border-gray-100 dark:border-white/5"
                      }
                      ${
                        hasEvents
                          ? "hover:border-primary dark:hover:border-primary hover:shadow-md cursor-pointer"
                          : ""
                      }
                      ${isTodayDate ? "ring-2 ring-primary" : ""}
                    `}
                    onClick={() => {
                      if (hasEvents) {
                        setSelectedDate(dayInfo.dateStr);
                        setIsModalOpen(true);
                      }
                    }}
                  >
                    {/* 日期数字 */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`
                        text-sm font-semibold
                        ${
                          dayInfo.isCurrentMonth
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-400 dark:text-white/30"
                        }
                        ${isTodayDate ? "text-primary" : ""}
                      `}
                      >
                        {dayInfo.date.getDate()}
                      </span>
                      {hasEvents && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                          {events.length}
                        </span>
                      )}
                    </div>

                    {/* 盘前财报 (BMO) */}
                    {bmo.length > 0 && (
                      <div className="mb-2">
                        <div className="text-[8px] font-semibold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                          Before Market Open ({bmo.length})
                        </div>
                        <div className="space-y-1">
                          {bmo.slice(0, 2).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="flex items-center gap-1 px-1.5 py-1 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer border border-blue-200 dark:border-blue-800"
                              title={`${event.symbol} - ${event.companyName} (Pre-market)`}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/stock/${event.symbol}`);
                              }}
                            >
                              {event.logo && (
                                <div className="w-4 h-4 bg-white rounded-sm flex-shrink-0 overflow-hidden">
                                  <Image
                                    src={event.logo}
                                    alt={event.symbol}
                                    width={16}
                                    height={16}
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <div className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 truncate">
                                {event.symbol}
                              </div>
                            </div>
                          ))}
                          {bmo.length > 2 && (
                            <div className="text-[9px] text-blue-600 dark:text-blue-400 text-center">
                              +{bmo.length - 2}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 盘后财报 (AMC) */}
                    {amc.length > 0 && (
                      <div className="mb-1">
                        <div className="text-[8px] font-semibold text-orange-600 dark:text-orange-400 mb-1 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400"></div>
                          After hours ({amc.length})
                        </div>
                        <div className="space-y-1">
                          {amc.slice(0, 2).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="flex items-center gap-1 px-1.5 py-1 bg-orange-50 dark:bg-orange-900/20 rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer border border-orange-200 dark:border-orange-800"
                              title={`${event.symbol} - ${event.companyName} (After-hours)`}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/stock/${event.symbol}`);
                              }}
                            >
                              {event.logo && (
                                <div className="w-4 h-4 bg-white rounded-sm flex-shrink-0 overflow-hidden">
                                  <Image
                                    src={event.logo}
                                    alt={event.symbol}
                                    width={16}
                                    height={16}
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <div className="text-[10px] font-semibold text-orange-700 dark:text-orange-300 truncate">
                                {event.symbol}
                              </div>
                            </div>
                          ))}
                          {amc.length > 2 && (
                            <div className="text-[9px] text-orange-600 dark:text-orange-400 text-center">
                              +{amc.length - 2}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Modal 显示选中日期的所有财报 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[80vw] max-w-[90vw] h-fit max-h-[85vh] !p-0 !gap-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
            <DialogTitle>
              {selectedDate && formatEarningsDate(selectedDate)}
            </DialogTitle>
            <DialogDescription>
              {selectedDate && groupedEarnings[selectedDate] && (
                <>
                  {groupedEarnings[selectedDate].length}{" "}
                  {groupedEarnings[selectedDate].length === 1
                    ? "Company"
                    : "Companies"}{" "}
                  Reporting Earnings
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="w-full h-auto overflow-y-auto max-h-[calc(85vh-100px)] px-6 py-4">
            {selectedDate && groupedEarnings[selectedDate] && (
              <div className="flex w-auto h-auto gap-4">
                <EarningsEventList
                  events={groupedEarnings[selectedDate].filter(
                    (e) => e.time === "bmo"
                  )}
                  timeType="bmo"
                  onEventClick={() => setIsModalOpen(false)}
                />
                <EarningsEventList
                  events={groupedEarnings[selectedDate].filter(
                    (e) => e.time === "amc"
                  )}
                  timeType="amc"
                  onEventClick={() => setIsModalOpen(false)}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
