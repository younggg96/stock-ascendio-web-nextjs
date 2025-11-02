// Payment Methods API
import { createClient } from "../client";
import type {
  PaymentMethodEntry,
  PaymentMethodInsert,
  PaymentMethodUpdate,
  PaymentMethodType,
} from "../database.types";
import type { ApiResponse } from "./users";

/**
 * Get all payment methods for a user
 */
export async function getPaymentMethods(
  userId: string
): Promise<ApiResponse<PaymentMethodEntry[]>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_payment_methods")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

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
      error: error.message || "Failed to get payment methods",
    };
  }
}

/**
 * Get active payment method
 */
export async function getActivePaymentMethod(
  userId: string
): Promise<ApiResponse<PaymentMethodEntry | null>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_payment_methods")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
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
      data: data || null,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to get active payment method",
    };
  }
}

/**
 * Add payment method
 */
export async function addPaymentMethod(
  payment: PaymentMethodInsert
): Promise<ApiResponse<PaymentMethodEntry>> {
  try {
    const supabase = createClient();

    // If this is set as active, deactivate other methods
    if (payment.is_active) {
      await supabase
        .from("user_payment_methods")
        .update({ is_active: false })
        .eq("user_id", payment.user_id);
    }

    const { data, error } = await supabase
      .from("user_payment_methods")
      .insert(payment)
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
      error: error.message || "Failed to add payment method",
    };
  }
}

/**
 * Update payment method
 */
export async function updatePaymentMethod(
  paymentId: number,
  updates: PaymentMethodUpdate
): Promise<ApiResponse<PaymentMethodEntry>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_payment_methods")
      .update(updates)
      .eq("id", paymentId)
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
      error: error.message || "Failed to update payment method",
    };
  }
}

/**
 * Set active payment method
 */
export async function setActivePaymentMethod(
  userId: string,
  paymentId: number
): Promise<ApiResponse<PaymentMethodEntry>> {
  try {
    const supabase = createClient();

    // Deactivate all payment methods for this user
    await supabase
      .from("user_payment_methods")
      .update({ is_active: false })
      .eq("user_id", userId);

    // Activate the selected one
    const { data, error } = await supabase
      .from("user_payment_methods")
      .update({ is_active: true })
      .eq("id", paymentId)
      .eq("user_id", userId)
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
      error: error.message || "Failed to set active payment method",
    };
  }
}

/**
 * Delete payment method
 */
export async function deletePaymentMethod(
  paymentId: number,
  userId: string
): Promise<ApiResponse<void>> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("user_payment_methods")
      .delete()
      .eq("id", paymentId)
      .eq("user_id", userId);

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
      error: error.message || "Failed to delete payment method",
    };
  }
}

/**
 * Get payment method by type
 */
export async function getPaymentMethodByType(
  userId: string,
  method: PaymentMethodType
): Promise<ApiResponse<PaymentMethodEntry[]>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("user_payment_methods")
      .select("*")
      .eq("user_id", userId)
      .eq("method", method);

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
      error: error.message || "Failed to get payment methods by type",
    };
  }
}

/**
 * Check if user has any payment methods
 */
export async function hasPaymentMethods(
  userId: string
): Promise<ApiResponse<boolean>> {
  try {
    const supabase = createClient();

    const { count, error } = await supabase
      .from("user_payment_methods")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: (count || 0) > 0,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to check payment methods",
    };
  }
}
