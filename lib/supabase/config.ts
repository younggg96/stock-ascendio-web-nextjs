// Supabase Configuration

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
};

// Validate configuration
export function validateSupabaseConfig(): boolean {
  const { url, anonKey } = supabaseConfig;
  const isValid = url.length > 0 && anonKey.length > 0;

  if (!isValid) {
    console.error("❌ Supabase configuration is incomplete!");
    console.error("Required environment variables:");
    console.error("  - NEXT_PUBLIC_SUPABASE_URL");
    console.error("  - NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return isValid;
}
