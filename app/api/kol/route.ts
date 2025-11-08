import { NextRequest, NextResponse } from "next/server";
import type { KOL, Platform as KOLPlatform } from "@/lib/kolApi";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Platform } from "@/lib/supabase/database.types";

// Map KOL platform types to database platform types
const platformMap: Record<KOLPlatform, Platform> = {
  twitter: "TWITTER",
  x: "TWITTER", // X is an alias for Twitter
  reddit: "REDDIT",
  youtube: "YOUTUBE",
  rednote: "REDNOTE",
};

const reversePlatformMap: Record<Platform, KOLPlatform> = {
  TWITTER: "twitter",
  REDDIT: "reddit",
  YOUTUBE: "youtube",
  REDNOTE: "rednote",
};

// GET - Fetch all KOLs from Supabase creators table
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get("platform") as KOLPlatform | null;
    const isTracking = searchParams.get("isTracking");

    const supabase = createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Build query for creators
    let query = supabase.from("creators").select("*");

    // Filter by platform if provided
    if (platform) {
      const dbPlatform = platformMap[platform];
      query = query.eq("platform", dbPlatform);
    }

    const { data: creators, error } = await query;

    if (error) {
      console.error("Error fetching creators:", error);
      throw new Error(`Failed to fetch creators: ${error.message}`);
    }

    // Get user's tracked creators if authenticated
    let userTrackedCreators: Set<string> = new Set();
    if (user && creators && creators.length > 0) {
      const creatorIds = creators.map((creator) => creator.creator_id);

      const { data: trackedData } = await supabase
        .from("user_kol_entries")
        .select("kol_id")
        .eq("user_id", user.id)
        .in("kol_id", creatorIds);

      userTrackedCreators = new Set(
        (trackedData || []).map((item) => item.kol_id)
      );
    }

    // Transform creators data to KOL format
    let kols: KOL[] = (creators || []).map((creator) => ({
      id: creator.id,
      name: creator.display_name,
      username: creator.username || creator.creator_id,
      platform: reversePlatformMap[creator.platform as Platform],
      followers: creator.followers_count,
      description: creator.bio || undefined,
      avatarUrl: creator.avatar_url || undefined,
      isTracking: userTrackedCreators.has(creator.creator_id),
      createdAt: creator.created_at,
      updatedAt: creator.updated_at,
    }));

    // Filter by tracking status if provided
    if (isTracking !== null) {
      const tracking = isTracking === "true";
      kols = kols.filter((kol) => kol.isTracking === tracking);
    }

    return NextResponse.json(kols);
  } catch (error) {
    console.error("Error fetching KOLs:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch KOLs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create a new KOL (Not supported - creators are managed by the system)
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: "Creating creators is not supported through this API",
      message:
        "Creators are automatically discovered and managed by the system",
    },
    { status: 403 }
  );
}

// PATCH - Update an existing KOL (Not supported - creators are managed by the system)
export async function PATCH(request: NextRequest) {
  return NextResponse.json(
    {
      error: "Updating creators is not supported through this API",
      message:
        "Creators are automatically updated by the system. To track/untrack a creator, use the tracking API instead.",
    },
    { status: 403 }
  );
}

// DELETE - Delete a KOL (Not supported - creators are managed by the system)
export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    {
      error: "Deleting creators is not supported through this API",
      message:
        "Creators are managed by the system. To untrack a creator, use the tracking API instead.",
    },
    { status: 403 }
  );
}
