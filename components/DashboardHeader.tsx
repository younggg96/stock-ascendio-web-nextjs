import Image from "next/image";

interface DashboardHeaderProps {
  currentTime: Date | null;
  isLoading?: boolean;
  hasError?: boolean;
}

export default function DashboardHeader({
  currentTime,
  isLoading,
  hasError,
}: DashboardHeaderProps) {
  return (
    <header className="flex justify-between items-center mb-5">
      <div>
        <h1 className="text-[22px] font-semibold">Market Overview</h1>
        <p className="text-[10px] text-white/40 mt-1">
          {currentTime && (
            <>
              Last updated:{" "}
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </>
          )}
          {isLoading && " • Updating..."}
          {hasError && " • Using cached data"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[18px]">
            search
          </span>
          <input
            className="bg-card-dark border border-border-dark rounded-full w-52 pl-9 pr-3.5 py-1.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-[11px] placeholder:text-white/30"
            placeholder="Search stocks..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <Image
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
            width={32}
            height={32}
          />
          <div>
            <p className="font-medium text-[11px] text-white">Alex Doe</p>
            <p className="text-[10px] text-white/40">alex.doe@ascendio.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
