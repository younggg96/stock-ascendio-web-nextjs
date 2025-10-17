interface NewsItem {
  time: string;
  title: string;
  description: string;
  isHighlighted?: boolean;
}

const newsItems: NewsItem[] = [
  {
    time: "10:32 AM",
    title: "Market Hits Record Highs as Fed Signals Dovish Stance",
    description:
      "Investors cheer as the Federal Reserve indicates potential rate cuts later this year, sending major indices soaring.",
    isHighlighted: true,
  },
  {
    time: "10:28 AM",
    title: "Tech Giant 'Innovate Inc.' Unveils New AI Chip",
    description:
      "Innovate Inc. (INV) shares jump 8% pre-market after announcing a groundbreaking AI processor.",
  },
  {
    time: "10:15 AM",
    title: "Oil Prices Dip on Unexpected Inventory Build",
    description:
      "Energy stocks feel the pressure as crude oil inventories rise, signaling weaker demand.",
  },
  {
    time: "09:55 AM",
    title: "SEC Approves New Round of Bitcoin ETFs",
    description:
      "Cryptocurrency-related stocks are on the rise following regulatory approval for new spot Bitcoin ETFs.",
  },
  {
    time: "09:45 AM",
    title: "Retail Sales Data Comes in Weaker Than Expected",
    description:
      "Consumer discretionary stocks underperform after latest retail sales figures suggest a slowdown in spending.",
  },
  {
    time: "09:30 AM",
    title: "Opening Bell: Stocks Mixed as Traders Digest Inflation Report",
    description:
      "The market opens with uncertainty as the latest CPI data shows inflation remains persistent.",
  },
  {
    time: "09:10 AM",
    title: "'AutoDrive Corp' stock falls after recalling 500,000 vehicles",
    description:
      "Safety concerns lead to a major recall, causing a sharp decline in AutoDrive Corp (ADC) shares.",
  },
  {
    time: "08:50 AM",
    title: "Global Markets React to European Central Bank Rate Decision",
    description:
      "The ECB holds rates steady, but signals a hawkish tone, creating ripples across international indices.",
  },
];

export default function MarketNews() {
  return (
    <div className="bg-card-dark border border-border-dark rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Stock Market News</h2>
        <span className="text-primary text-xs font-bold flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          LIVE
        </span>
      </div>
      <div
        className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#53d22d #161A16",
        }}
      >
        {newsItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="text-white/50 text-xs min-w-[50px]">
              {item.time}
            </div>
            <div
              className={`${
                item.isHighlighted
                  ? "border-l-2 border-primary"
                  : "border-l-2 border-border-dark"
              } pl-3`}
            >
              <a
                className="font-semibold text-sm hover:text-primary transition-colors"
                href="#"
              >
                {item.title}
              </a>
              <p className="text-xs text-white/60 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
