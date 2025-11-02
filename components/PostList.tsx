"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardSkeleton } from "./LoadingSkeleton";
import { EmptyState, ErrorState } from "./EmptyState";
import SectionCard from "./SectionCard";
import { Separator } from "@/components/ui/separator";
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
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import { MultiSelectOption } from "./ui/multi-select";
import { FilterSheet, DateRange, Sentiment } from "./FilterSheet";

type Platform = "x" | "reddit" | "youtube" | "xiaohongshu";

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

const PlatformTabOption = [
  {
    value: "x",
    label: "X",
    icon: (
      <Image
        src="/logo/x.svg"
        alt="X"
        width={16}
        height={16}
        className="w-4 h-4"
      />
    ),
  },
  {
    value: "reddit",
    label: "Reddit",
    icon: (
      <Image
        src="/logo/reddit.svg"
        alt="Reddit"
        width={16}
        height={16}
        className="w-4 h-4"
      />
    ),
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: (
      <Image
        src="/logo/youtube.svg"
        alt="YouTube"
        width={16}
        height={16}
        className="w-4 h-4"
      />
    ),
  },
  {
    value: "xiaohongshu",
    label: "小红书",
    icon: (
      <Image
        src="/logo/xiaohongshu.svg"
        alt="小红书"
        width={16}
        height={16}
        className="w-4 h-4"
      />
    ),
  },
];

export default function PostList() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("x");
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSentiments, setSelectedSentiments] = useState<Sentiment[]>([]);
  const [timeRange, setTimeRange] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

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

  // Extract unique authors from current platform posts
  const availableAuthors = useMemo(() => {
    const uniqueAuthorsMap = new Map<
      string,
      { author: string; authorId: string; avatarUrl: string }
    >();

    currentPosts.forEach((post) => {
      if (post.isMarketRelated && !uniqueAuthorsMap.has(post.authorId)) {
        uniqueAuthorsMap.set(post.authorId, {
          author: post.author,
          authorId: post.authorId,
          avatarUrl: post.avatarUrl,
        });
      }
    });

    return Array.from(uniqueAuthorsMap.values()).sort((a, b) =>
      a.author.localeCompare(b.author)
    );
  }, [currentPosts]);

  // Convert authors to MultiSelect options
  const authorOptions: MultiSelectOption[] = useMemo(() => {
    return availableAuthors.map((author) => ({
      label: author.author,
      value: author.authorId,
      icon: (
        <Image
          src={author.avatarUrl}
          alt={author.author}
          width={16}
          height={16}
          className="w-4 h-4 rounded-full"
        />
      ),
    }));
  }, [availableAuthors]);

  // Extract unique tags from current platform posts
  const availableTags = useMemo(() => {
    const uniqueTagsSet = new Set<string>();

    currentPosts.forEach((post) => {
      if (post.aiTags) {
        post.aiTags.forEach((tag) => {
          console.log(tag);
          uniqueTagsSet.add(tag);
        });
      }
    });

    return Array.from(uniqueTagsSet).sort();
  }, [currentPosts]);

  // Convert tags to MultiSelect options
  const tagOptions: MultiSelectOption[] = useMemo(() => {
    return availableTags.map((tag) => ({
      label: tag,
      value: tag,
    }));
  }, [availableTags]);

  // Helper function to filter by time range
  const isWithinTimeRange = useCallback(
    (postDate: string, range: string): boolean => {
      if (range === "all") return true;

      const now = new Date();
      const postTime = new Date(postDate);

      // Custom date range filter
      if (range === "custom" && dateRange) {
        const hasFrom = dateRange.from !== undefined;
        const hasTo = dateRange.to !== undefined;

        if (hasFrom && hasTo) {
          return postTime >= dateRange.from! && postTime <= dateRange.to!;
        } else if (hasFrom) {
          return postTime >= dateRange.from!;
        } else if (hasTo) {
          return postTime <= dateRange.to!;
        }
        return true;
      }

      // Preset time range filters
      const diffInMs = now.getTime() - postTime.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);

      switch (range) {
        case "1h":
          return diffInHours <= 1;
        case "24h":
          return diffInHours <= 24;
        case "7d":
          return diffInHours <= 24 * 7;
        case "30d":
          return diffInHours <= 24 * 30;
        case "3m":
          return diffInHours <= 24 * 90;
        default:
          return true;
      }
    },
    [dateRange]
  );

  // Filter posts based on selected authors, tags, sentiments, and time range
  const filteredPosts = useMemo(() => {
    let filtered = currentPosts;

    // Filter by authors
    if (selectedAuthors.length > 0) {
      filtered = filtered.filter((post) =>
        selectedAuthors.includes(post.authorId)
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        (post) =>
          post.aiTags && post.aiTags.some((tag) => selectedTags.includes(tag))
      );
    }

    // Filter by sentiments
    if (selectedSentiments.length > 0) {
      filtered = filtered.filter((post) =>
        selectedSentiments.includes(post.sentiment)
      );
    }

    // Filter by time range or custom date range
    // When dateRange is set, use it regardless of timeRange value
    if (dateRange?.from || dateRange?.to) {
      filtered = filtered.filter((post) => {
        const postTime = new Date(post.createdAt);
        const hasFrom = dateRange.from !== undefined;
        const hasTo = dateRange.to !== undefined;

        if (hasFrom && hasTo) {
          return postTime >= dateRange.from! && postTime <= dateRange.to!;
        } else if (hasFrom) {
          return postTime >= dateRange.from!;
        } else if (hasTo) {
          return postTime <= dateRange.to!;
        }
        return true;
      });
    } else if (timeRange !== "all" && timeRange !== "") {
      // Only use preset time range if no custom date range is set
      filtered = filtered.filter((post) =>
        isWithinTimeRange(post.createdAt, timeRange)
      );
    }

    return filtered;
  }, [
    currentPosts,
    selectedAuthors,
    selectedTags,
    selectedSentiments,
    timeRange,
    dateRange,
    isWithinTimeRange,
  ]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedAuthors.length > 0) count++;
    if (selectedTags.length > 0) count++;
    if (selectedSentiments.length > 0) count++;
    if (timeRange !== "all" || dateRange?.from || dateRange?.to) count++;
    return count;
  }, [selectedAuthors, selectedTags, selectedSentiments, timeRange, dateRange]);

  useEffect(() => {
    // Only fetch if this platform hasn't been loaded yet
    if (!loadedPlatforms.has(selectedPlatform)) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlatform, loadedPlatforms.size]);

  // Reset filters when switching platforms
  useEffect(() => {
    setSelectedAuthors([]);
    setSelectedTags([]);
    setSelectedSentiments([]);
    setTimeRange("all");
    setDateRange(undefined);
  }, [selectedPlatform]);

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
      contentClassName="space-y-0 px-4 pb-0 mt-2"
      onScroll={handleScroll}
      headerExtra={
        <div className="flex flex-col gap-2">
          <SwitchTab
            options={PostTabOption}
            value={selectedTab}
            onValueChange={handleTabChange}
            size="md"
            variant="pills"
            className="!w-fit"
          />
          <SwitchTab
            options={PlatformTabOption}
            value={selectedPlatform}
            onValueChange={handlePlatformChange}
            size="md"
            variant="underline"
            className="w-auto"
          />
        </div>
      }
      headerRightExtra={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshCurrentPlatform}
            aria-label="Refresh"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>

          <FilterSheet
            authorOptions={authorOptions}
            selectedAuthors={selectedAuthors}
            onAuthorsChange={setSelectedAuthors}
            tagOptions={tagOptions}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            selectedSentiments={selectedSentiments}
            onSentimentsChange={setSelectedSentiments}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            activeFilterCount={activeFilterCount}
          />
        </div>
      }
    >
      {isLoading &&
        [...Array(10)].map((_, i) => <CardSkeleton key={i} lines={10} />)}

      {filteredPosts.length === 0 && !isLoading && !currentError && (
        <EmptyState
          title={
            selectedAuthors.length > 0 ||
            selectedTags.length > 0 ||
            selectedSentiments.length > 0
              ? "No posts match your filters"
              : "No posts available"
          }
          description={
            selectedAuthors.length > 0 ||
            selectedTags.length > 0 ||
            selectedSentiments.length > 0
              ? "Try adjusting your filters or clear them to see more posts."
              : "There are no posts to display at the moment."
          }
        />
      )}

      {currentError && !isLoading && (
        <ErrorState
          title="Failed to load posts"
          message={currentError}
          retry={refreshCurrentPlatform}
        />
      )}

      {filteredPosts.map((post, index) => {
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
                  aiTags={post.aiTags}
                  sentiment={post.sentiment}
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
                  aiTags={post.aiTags}
                  sentiment={post.sentiment}
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
                  aiTags={post.aiTags}
                  sentiment={post.sentiment}
                  onFormatText={formatTweetText}
                  viewCount={post.platformData?.viewCount}
                  likeCount={post.platformData?.likeCount}
                  commentCount={post.platformData?.commentCount}
                  duration={post.platformData?.duration}
                  thumbnailUrl={post.platformData?.thumbnailUrl}
                  channelName={post.platformData?.channelName}
                  channelThumbnailUrl={post.platformData?.channelThumbnailUrl}
                  publishedAt={post.platformData?.publishedAt}
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
                  aiTags={post.aiTags}
                  sentiment={post.sentiment}
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

            {index < filteredPosts.length - 1 && <Separator className="my-2" />}
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
      {!hasMore && filteredPosts.length > 0 && (
        <div className="py-4 text-center text-xs text-gray-400 dark:text-white/30">
          No more posts to load
        </div>
      )}
    </SectionCard>
  );
}
