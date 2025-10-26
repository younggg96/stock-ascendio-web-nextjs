"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

interface TweetHeaderProps {
  screenName: string;
  createdAt: string;
  profileImageUrl?: string;
  onFormatDate: (dateString: string) => string;
  initialTracked?: boolean;
  onTrackChange?: (tracked: boolean) => void;
}

export default function TweetHeader({
  screenName,
  createdAt,
  profileImageUrl,
  onFormatDate,
  initialTracked = false,
  onTrackChange,
}: TweetHeaderProps) {
  const [isTracked, setIsTracked] = useState(initialTracked);

  const handleTrackToggle = () => {
    const newTrackedState = !isTracked;
    setIsTracked(newTrackedState);
    onTrackChange?.(newTrackedState);
  };

  return (
    <div className="flex items-center gap-3 mb-3">
      {profileImageUrl ? (
        <Image
          src={profileImageUrl}
          alt={screenName}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {screenName.substring(0, 2).toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-900 dark:text-white">
          {screenName}{" "}
          <span className="text-white/50 font-normal">
            @{screenName.toLowerCase()} · {onFormatDate(createdAt)}
          </span>
        </p>
      </div>
      <Button
        variant={isTracked ? "default" : "outline"}
        size="xs"
        onClick={handleTrackToggle}
        className={isTracked ? 
          "bg-primary/40 hover:bg-primary/30 text-gray-300" : 
          "border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10"
        }
      >
        {isTracked ? "Tracked" : "Track"}
      </Button>
    </div>
  );
}
