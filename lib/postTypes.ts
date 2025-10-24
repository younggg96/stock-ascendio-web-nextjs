// Unified post interface for all platforms
export interface UnifiedPost {
  id: string;
  platform: "x" | "reddit" | "youtube" | "xiaohongshu";
  author: string;
  authorId: string;
  avatarUrl: string;
  title?: string; // For Reddit and YouTube
  content: string;
  url: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares?: number;
  mediaUrls: string[];
  videoUrl?: string;
  aiSummary: string;
  aiReasoning: string;
  aiAnalysis: string;
  isMarketRelated: boolean;
  // Platform-specific data
  platformData?: {
    // For Reddit
    subreddit?: string;
    score?: number;
    permalink?: string;
    topComments?: Array<{
      score: number;
      comment_id: string;
      body: string;
      created_utc: number;
      author: string;
    }>;
    // For YouTube
    viewCount?: number;
    duration?: string;
    thumbnailUrl?: string;
    channelName?: string;
  };
}

// Conversion functions
export function tweetToUnifiedPost(tweet: any): UnifiedPost {
  return {
    id: tweet.tweet_id,
    platform: "x",
    author: tweet.screen_name,
    authorId: tweet.user_id,
    avatarUrl: tweet.profile_image_url,
    content: tweet.full_text,
    url: tweet.tweet_url,
    createdAt: tweet.created_at,
    likes: tweet.num_likes,
    comments: 0, // Twitter API doesn't provide comment count directly
    mediaUrls: tweet.media_urls || [],
    aiSummary: tweet.ai_summary,
    aiReasoning: tweet.ai_reasoning,
    aiAnalysis: tweet.ai_analysis,
    isMarketRelated: tweet.is_market_related,
  };
}

export function redditPostToUnifiedPost(post: any): UnifiedPost {
  return {
    id: post.post_id,
    platform: "reddit",
    author: post.username,
    authorId: post.user_id,
    avatarUrl: post.user_avatar_url,
    title: post.title,
    content: post.selftext,
    url: post.permalink,
    createdAt: new Date(parseInt(post.created_utc) * 1000).toISOString(),
    likes: post.score,
    comments: post.num_comments,
    mediaUrls: [],
    aiSummary: post.ai_summary,
    aiReasoning: post.ai_reasoning,
    aiAnalysis: post.ai_analysis,
    isMarketRelated: post.is_market_related,
    platformData: {
      subreddit: post.subreddit,
      score: post.score,
      permalink: post.permalink,
      topComments: post.top_comments,
    },
  };
}

export function youtubeVideoToUnifiedPost(video: any): UnifiedPost {
  return {
    id: video.video_id,
    platform: "youtube",
    author: video.channel_name,
    authorId: video.channel_id,
    avatarUrl: video.channel_avatar_url,
    title: video.title,
    content: video.description,
    url: video.video_url,
    createdAt: video.published_at,
    likes: video.like_count,
    comments: video.comment_count,
    mediaUrls: video.thumbnail_url ? [video.thumbnail_url] : [],
    videoUrl: video.video_url,
    aiSummary: video.ai_summary,
    aiReasoning: video.ai_reasoning,
    aiAnalysis: video.ai_analysis,
    isMarketRelated: video.is_market_related,
    platformData: {
      viewCount: video.view_count,
      duration: video.duration,
      thumbnailUrl: video.thumbnail_url,
      channelName: video.channel_name,
    },
  };
}

export function xiaohongshuNoteToUnifiedPost(note: any): UnifiedPost {
  return {
    id: note.note_id,
    platform: "xiaohongshu",
    author: note.username,
    authorId: note.user_id,
    avatarUrl: note.user_avatar_url,
    title: note.title,
    content: note.description,
    url: note.note_url,
    createdAt: note.created_at,
    likes: note.like_count,
    comments: note.comment_count,
    shares: note.share_count,
    mediaUrls: note.image_urls || [],
    videoUrl: note.video_url,
    aiSummary: note.ai_summary,
    aiReasoning: note.ai_reasoning,
    aiAnalysis: note.ai_analysis,
    isMarketRelated: note.is_market_related,
  };
}
