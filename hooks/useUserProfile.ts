import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { getUserProfile } from "@/lib/supabase/api";
import type { UserProfile } from "@/lib/supabase/database.types";

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const result = await getUserProfile(user.id);

      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        setError(result.error || "Failed to load profile");
      }

      setIsLoading(false);
    }

    loadProfile();
  }, [user?.id]);

  const refresh = async () => {
    if (!user?.id) return;

    const result = await getUserProfile(user.id);

    if (result.success && result.data) {
      setProfile(result.data);
    }
  };

  return {
    profile,
    isLoading,
    error,
    refresh,
  };
}
