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
    <div className="bg-card-dark p-3.5 rounded-xl border border-border-dark/50">
      <h3 className="text-white/50 text-[10px] font-normal mb-1.5 tracking-wide uppercase">
        {name}
      </h3>
      <p className="text-[19px] font-semibold mb-1">{value}</p>
      <p
        className={`text-[11px] font-medium flex items-center gap-0.5 ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        <span className="material-symbols-outlined text-[14px]">
          {isPositive ? "arrow_upward" : "arrow_downward"}
        </span>
        {isPositive ? "+" : ""}
        {change.toFixed(2)} ({isPositive ? "+" : ""}
        {changePercent.toFixed(2)}%)
      </p>
    </div>
  );
}
