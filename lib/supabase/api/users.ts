// User Profile API
import { createClient } from "../client";
import type {
  UserProfile,
  UserProfileInsert,
  UserProfileUpdate,
} from "../database.types";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get user profile
 */
export async function getUserProfile(
  userId: string
): Promise<ApiResponse<UserProfile>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
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
      error: error.message || "Failed to get user profile",
    };
  }
}

/**
 * Create user profile (called after sign up)
 */
export async function createUserProfile(
  profile: UserProfileInsert
): Promise<ApiResponse<UserProfile>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .insert(profile)
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
      error: error.message || "Failed to create user profile",
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdate
): Promise<ApiResponse<UserProfile>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
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
      error: error.message || "Failed to update user profile",
    };
  }
}

/**
 * Update username
 */
export async function updateUsername(
  userId: string,
  username: string
): Promise<ApiResponse<UserProfile>> {
  return updateUserProfile(userId, { username });
}

/**
 * Update theme preference
 */
export async function updateTheme(
  userId: string,
  theme: "LIGHT" | "DARK" | "SYSTEM"
): Promise<ApiResponse<UserProfile>> {
  return updateUserProfile(userId, { theme });
}

/**
 * Update notification settings
 */
export async function updateNotificationSettings(
  userId: string,
  settings: {
    notification_method?: "EMAIL" | "SMS" | "BOTH" | null;
    notification_is_live?: boolean;
    notification_interval_hours?: number | null;
  }
): Promise<ApiResponse<UserProfile>> {
  return updateUserProfile(userId, settings);
}

/**
 * Subscribe/unsubscribe to newsletter
 */
export async function toggleNewsletterSubscription(
  userId: string,
  subscribe: boolean
): Promise<ApiResponse<UserProfile>> {
  return updateUserProfile(userId, { is_subscribe_newsletter: subscribe });
}

/**
 * Add stock to tracking list
 */
export async function addStockToTracking(
  userId: string,
  symbol: string
): Promise<ApiResponse<UserProfile>> {
  try {
    const supabase = createClient();

    // Get current tracking list
    const { data: user } = await supabase
      .from("users")
      .select("stock_tracking")
      .eq("id", userId)
      .single();

    const currentTracking = user?.stock_tracking || [];

    // Add if not already tracking
    if (!currentTracking.includes(symbol)) {
      currentTracking.push(symbol);

      return updateUserProfile(userId, { stock_tracking: currentTracking });
    }

    return {
      success: true,
      data: user as UserProfile,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to add stock to tracking",
    };
  }
}

/**
 * Remove stock from tracking list
 */
export async function removeStockFromTracking(
  userId: string,
  symbol: string
): Promise<ApiResponse<UserProfile>> {
  try {
    const supabase = createClient();

    // Get current tracking list
    const { data: user } = await supabase
      .from("users")
      .select("stock_tracking")
      .eq("id", userId)
      .single();

    const currentTracking = user?.stock_tracking || [];

    // Remove symbol
    const updatedTracking = currentTracking.filter((s: string) => s !== symbol);

    return updateUserProfile(userId, { stock_tracking: updatedTracking });
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to remove stock from tracking",
    };
  }
}

/**
 * Get tracking stocks
 */
export async function getTrackingStocks(
  userId: string
): Promise<ApiResponse<string[]>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .select("stock_tracking")
      .eq("id", userId)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data.stock_tracking || [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to get tracking stocks",
    };
  }
}

/**
 * Update stock tracking list (replace entire list)
 */
export async function updateStockTracking(
  userId: string,
  symbols: string[]
): Promise<ApiResponse<UserProfile>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .update({ stock_tracking: symbols })
      .eq("id", userId)
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
      error: error.message || "Failed to update stock tracking",
    };
  }
}
