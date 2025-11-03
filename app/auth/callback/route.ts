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
    const { data: sessionData, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Auth callback error:", exchangeError);
      return NextResponse.redirect(
        new URL("/auth?error=verification_failed", request.url)
      );
    }

    // Sync display_name from auth metadata to users.username
    if (sessionData?.user) {
      try {
        const userId = sessionData.user.id;
        const displayName = sessionData.user.user_metadata?.display_name;

        // Check if user profile exists and username is empty
        const { data: userProfile } = await supabase
          .from("users")
          .select("username")
          .eq("id", userId)
          .single();

        // If username is empty and display_name exists, update it
        if (
          (!userProfile?.username || userProfile.username === "") &&
          displayName
        ) {
          await supabase
            .from("users")
            .update({ username: displayName })
            .eq("id", userId);
        }
      } catch (error) {
        console.error("Error syncing username:", error);
        // Don't block the login flow if this fails
      }
    }

    return NextResponse.redirect(new URL("/config", request.url));
  }

  // Regular login or returning user - redirect to dashboard
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
