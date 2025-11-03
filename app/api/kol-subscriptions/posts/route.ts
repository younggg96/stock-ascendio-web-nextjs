import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Platform } from "@/lib/supabase/database.types";

export interface SocialPost {
  post_id: string;
  platform: string;
  creator_id: string;
  creator_name: string;
  creator_avatar_url: string | null;
  content: string;
  content_url: string;
  published_at: string;
  media_urls: string[] | null;
  likes_count: number | null;
  ai_summary: string | null;
  ai_sentiment: "negative" | "neutral" | "positive" | string | null;
  ai_tags: string[] | null;
  is_market_related: boolean | null;
  // User interaction data
  user_liked?: boolean;
  user_favorited?: boolean;
  total_likes?: number;
  total_favorites?: number;
}

export interface SubscribedPostsResponse {
  count: number;
  posts: SocialPost[];
  subscriptions_count: number;
  kol_ids: string[];
}

// GET - 获取订阅的 KOL 的帖子
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "User not authenticated" },
        { status: 401 }
      );
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get("platform") as Platform | null;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sentiment = searchParams.get("sentiment");
    const marketRelated = searchParams.get("market_related");

    // 第一步：获取用户订阅的 KOL 列表
    let subscriptionQuery = supabase
      .from("user_kol_entries")
      .select("kol_id, platform")
      .eq("user_id", user.id);

    // 如果指定了平台，只获取该平台的订阅
    if (platform) {
      subscriptionQuery = subscriptionQuery.eq("platform", platform);
    }

    const { data: subscriptions, error: subscriptionError } =
      await subscriptionQuery;

    if (subscriptionError) {
      console.error("Error fetching subscriptions:", subscriptionError);
      return NextResponse.json(
        {
          error: "Failed to fetch subscriptions",
          message: subscriptionError.message,
        },
        { status: 500 }
      );
    }

    // 如果没有订阅任何 KOL，直接返回空结果
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        count: 0,
        posts: [],
        subscriptions_count: 0,
        kol_ids: [],
      });
    }

    // 提取 KOL ID 列表和平台映射
    const kolIds = subscriptions.map((sub) => sub.kol_id);
    const platformFilter = platform
      ? [platform]
      : [...new Set(subscriptions.map((sub) => sub.platform))];

    // 第二步：查询这些 KOL 的帖子
    let postsQuery = supabase
      .from("social_posts")
      .select("*", { count: "exact" })
      .in("creator_name", kolIds)
      .in("platform", platformFilter)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // 应用额外的过滤条件
    if (sentiment) {
      postsQuery = postsQuery.eq("ai_sentiment", sentiment);
    }

    if (marketRelated === "true") {
      postsQuery = postsQuery.eq("is_market_related", true);
    }

    const { data: posts, error: postsError, count } = await postsQuery;

    if (postsError) {
      console.error("Error fetching posts:", postsError);
      return NextResponse.json(
        { error: "Failed to fetch posts", message: postsError.message },
        { status: 500 }
      );
    }

    // 获取帖子 ID 列表，用于批量查询点赞和收藏
    const postIds = (posts || []).map((post) => post.post_id);

    // 批量查询点赞和收藏计数
    const [likesCountResult, favoritesCountResult] = await Promise.all([
      supabase
        .from("user_post_likes")
        .select("post_id", { count: "exact", head: false })
        .in("post_id", postIds),
      supabase
        .from("user_post_favorites")
        .select("post_id", { count: "exact", head: false })
        .in("post_id", postIds),
    ]);

    // 获取当前用户的点赞和收藏
    const [userLikesResult, userFavoritesResult] = await Promise.all([
      supabase
        .from("user_post_likes")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds),
      supabase
        .from("user_post_favorites")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds),
    ]);

    const userLikes = new Set(
      (userLikesResult.data || []).map((item) => item.post_id)
    );
    const userFavorites = new Set(
      (userFavoritesResult.data || []).map((item) => item.post_id)
    );

    // 计算每个帖子的点赞和收藏数
    const likesCountMap = new Map<string, number>();
    const favoritesCountMap = new Map<string, number>();

    (likesCountResult.data || []).forEach((item) => {
      likesCountMap.set(
        item.post_id,
        (likesCountMap.get(item.post_id) || 0) + 1
      );
    });

    (favoritesCountResult.data || []).forEach((item) => {
      favoritesCountMap.set(
        item.post_id,
        (favoritesCountMap.get(item.post_id) || 0) + 1
      );
    });

    // 组装响应数据
    const enrichedPosts: SocialPost[] = (posts || []).map((post) => ({
      ...post,
      user_liked: userLikes.has(post.post_id),
      user_favorited: userFavorites.has(post.post_id),
      total_likes: likesCountMap.get(post.post_id) || 0,
      total_favorites: favoritesCountMap.get(post.post_id) || 0,
    }));

    const response: SubscribedPostsResponse = {
      count: count || 0,
      posts: enrichedPosts,
      subscriptions_count: subscriptions.length,
      kol_ids: kolIds,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("KOL subscriptions posts GET error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
