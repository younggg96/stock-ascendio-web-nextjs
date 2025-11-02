// KOL Tracking API
import { createClient } from "../client";
import type {
  KOLEntry,
  KOLEntryInsert,
  KOLEntryUpdate,
  Platform,
} from "../database.types";
import type { ApiResponse } from "./users";

/**
 * Get all KOL entries for a user
 */
export async function getUserKOLs(
  userId: string
): Promise<ApiResponse<KOLEntry[]>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_kol_entries")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to get KOL entries",
    };
  }
}

/**
 * Get KOL entries by platform
 */
export async function getUserKOLsByPlatform(
  userId: string,
  platform: Platform
): Promise<ApiResponse<KOLEntry[]>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_kol_entries")
      .select("*")
      .eq("user_id", userId)
      .eq("platform", platform)
      .order("updated_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to get KOL entries",
    };
  }
}

/**
 * Add KOL to tracking
 */
export async function addKOL(
  entry: KOLEntryInsert
): Promise<ApiResponse<KOLEntry>> {
  try {
    const supabase = createClient();

    // Check if already exists
    const { data: existing } = await supabase
      .from("user_kol_entries")
      .select("*")
      .eq("user_id", entry.user_id)
      .eq("platform", entry.platform)
      .eq("kol_id", entry.kol_id)
      .single();

    if (existing) {
      return {
        success: false,
        error: "KOL already in tracking list",
      };
    }

    const { data, error } = await supabase
      .from("user_kol_entries")
      .insert(entry)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to add KOL",
    };
  }
}

/**
 * Remove KOL from tracking
 */
export async function removeKOL(
  userId: string,
  platform: Platform,
  kolId: string
): Promise<ApiResponse<void>> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("user_kol_entries")
      .delete()
      .eq("user_id", userId)
      .eq("platform", platform)
      .eq("kol_id", kolId);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to remove KOL",
    };
  }
}

/**
 * Update KOL notification setting
 */
export async function updateKOLNotification(
  userId: string,
  platform: Platform,
  kolId: string,
  notify: boolean
): Promise<ApiResponse<KOLEntry>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_kol_entries")
      .update({ notify, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("platform", platform)
      .eq("kol_id", kolId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update KOL notification",
    };
  }
}

/**
 * Bulk add KOLs
 */
export async function bulkAddKOLs(
  entries: KOLEntryInsert[]
): Promise<ApiResponse<KOLEntry[]>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_kol_entries")
      .insert(entries)
      .select();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to bulk add KOLs",
    };
  }
}

/**
 * Check if KOL is being tracked
 */
export async function isKOLTracked(
  userId: string,
  platform: Platform,
  kolId: string
): Promise<ApiResponse<boolean>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_kol_entries")
      .select("kol_id")
      .eq("user_id", userId)
      .eq("platform", platform)
      .eq("kol_id", kolId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found"
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: !!data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to check KOL tracking status",
    };
  }
}

/**
 * Get KOL count by platform
 */
export async function getKOLCountByPlatform(
  userId: string
): Promise<ApiResponse<Record<Platform, number>>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_kol_entries")
      .select("platform")
      .eq("user_id", userId);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const counts: Record<string, number> = {};
    data.forEach((entry) => {
      counts[entry.platform] = (counts[entry.platform] || 0) + 1;
    });

    return {
      success: true,
      data: counts as Record<Platform, number>,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to get KOL count",
    };
  }
}
