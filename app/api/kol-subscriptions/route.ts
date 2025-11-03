import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Platform } from "@/lib/supabase/database.types";

// GET - 查询当前用户的订阅列表
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

    // 构建查询
    let query = supabase
      .from("user_kol_entries")
      .select("*")
      .eq("user_id", user.id);

    // 如果指定了平台，添加过滤条件
    if (platform) {
      query = query.eq("platform", platform);
    }

    // 按更新时间降序排列
    query = query.order("updated_at", { ascending: false });

    const { data: subscriptions, error } = await query;

    if (error) {
      console.error("Error fetching KOL subscriptions:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subscriptions,
      count: subscriptions?.length || 0,
    });
  } catch (error) {
    console.error("KOL subscriptions GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - 订阅新的 KOL
export async function POST(request: NextRequest) {
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

    // 解析请求体
    const body = await request.json();
    const { platform, kol_id, notify = true } = body;

    // 验证必需字段
    if (!platform || !kol_id) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "platform and kol_id are required",
        },
        { status: 400 }
      );
    }

    // 验证平台值
    const validPlatforms: Platform[] = [
      "TWITTER",
      "YOUTUBE",
      "REDNOTE",
      "REDDIT",
    ];
    if (!validPlatforms.includes(platform as Platform)) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: `Invalid platform. Must be one of: ${validPlatforms.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // 检查是否已经订阅
    const { data: existing } = await supabase
      .from("user_kol_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("platform", platform)
      .eq("kol_id", kol_id)
      .single();

    if (existing) {
      return NextResponse.json(
        {
          error: "Already subscribed",
          message: "You are already subscribed to this KOL",
          data: existing,
        },
        { status: 409 }
      );
    }

    // 创建订阅
    const { data: subscription, error } = await supabase
      .from("user_kol_entries")
      .insert({
        user_id: user.id,
        platform: platform as Platform,
        kol_id,
        notify,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating KOL subscription:", error);
      return NextResponse.json(
        { error: "Failed to subscribe", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to KOL",
        data: subscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("KOL subscriptions POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - 取消订阅 KOL
export async function DELETE(request: NextRequest) {
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

    // 解析请求体
    const body = await request.json();
    const { platform, kol_id } = body;

    // 验证必需字段
    if (!platform || !kol_id) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "platform and kol_id are required",
        },
        { status: 400 }
      );
    }

    // 删除订阅
    const { error } = await supabase
      .from("user_kol_entries")
      .delete()
      .eq("user_id", user.id)
      .eq("platform", platform)
      .eq("kol_id", kol_id);

    if (error) {
      console.error("Error deleting KOL subscription:", error);
      return NextResponse.json(
        { error: "Failed to unsubscribe", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from KOL",
    });
  } catch (error) {
    console.error("KOL subscriptions DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - 更新订阅设置（如通知开关）
export async function PATCH(request: NextRequest) {
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

    // 解析请求体
    const body = await request.json();
    const { platform, kol_id, notify } = body;

    // 验证必需字段
    if (!platform || !kol_id || notify === undefined) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "platform, kol_id, and notify are required",
        },
        { status: 400 }
      );
    }

    // 更新订阅设置
    const { data: subscription, error } = await supabase
      .from("user_kol_entries")
      .update({ notify })
      .eq("user_id", user.id)
      .eq("platform", platform)
      .eq("kol_id", kol_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating KOL subscription:", error);
      return NextResponse.json(
        { error: "Failed to update subscription", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully updated subscription",
      data: subscription,
    });
  } catch (error) {
    console.error("KOL subscriptions PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
