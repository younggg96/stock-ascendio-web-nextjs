import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketIndexProps {
  name: string;
  value: string;
  change: number;
  changePercent: number;
}

export default function MarketIndex({
  name,
  value,
  change,
  changePercent,
}: MarketIndexProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-border-light dark:border-border-dark transition-colors duration-300 hover:shadow-sm dark:hover:bg-card-dark/80">
      <h3 className="text-gray-500 dark:text-gray-400 text-[11px] font-medium mb-2 tracking-wide uppercase">
        {name}
      </h3>
      <p className="text-gray-900 dark:text-white text-[20px] font-bold mb-1.5">
        {value}
      </p>
      <p
        className={`text-[11px] font-semibold flex items-center gap-0.5 ${
          isPositive ? "text-primary" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-3.5 h-3.5" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5" />
        )}
        {isPositive ? "+" : ""}
        {change.toFixed(2)} ({isPositive ? "+" : ""}
        {changePercent.toFixed(2)}%)
      </p>
    </div>
  );
}
