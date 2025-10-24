import { NextResponse } from "next/server";

const REDDIT_API_URL =
  "https://zidrvkezo4hsh3liwq6as55zoy0vicjp.lambda-url.us-east-1.on.aws/platform/reddit";

export interface RedditComment {
  score: number;
  comment_id: string;
  body: string;
  created_utc: number;
  author: string;
}

export interface RedditPost {
  selftext: string;
  subreddit: string;
  score: number;
  permalink: string;
  url: string;
  num_comments: number;
  created_utc: string;
  ai_summary: string;
  ai_reasoning: string;
  user_id: string;
  top_comments: RedditComment[];
  post_id: string;
  username: string;
  ai_analysis: string;
  is_market_related: boolean;
  title: string;
  user_avatar_url: string;
}

export interface RedditPostsResponse {
  count: number;
  posts: RedditPost[];
}

export async function GET() {
  try {
    const response = await fetch(REDDIT_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 5 minutes
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Reddit posts: ${response.statusText}`);
    }

    const data: RedditPostsResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Reddit posts data" },
      { status: 500 }
    );
  }
}
