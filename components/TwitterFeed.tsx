"use client";

import { useState, useEffect } from "react";
import { CardSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import SectionCard from "./SectionCard";
import { Separator } from "@/components/ui/separator";
import { Selector } from "@/components/ui/selector";
import TweetHeader from "./TweetHeader";
import TweetContent from "./TweetContent";
import Image from "next/image";

interface Tweet {
  screen_name: string;
  user_id: string;
  created_at: string;
  num_likes: number;
  fetched_at: string;
  media_urls: string[];
  tweet_url: string;
  full_text: string;
  tweet_id: string;
}

interface TweetsResponse {
  count: number;
  tweets: Tweet[];
}

type Platform = "x" | "reddit" | "youtube" | "xiaohongshu" | string;

const platforms = [
  { id: "x" as Platform, label: "X", icon: "/logo/x.svg" },
  { id: "reddit" as Platform, label: "Reddit", icon: "/logo/reddit.svg" },
  { id: "youtube" as Platform, label: "YouTube", icon: "/logo/youtube.svg" },
  {
    id: "xiaohongshu" as Platform,
    label: "小红书",
    icon: "/logo/xiaohongshu.svg",
  },
];

export default function PostList() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("x");
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchTweets();
  }, [selectedPlatform]);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      setError(null);

      // 目前只有 X 平台有 API，其他平台显示 Coming Soon
      if (selectedPlatform !== "x") {
        setTweets([]);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/tweets");

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data: TweetsResponse = await response.json();
      setTweets(data.tweets);
      setHasMore(data.tweets.length >= 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTweets = async () => {
    if (loadingMore || !hasMore || selectedPlatform !== "x") return;

    try {
      setLoadingMore(true);
      const response = await fetch("/api/tweets");

      if (!response.ok) {
        throw new Error("Failed to fetch more posts");
      }

      const data: TweetsResponse = await response.json();

      // 过滤掉已存在的推文，避免重复
      const newTweets = data.tweets.filter(
        (newTweet) =>
          !tweets.some((tweet) => tweet.tweet_id === newTweet.tweet_id)
      );

      setTweets((prev) => [...prev, ...newTweets]);
      setHasMore(newTweets.length > 0);
    } catch (err) {
      console.error("Failed to load more posts:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPercentage =
      (target.scrollTop + target.clientHeight) / target.scrollHeight;

    if (scrollPercentage > 0.9 && hasMore && !loadingMore) {
      loadMoreTweets();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}d`;
    }
  };

  const formatTweetText = (text: string) => {
    // Highlight hashtags and stock symbols
    return text.split(/(\s+)/).map((word, index) => {
      if (word.startsWith("#") || word.startsWith("$")) {
        return (
          <span key={index} className="text-sky-400">
            {word}
          </span>
        );
      }
      return word;
    });
  };

  // Platform Selector Component
  const PlatformSelector = () => (
    <Selector
      options={platforms.map((p) => ({
        value: p.id,
        label: p.label,
        icon: (
          <Image
            src={p.icon}
            alt={p.label}
            width={16}
            height={16}
            className="w-4 h-4"
          />
        ),
      }))}
      value={selectedPlatform}
      onValueChange={(val) => setSelectedPlatform(val as Platform)}
      size="sm"
      variant="pills"
    />
  );

  if (loading) {
    return (
      <SectionCard
        showLiveIndicator
        headerBorder
        padding="md"
        scrollable
        scrollbarColor="#53d22d #161A16"
        contentClassName="space-y-0 px-4 pb-4 mt-2"
        maxHeight="calc(100vh - 58.5px - 56px - 42px)"
        headerExtra={<PlatformSelector />}
      >
        {[...Array(10)].map((_, i) => (
          <CardSkeleton key={i} lines={10} />
        ))}
      </SectionCard>
    );
  }

  if (error) {
    return (
      <SectionCard
        showLiveIndicator
        headerBorder
        padding="md"
        scrollable
        scrollbarColor="#53d22d #161A16"
        contentClassName="space-y-0 px-4 pb-4 mt-2"
        maxHeight="calc(100vh - 58.5px - 56px - 42px)"
        headerExtra={<PlatformSelector />}
      >
        <EmptyState title="Failed to load posts" description={error} />
      </SectionCard>
    );
  }

  if (tweets.length === 0) {
    const currentPlatform = platforms.find((p) => p.id === selectedPlatform);
    return (
      <SectionCard
        showLiveIndicator
        headerBorder
        padding="md"
        scrollable
        scrollbarColor="#53d22d #161A16"
        contentClassName="space-y-0 px-4 pb-4 mt-2"
        maxHeight="calc(100vh - 58.5px - 56px - 42px)"
        headerExtra={<PlatformSelector />}
      >
        <EmptyState
          title={
            selectedPlatform === "x"
              ? "No posts available"
              : `${currentPlatform?.label} Coming Soon`
          }
          description={
            selectedPlatform === "x"
              ? "There are no posts to display at the moment."
              : `${currentPlatform?.label} integration is under development and will be available soon.`
          }
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      showLiveIndicator
      headerBorder
      padding="md"
      scrollable
      scrollbarColor="#53d22d #161A16"
      contentClassName="space-y-0 px-4 pb-4 mt-2"
      maxHeight="calc(100vh - 58.5px - 56px - 42px)"
      onScroll={handleScroll}
      headerExtra={<PlatformSelector />}
    >
      {tweets.map((tweet, index) => (
        <div key={tweet.tweet_id}>
          <TweetHeader
            screenName={tweet.screen_name}
            createdAt={tweet.created_at}
            onFormatDate={formatDate}
          />

          <TweetContent
            fullText={tweet.full_text}
            tweetUrl={tweet.tweet_url}
            tweetId={tweet.tweet_id}
            mediaUrls={tweet.media_urls}
            onFormatText={formatTweetText}
          />

          {index < tweets.length - 1 && <Separator className="my-2" />}
        </div>
      ))}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="py-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/50">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Loading more posts...</span>
          </div>
        </div>
      )}

      {/* No More Data Indicator */}
      {!hasMore && tweets.length > 0 && (
        <div className="py-4 text-center text-xs text-gray-400 dark:text-white/30">
          No more posts to load
        </div>
      )}
    </SectionCard>
  );
}
