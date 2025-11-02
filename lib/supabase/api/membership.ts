// Membership & Subscription API
import { createClient } from "../client";
import type {
  UserProfile,
  MembershipType,
  BillingCycle,
} from "../database.types";
import type { ApiResponse } from "./users";

/**
 * Upgrade membership
 */
export async function upgradeMembership(
  userId: string,
  membership: MembershipType,
  billingCycle: BillingCycle
): Promise<ApiResponse<UserProfile>> {
  try {
    const supabase = createClient();

    // Calculate expiration date
    const now = new Date();
    const expirationDate = new Date(now);

    if (billingCycle === "MONTHLY") {
      expirationDate.setMonth(expirationDate.getMonth() + 1);
    } else if (billingCycle === "YEARLY") {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    } else {
      return {
        success: false,
        error: "Invalid billing cycle",
      };
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        membership,
        billing_cycle: billingCycle,
        membership_expiration: expirationDate.toISOString(),
      })
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
      error: error.message || "Failed to upgrade membership",
    };
  }
}

/**
 * Downgrade to free membership
 */
export async function downgradeToFree(
  userId: string
): Promise<ApiResponse<UserProfile>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .update({
        membership: "FREE",
        billing_cycle: null,
        membership_expiration: null,
      })
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
      error: error.message || "Failed to downgrade membership",
    };
  }
}

/**
 * Check if membership is expired
 */
export async function isMembershipExpired(
  userId: string
): Promise<ApiResponse<boolean>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .select("membership_expiration")
      .eq("id", userId)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.membership_expiration) {
      return {
        success: true,
        data: false,
      };
    }

    const isExpired = new Date(data.membership_expiration) < new Date();

    return {
      success: true,
      data: isExpired,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to check membership expiration",
    };
  }
}

/**
 * Get membership features
 */
export function getMembershipFeatures(membership: MembershipType): {
  name: string;
  price: { monthly: number; yearly: number };
  features: string[];
  maxStocks: number;
  maxKOLs: number;
  notifications: boolean;
  liveNotifications: boolean;
  aiAnalysis: boolean;
} {
  const features = {
    FREE: {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      features: [
        "Track up to 5 stocks",
        "Follow up to 3 KOLs",
        "Basic market data",
        "Daily email digest",
      ],
      maxStocks: 5,
      maxKOLs: 3,
      notifications: true,
      liveNotifications: false,
      aiAnalysis: false,
    },
    ENHANCED: {
      name: "Enhanced",
      price: { monthly: 19, yearly: 190 },
      features: [
        "Track up to 20 stocks",
        "Follow up to 10 KOLs",
        "Real-time market data",
        "Email notifications",
        "Basic AI insights",
      ],
      maxStocks: 20,
      maxKOLs: 10,
      notifications: true,
      liveNotifications: false,
      aiAnalysis: true,
    },
    PRO: {
      name: "Pro",
      price: { monthly: 29, yearly: 290 },
      features: [
        "Track up to 50 stocks",
        "Follow up to 20 KOLs",
        "Real-time market data",
        "Live notifications",
        "AI-powered insights",
        "Priority support",
      ],
      maxStocks: 50,
      maxKOLs: 20,
      notifications: true,
      liveNotifications: true,
      aiAnalysis: true,
    },
    ENTERPRISE: {
      name: "Enterprise",
      price: { monthly: 99, yearly: 990 },
      features: [
        "Unlimited stocks tracking",
        "Unlimited KOL following",
        "Real-time market data",
        "Live notifications",
        "Advanced AI analysis",
        "Custom alerts",
        "Dedicated support",
        "API access",
      ],
      maxStocks: Infinity,
      maxKOLs: Infinity,
      notifications: true,
      liveNotifications: true,
      aiAnalysis: true,
    },
  };

  return features[membership];
}

/**
 * Check if user can add more stocks
 */
export async function canAddStock(
  userId: string
): Promise<ApiResponse<boolean>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .select("membership, stock_tracking")
      .eq("id", userId)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const features = getMembershipFeatures(data.membership);
    const currentCount = data.stock_tracking?.length || 0;

    return {
      success: true,
      data: currentCount < features.maxStocks,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to check stock limit",
    };
  }
}

/**
 * Check if user can add more KOLs
 */
export async function canAddKOL(userId: string): Promise<ApiResponse<boolean>> {
  try {
    const supabase = createClient();

    // Get user membership
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("membership")
      .eq("id", userId)
      .single();

    if (userError) {
      return {
        success: false,
        error: userError.message,
      };
    }

    // Count KOLs
    const { count, error: countError } = await supabase
      .from("user_kol_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      return {
        success: false,
        error: countError.message,
      };
    }

    const features = getMembershipFeatures(user.membership);
    const currentCount = count || 0;

    return {
      success: true,
      data: currentCount < features.maxKOLs,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to check KOL limit",
    };
  }
}
