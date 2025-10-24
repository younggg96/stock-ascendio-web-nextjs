import { NextResponse } from "next/server";

const TWITTER_API_URL =
  "https://zidrvkezo4hsh3liwq6as55zoy0vicjp.lambda-url.us-east-1.on.aws/platform/twitter";

export interface Tweet {
  screen_name: string;
  user_id: string;
  created_at: string;
  num_likes: number;
  fetched_at: string;
  media_urls: string[];
  tweet_url: string;
  full_text: string;
  tweet_id: string;
  profile_image_url: string;
  ai_summary: string;
  ai_reasoning: string;
  ai_analysis: string;
  is_market_related: boolean;
}

export interface TweetsResponse {
  count: number;
  tweets: Tweet[];
}

export async function GET() {
  try {
    const response = await fetch(TWITTER_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 5 minutes
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tweets: ${response.statusText}`);
    }

    const data: TweetsResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tweets data" },
      { status: 500 }
    );
  }
}
