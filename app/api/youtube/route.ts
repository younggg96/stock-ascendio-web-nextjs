import { NextResponse } from "next/server";

const YOUTUBE_API_URL =
  "https://zidrvkezo4hsh3liwq6as55zoy0vicjp.lambda-url.us-east-1.on.aws/platform/youtube";

export interface YouTubeVideo {
  video_id: string;
  title: string;
  channel_name: string;
  channel_id: string;
  channel_avatar_url: string;
  description: string;
  published_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  ai_summary: string;
  ai_reasoning: string;
  ai_analysis: string;
  is_market_related: boolean;
}

export interface YouTubeVideosResponse {
  count: number;
  videos: YouTubeVideo[];
}

export async function GET() {
  try {
    const response = await fetch(YOUTUBE_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 5 minutes
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch YouTube videos: ${response.statusText}`);
    }

    const data: YouTubeVideosResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch YouTube videos data" },
      { status: 500 }
    );
  }
}
