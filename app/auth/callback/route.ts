// Auth Callback Handler
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createServerSupabaseClient();

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        new URL("/auth?error=verification_failed", request.url)
      );
    }

    if (data.user) {
      console.log("data.user", data.user);
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .single();

      // Only insert if user doesn't exist (first time login)
      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.display_name || null,
          avatar_url: null,
          theme: "SYSTEM",
          is_subscribe_newsletter: false,
          notification_is_live: false,
          membership: "FREE",
        });

        if (insertError) {
          console.error("User insert error:", insertError);
          return NextResponse.redirect(
            new URL("/auth?error=profile_creation_failed", request.url)
          );
        }
      }

      // Redirect to config page for initial setup
      return NextResponse.redirect(new URL("/config", request.url));
    }
  }

  // Regular login or returning user - redirect to dashboard
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
