/**
 * Loading Skeleton Components
 * 用于显示各种加载状态的骨架屏组件
 */

// 市场指数卡片骨架屏
export function MarketIndexSkeleton() {
  return (
    <div className="bg-card-dark p-3.5 rounded-xl border border-border-dark/50 animate-pulse">
      <div className="h-3 bg-white/10 rounded w-20 mb-2"></div>
      <div className="h-6 bg-white/10 rounded w-24 mb-1"></div>
      <div className="h-4 bg-white/10 rounded w-16"></div>
    </div>
  );
}

// 监视列表项骨架屏
export function WatchlistItemSkeleton() {
  return (
    <div className="flex justify-between items-center py-0.5 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-white/10 rounded-full"></div>
        <div>
          <div className="h-3 bg-white/10 rounded w-12 mb-1"></div>
          <div className="h-2 bg-white/10 rounded w-20"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="h-3 bg-white/10 rounded w-14 mb-1"></div>
        <div className="h-2 bg-white/10 rounded w-16"></div>
      </div>
    </div>
  );
}

// 图表加载骨架屏
export function ChartSkeleton() {
  return (
    <div className="bg-card-dark p-4 rounded-xl border border-border-dark/50">
      <div className="flex justify-between items-center mb-4 animate-pulse">
        <div>
          <div className="h-5 bg-white/10 rounded w-16 mb-1"></div>
          <div className="h-3 bg-white/10 rounded w-24"></div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 w-10 bg-white/10 rounded-full"></div>
          ))}
        </div>
      </div>
      <div className="h-56 bg-white/5 rounded animate-pulse"></div>
    </div>
  );
}

// 新闻卡片骨架屏
export function NewsItemSkeleton() {
  return (
    <div className="flex items-start gap-2.5 animate-pulse">
      <div className="w-14 h-10 bg-white/10 rounded-lg flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="h-3 bg-white/10 rounded w-full mb-1"></div>
        <div className="h-3 bg-white/10 rounded w-3/4 mb-2"></div>
        <div className="h-2 bg-white/10 rounded w-20"></div>
      </div>
    </div>
  );
}

// 通用卡片骨架屏
interface CardSkeletonProps {
  lines?: number;
  className?: string;
}

export function CardSkeleton({ lines = 3, className = "" }: CardSkeletonProps) {
  return (
    <div
      className={`bg-card-dark p-4 rounded-xl border border-border-dark/50 animate-pulse ${className}`}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-white/10 rounded mb-2 last:mb-0"
          style={{ width: `${100 - i * 15}%` }}
        ></div>
      ))}
    </div>
  );
}

// 组合加载骨架屏 - 用于显示多个相同的骨架屏
interface SkeletonGridProps {
  count: number;
  children: React.ReactNode;
}

export function SkeletonGrid({ count, children }: SkeletonGridProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{children}</div>
      ))}
    </>
  );
}
