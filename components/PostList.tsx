"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardSkeleton } from "./LoadingSkeleton";
import { EmptyState, ErrorState } from "./EmptyState";
import SectionCard from "./SectionCard";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TweetHeader from "./TweetHeader";
import {
  TwitterContent,
  RedditContent,
  YouTubeContent,
  XiaohongshuContent,
} from "./content";
import Image from "next/image";
import {
  UnifiedPost,
  tweetToUnifiedPost,
  redditPostToUnifiedPost,
  youtubeVideoToUnifiedPost,
  xiaohongshuNoteToUnifiedPost,
} from "@/lib/postTypes";
import { SwitchTab } from "./ui/switch-tab";

type Platform = "x" | "reddit" | "youtube" | "xiaohongshu";

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

const PostTabOption = [
  {
    value: "all",
    label: "All",
    icon: "",
  },
  {
    value: "tracking",
    label: "Tracking",
    icon: "",
  },
];

export default function PostList() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("x");
  const [selectedTab, setSelectedTab] = useState<string>("all");
  // Cache posts data for each platform
  const [platformPosts, setPlatformPosts] = useState<
    Record<Platform, UnifiedPost[]>
  >({
    x: [],
    reddit: [],
    youtube: [],
    xiaohongshu: [],
  });

  // Track loading state for each platform
  const [platformLoading, setPlatformLoading] = useState<
    Record<Platform, boolean>
  >({
    x: false,
    reddit: false,
    youtube: false,
    xiaohongshu: false,
  });

  // Track which platforms have been loaded
  const [loadedPlatforms, setLoadedPlatforms] = useState<Set<Platform>>(
    new Set()
  );

  const [loadingMore, setLoadingMore] = useState(false);

  // Track errors for each platform
  const [platformErrors, setPlatformErrors] = useState<
    Record<Platform, string | null>
  >({
    x: null,
    reddit: null,
    youtube: null,
    xiaohongshu: null,
  });

  // Track hasMore for each platform
  const [platformHasMore, setPlatformHasMore] = useState<
    Record<Platform, boolean>
  >({
    x: true,
    reddit: true,
    youtube: true,
    xiaohongshu: true,
  });

  // Get current platform data
  const currentPosts = platformPosts[selectedPlatform];
  const isLoading = platformLoading[selectedPlatform];
  const currentError = platformErrors[selectedPlatform];
  const hasMore = platformHasMore[selectedPlatform];

  // Get current platform info
  const currentPlatformInfo = useMemo(
    () => platforms.find((p) => p.id === selectedPlatform),
    [selectedPlatform]
  );

  useEffect(() => {
    // Only fetch if this platform hasn't been loaded yet
    if (!loadedPlatforms.has(selectedPlatform)) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlatform, loadedPlatforms.size]);

  const getApiEndpoint = (platform: Platform): string => {
    const endpoints = {
      x: "/api/tweets",
      reddit: "/api/reddit",
      youtube: "/api/youtube",
      xiaohongshu: "/api/xiaohongshu",
    };
    return endpoints[platform];
  };

  const convertToUnifiedPosts = (
    data: any,
    platform: Platform
  ): UnifiedPost[] => {
    switch (platform) {
      case "x":
        return data.tweets?.map(tweetToUnifiedPost) || [];
      case "reddit":
        return data.posts?.map(redditPostToUnifiedPost) || [];
      case "youtube":
        return data.videos?.map(youtubeVideoToUnifiedPost) || [];
      case "xiaohongshu":
        return data.notes?.map(xiaohongshuNoteToUnifiedPost) || [];
      default:
        return [];
    }
  };

  const fetchPosts = async (forceRefresh: boolean = false) => {
    try {
      // Set loading state for current platform
      setPlatformLoading((prev) => ({ ...prev, [selectedPlatform]: true }));
      setPlatformErrors((prev) => ({ ...prev, [selectedPlatform]: null }));

      const endpoint = getApiEndpoint(selectedPlatform);
      const response = await fetch(endpoint, {
        // Force refresh bypasses cache
        cache: forceRefresh ? "no-store" : "default",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      const unifiedPosts = convertToUnifiedPosts(data, selectedPlatform);

      // Update posts for current platform
      setPlatformPosts((prev) => ({
        ...prev,
        [selectedPlatform]: unifiedPosts,
      }));

      // Update hasMore for current platform
      setPlatformHasMore((prev) => ({
        ...prev,
        [selectedPlatform]: unifiedPosts.length >= 20,
      }));

      // Mark this platform as loaded
      setLoadedPlatforms((prev) => new Set(prev).add(selectedPlatform));
    } catch (err) {
      setPlatformErrors((prev) => ({
        ...prev,
        [selectedPlatform]:
          err instanceof Error ? err.message : "An error occurred",
      }));
    } finally {
      setPlatformLoading((prev) => ({ ...prev, [selectedPlatform]: false }));
    }
  };

  // Function to refresh current platform data
  const refreshCurrentPlatform = () => {
    fetchPosts(true);
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const endpoint = getApiEndpoint(selectedPlatform);
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Failed to fetch more posts");
      }

      const data = await response.json();
      const newUnifiedPosts = convertToUnifiedPosts(data, selectedPlatform);

      // 过滤掉已存在的帖子，避免重复
      const currentPlatformPosts = platformPosts[selectedPlatform];
      const filteredNewPosts = newUnifiedPosts.filter(
        (newPost) =>
          !currentPlatformPosts.some((post) => post.id === newPost.id)
      );

      // Update posts for current platform
      setPlatformPosts((prev) => ({
        ...prev,
        [selectedPlatform]: [...prev[selectedPlatform], ...filteredNewPosts],
      }));

      // Update hasMore for current platform
      setPlatformHasMore((prev) => ({
        ...prev,
        [selectedPlatform]: filteredNewPosts.length > 0,
      }));
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
      loadMorePosts();
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

  // Memoize platform change handler to prevent recreating function on each render
  const handlePlatformChange = useCallback((val: string) => {
    setSelectedPlatform(val as Platform);
  }, []);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <SectionCard
      showLiveIndicator
      headerBorder
      padding="md"
      scrollable
      contentClassName="space-y-0 px-4 pb-4 mt-2"
      onScroll={handleScroll}
      headerExtra={
        <SwitchTab
          options={PostTabOption}
          value={selectedTab}
          onValueChange={handleTabChange}
          size="md"
          variant="pills"
          className="w-auto"
        />
      }
      headerRightExtra={
        <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue>
              {currentPlatformInfo && (
                <div className="flex items-center gap-2">
                  <Image
                    src={currentPlatformInfo.icon}
                    alt={currentPlatformInfo.label}
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  <span>{currentPlatformInfo.label}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {platforms.map((platform) => (
              <SelectItem key={platform.id} value={platform.id}>
                <div className="flex items-center gap-2">
                  <Image
                    src={platform.icon}
                    alt={platform.label}
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  <span>{platform.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {isLoading &&
        [...Array(10)].map((_, i) => <CardSkeleton key={i} lines={10} />)}

      {currentPosts.length === 0 && !isLoading && !currentError && (
        <EmptyState
          title="No posts available"
          description="There are no posts to display at the moment."
        />
      )}

      {currentError && !isLoading && (
        <ErrorState
          title="Failed to load posts"
          message={currentError}
          retry={refreshCurrentPlatform}
        />
      )}

      {currentPosts.map((post, index) => {
        if (!!!post.isMarketRelated) return null;

        const renderContent = () => {
          switch (selectedPlatform) {
            case "x":
              return (
                <TwitterContent
                  title={post.title}
                  fullText={post.content}
                  url={post.url}
                  id={post.id}
                  mediaUrls={post.mediaUrls}
                  aiSummary={post.aiSummary}
                  aiAnalysis={post.aiAnalysis}
                  onFormatText={formatTweetText}
                />
              );
            case "reddit":
              return (
                <RedditContent
                  title={post.title}
                  fullText={post.content}
                  url={post.url}
                  id={post.id}
                  mediaUrls={post.mediaUrls}
                  aiSummary={post.aiSummary}
                  aiAnalysis={post.aiAnalysis}
                  onFormatText={formatTweetText}
                  subreddit={post.platformData?.subreddit}
                  score={post.platformData?.score}
                  permalink={post.platformData?.permalink}
                  topComments={post.platformData?.topComments}
                />
              );
            case "youtube":
              return (
                <YouTubeContent
                  title={post.title}
                  fullText={post.content}
                  url={post.url}
                  id={post.id}
                  mediaUrls={post.mediaUrls}
                  aiSummary={post.aiSummary}
                  aiAnalysis={post.aiAnalysis}
                  onFormatText={formatTweetText}
                  viewCount={post.platformData?.viewCount}
                  duration={post.platformData?.duration}
                  thumbnailUrl={post.platformData?.thumbnailUrl}
                  channelName={post.platformData?.channelName}
                />
              );
            case "xiaohongshu":
              return (
                <XiaohongshuContent
                  title={post.title}
                  fullText={post.content}
                  url={post.url}
                  id={post.id}
                  mediaUrls={post.mediaUrls}
                  aiSummary={post.aiSummary}
                  aiAnalysis={post.aiAnalysis}
                  onFormatText={formatTweetText}
                />
              );
            default:
              return null;
          }
        };

        return (
          <div key={post.id}>
            <TweetHeader
              screenName={post.author}
              createdAt={post.createdAt}
              profileImageUrl={post.avatarUrl}
              onFormatDate={formatDate}
            />

            {renderContent()}

            {index < currentPosts.length - 1 && <Separator className="my-2" />}
          </div>
        );
      })}

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
      {!hasMore && currentPosts.length > 0 && (
        <div className="py-4 text-center text-xs text-gray-400 dark:text-white/30">
          No more posts to load
        </div>
      )}
    </SectionCard>
  );
}
