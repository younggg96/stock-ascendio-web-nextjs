interface TweetHeaderProps {
  screenName: string;
  createdAt: string;
  onFormatDate: (dateString: string) => string;
}

export default function TweetHeader({
  screenName,
  createdAt,
  onFormatDate,
}: TweetHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {screenName.substring(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="font-bold text-sm text-gray-900 dark:text-white">
          {screenName}{" "}
          <span className="text-white/50 font-normal">
            @{screenName.toLowerCase()} · {onFormatDate(createdAt)}
          </span>
        </p>
      </div>
    </div>
  );
}
