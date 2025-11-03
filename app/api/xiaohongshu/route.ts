import { NextResponse } from "next/server";

const XIAOHONGSHU_API_URL =
  "https://zidrvkezo4hsh3liwq6as55zoy0vicjp.lambda-url.us-east-1.on.aws/platform/rednote";

export interface XiaohongshuNote {
  note_id: string;
  title: string;
  description: string;
  user_id: string;
  username: string;
  user_avatar_url: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  note_url: string;
  image_urls: string[];
  video_url?: string;
  ai_summary: string;
  ai_reasoning: string;
  ai_analysis: string;
  ai_tags: string[];
  ai_sentiment: "negative" | "neutral" | "positive" | "" | string;
  is_market_related: boolean;
}

export interface XiaohongshuNotesResponse {
  count: number;
  notes: XiaohongshuNote[];
}

export async function GET() {
  try {
    const response = await fetch(XIAOHONGSHU_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 5 minutes
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Xiaohongshu notes: ${response.statusText}`
      );
    }

    const data: XiaohongshuNotesResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Xiaohongshu notes data" },
      { status: 500 }
    );
  }
}
