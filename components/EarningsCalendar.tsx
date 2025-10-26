"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { 
  EarningsEvent, 
  groupEarningsByDate, 
  formatEarningsDate,
  getEarningsTimeLabel 
} from "@/lib/earningsApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  maxEvents 
}: EarningsCalendarProps) {
  const router = useRouter();
  const [earnings, setEarnings] = useState<EarningsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEarnings = useCallback(async () => {
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
        
        fromDate = firstDay.toISOString().split('T')[0];
        toDate = lastDay.toISOString().split('T')[0];
      }

      let url = "/api/earnings";
      const params = new URLSearchParams();
      if (fromDate) params.append("from", fromDate);
      if (toDate) params.append("to", toDate);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch earnings");

      const data = await response.json();
      setEarnings(maxEvents ? data.slice(0, maxEvents) : data);
    } catch (err) {
      console.error("Error fetching earnings:", err);
      setError("Failed to load earnings calendar");
    } finally {
      setLoading(false);
    }
  }, [from, to, currentDate, maxEvents]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  // 生成日历网格数据
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 本月第一天
    const firstDayOfMonth = new Date(year, month, 1);
    // 本月最后一天
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // 第一天是星期几（0=周日，1=周一...）
    const firstDayWeekday = firstDayOfMonth.getDay();
    // 本月有多少天
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    
    // 填充上个月的日期
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }
    
    // 填充本月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }
    
    // 填充下个月的日期，补齐到42天（6周）
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }
    
    return days;
  }, [currentDate]);

  const groupedEarnings = useMemo(() => groupEarningsByDate(earnings), [earnings]);

  // 获取指定日期的财报事件
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return groupedEarnings[dateStr] || [];
  };

  // 判断是否是今天
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // 切换月份
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-100 dark:bg-white/5 rounded-lg"></div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-white/5 rounded-lg"></div>
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
        {earnings.slice(0, maxEvents).map((event, index) => (
          <div
            key={`${event.symbol}-${index}`}
            className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10 last:border-0"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">
                    {event.symbol}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-white/50 truncate">
                    {event.companyName}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-500 dark:text-white/50">
                    {formatEarningsDate(event.date)}
                  </span>
                  {event.time && (
                    <span className="text-[10px] text-gray-400 dark:text-white/40">
                      • {getEarningsTimeLabel(event.time)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {event.epsEstimate !== null && event.epsEstimate !== undefined && (
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-white/50">EPS Est.</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${event.epsEstimate.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  // 日历视图
  return (
    <div className="space-y-4">
      {/* 月份导航 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
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

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 dark:text-white/50 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayInfo, index) => {
          const events = getEventsForDate(dayInfo.date);
          const hasEvents = events.length > 0;
          const isTodayDate = isToday(dayInfo.date);
          const dateStr = dayInfo.date.toISOString().split('T')[0];
          const isSelected = selectedDate === dateStr;

          return (
            <div
              key={index}
              className={`
                min-h-[100px] p-2 rounded-lg border transition-all cursor-pointer
                ${dayInfo.isCurrentMonth 
                  ? 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-white/10' 
                  : 'bg-gray-50 dark:bg-gray-900/30 border-gray-100 dark:border-white/5'
                }
                ${hasEvents ? 'hover:border-primary dark:hover:border-primary hover:shadow-md' : 'hover:border-gray-300 dark:hover:border-white/20'}
                ${isTodayDate ? 'ring-2 ring-primary' : ''}
                ${isSelected ? 'ring-2 ring-primary bg-primary/5 dark:bg-primary/10' : ''}
              `}
              onClick={() => {
                if (hasEvents) {
                  if (isSelected) {
                    setSelectedDate(null);
                    setIsModalOpen(false);
                  } else {
                    setSelectedDate(dateStr);
                    setIsModalOpen(true);
                  }
                }
              }}
            >
              {/* 日期数字 */}
              <div className="flex items-center justify-between mb-1">
                <span className={`
                  text-sm font-semibold
                  ${dayInfo.isCurrentMonth 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-400 dark:text-white/30'
                  }
                  ${isTodayDate ? 'text-primary' : ''}
                `}>
                  {dayInfo.day}
                </span>
                {hasEvents && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                    {events.length}
                  </span>
                )}
              </div>

              {/* 财报事件列表 */}
              {hasEvents && (
                <div className="space-y-1">
                  {events.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="flex items-center gap-1 px-1.5 py-1 bg-primary/10 rounded"
                      title={`${event.symbol} - ${event.companyName}`}
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
                      <div className="text-[10px] font-semibold text-primary truncate">
                        {event.symbol}
                      </div>
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div className="text-[9px] text-gray-500 dark:text-white/50 text-center">
                      +{events.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Shadcn Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] !p-0 !gap-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold">
                  {selectedDate && formatEarningsDate(selectedDate)}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {selectedDate && groupedEarnings[selectedDate] && (
                    <>
                      {groupedEarnings[selectedDate].length} {groupedEarnings[selectedDate].length === 1 ? 'Company' : 'Companies'} Reporting Earnings
                    </>
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(85vh-120px)] px-6 py-4">
            <div className="space-y-2">
              {selectedDate && groupedEarnings[selectedDate]?.map((event, index) => (
                <div
                  key={index}
                  className="group bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-white/10 hover:border-primary dark:hover:border-primary hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    router.push(`/dashboard/stock/${event.symbol}`);
                    setIsModalOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* 左侧：公司信息 */}
                    <div className="flex items-start gap-2 flex-1">
                      {event.logo &&
                        <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-white/10 overflow-hidden">
                          <Image
                            src={event.logo}
                            alt={event.companyName}
                            width={40}
                            height={40}
                            className="object-contain"
                            onError={(e) => {
                              // Fallback to icon if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="w-full h-full bg-primary/10 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg></div>';
                              }
                            }}
                          />
                        </div>
                      }
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            {event.symbol}
                          </span>
                          {event.time && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-white/10 rounded-full text-gray-600 dark:text-white/70 font-medium">
                              {event.time === 'bmo' ? 'Pre-market' : event.time === 'amc' ? 'After-hours' : 'During Market'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-white/60 mb-1">
                          {event.companyName}
                        </p>
                        {(event.quarter || event.year) && (
                          <span className="inline-block text-[10px] px-1.5 py-0.5 bg-primary/10 rounded text-primary font-semibold">
                            Q{event.quarter} {event.year}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 右侧：财务数据 */}
                    <div className="flex gap-2 flex-shrink-0">
                      {/* EPS */}
                      {event.epsEstimate !== null && event.epsEstimate !== undefined && (
                        <div className="text-right bg-primary/10 dark:bg-gray-900/50 rounded p-2 min-w-[90px]">
                          <div className="text-[9px] text-gray-500 dark:text-white/50 mb-0.5">
                            EPS
                          </div>
                          <div className="text-xs font-bold text-gray-900 dark:text-white">
                            ${event.epsEstimate.toFixed(2)}
                          </div>
                          {event.epsActual !== null && event.epsActual !== undefined && (
                            <div className={`text-[9px] font-semibold mt-0.5 ${
                              event.epsActual >= event.epsEstimate 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              ${event.epsActual.toFixed(2)}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Revenue */}
                      {event.revenueEstimate && (
                        <div className="text-right bg-primary/10 dark:bg-gray-900/50 rounded p-2 min-w-[90px]">
                          <div className="text-[9px] text-gray-500 dark:text-white/50 mb-0.5">
                            Revenue
                          </div>
                          <div className="text-xs font-bold text-gray-900 dark:text-white">
                            ${(event.revenueEstimate / 1e9).toFixed(1)}B
                          </div>
                          {event.revenueActual && (
                            <div className={`text-[9px] font-semibold mt-0.5 ${
                              event.revenueActual >= event.revenueEstimate 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              ${(event.revenueActual / 1e9).toFixed(1)}B
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 时间标签 */}
                  {event.time && (
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5">
                      <p className="text-[10px] text-gray-500 dark:text-white/50">
                        {getEarningsTimeLabel(event.time)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

