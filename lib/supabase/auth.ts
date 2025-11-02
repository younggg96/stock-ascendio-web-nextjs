// Supabase Authentication Service
import { createClient } from "./client";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

export interface UpdatePasswordParams {
  password: string;
}

/**
 * Sign up a new user
 */
export async function signUp(params: SignUpParams): Promise<AuthResponse> {
  try {
    const supabase = createClient();
    const { email, password, name } = params;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.name,
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: error.message || "Failed to sign up",
      errorCode: error.name,
    };
  }
}

/**
 * Sign in a user
 */
export async function signIn(params: SignInParams): Promise<AuthResponse> {
  try {
    const supabase = createClient();
    const { email, password } = params;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.name,
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: error.message || "Failed to sign in",
      errorCode: error.name,
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.name,
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error: error.message || "Failed to sign out",
      errorCode: error.name,
    };
  }
}

/**
 * Reset password (send reset email)
 */
export async function resetPassword(
  params: ResetPasswordParams
): Promise<AuthResponse> {
  try {
    const supabase = createClient();
    const { email } = params;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.name,
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: error.message || "Failed to send reset email",
      errorCode: error.name,
    };
  }
}

/**
 * Update password (after reset)
 */
export async function updatePassword(
  params: UpdatePasswordParams
): Promise<AuthResponse> {
  try {
    const supabase = createClient();
    const { password } = params;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.name,
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Update password error:", error);
    return {
      success: false,
      error: error.message || "Failed to update password",
      errorCode: error.name,
    };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<AuthResponse<User | null>> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.name,
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    console.error("Get current user error:", error);
    return {
      success: false,
      error: error.message || "Failed to get user",
      errorCode: error.name,
    };
  }
}

/**
 * Get current session
 */
export async function getSession(): Promise<AuthResponse<Session | null>> {
  try {
    const supabase = createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.name,
      };
    }

    return {
      success: true,
      data: session,
    };
  } catch (error: any) {
    console.error("Get session error:", error);
    return {
      success: false,
      error: error.message || "Failed to get session",
      errorCode: error.name,
    };
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(
  email: string
): Promise<AuthResponse> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.name,
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Resend verification email error:", error);
    return {
      success: false,
      error: error.message || "Failed to resend email",
      errorCode: error.name,
    };
  }
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(errorCode?: string, errorMsg?: string): string {
  // Supabase specific error messages
  if (errorMsg?.includes("Invalid login credentials")) {
    return "Invalid email or password";
  }
  if (errorMsg?.includes("Email not confirmed")) {
    return "Email not verified. Please check your inbox";
  }
  if (errorMsg?.includes("User already registered")) {
    return "This email is already registered";
  }
  if (errorMsg?.includes("Password should be at least 6 characters")) {
    return "Password must be at least 6 characters";
  }
  if (errorMsg?.includes("Unable to validate email address")) {
    return "Invalid email address format";
  }
  if (errorMsg?.includes("Email rate limit exceeded")) {
    return "Too many requests. Please try again later";
  }

  const errorMessages: Record<string, string> = {
    AuthApiError: "Authentication service error. Please try again",
    AuthRetryableFetchError: "Network error. Please check your connection",
    AuthSessionMissingError: "Session expired. Please sign in again",
    AuthInvalidCredentialsError: "Invalid email or password",
  };

  return (
    errorMessages[errorCode || ""] ||
    errorMsg ||
    "Operation failed. Please try again"
  );
}
