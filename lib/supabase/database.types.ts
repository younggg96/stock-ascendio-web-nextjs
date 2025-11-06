// Database Types - Generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone_e164: string | null;
          created_at: string;
          membership: MembershipType;
          billing_cycle: BillingCycle | null;
          membership_expiration: string | null;
          notification_method: NotificationMethod | null;
          notification_is_live: boolean;
          notification_interval_hours: number | null;
          payment_method: PaymentMethod | null;
          username: string | null;
          avatar_url: string | null;
          theme: Theme;
          is_subscribe_newsletter: boolean;
          stock_tracking: string[] | null;
        };
        Insert: {
          id: string;
          email: string;
          phone_e164?: string | null;
          created_at?: string;
          membership?: MembershipType;
          billing_cycle?: BillingCycle | null;
          membership_expiration?: string | null;
          notification_method?: NotificationMethod | null;
          notification_is_live?: boolean;
          notification_interval_hours?: number | null;
          payment_method?: PaymentMethod | null;
          username?: string | null;
          avatar_url?: string | null;
          theme?: Theme;
          is_subscribe_newsletter?: boolean;
          stock_tracking?: string[] | null;
        };
        Update: {
          id?: string;
          email?: string;
          phone_e164?: string | null;
          created_at?: string;
          membership?: MembershipType;
          billing_cycle?: BillingCycle | null;
          membership_expiration?: string | null;
          notification_method?: NotificationMethod | null;
          notification_is_live?: boolean;
          notification_interval_hours?: number | null;
          payment_method?: PaymentMethod | null;
          username?: string | null;
          avatar_url?: string | null;
          theme?: Theme;
          is_subscribe_newsletter?: boolean;
          stock_tracking?: string[] | null;
        };
      };
      user_kol_entries: {
        Row: {
          user_id: string;
          platform: Platform;
          kol_id: string;
          notify: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          platform: Platform;
          kol_id: string;
          notify?: boolean;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          platform?: Platform;
          kol_id?: string;
          notify?: boolean;
          updated_at?: string;
        };
      };
      user_payment_methods: {
        Row: {
          id: number;
          user_id: string;
          method: PaymentMethodType;
          external_ref: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          method: PaymentMethodType;
          external_ref?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          method?: PaymentMethodType;
          external_ref?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      creators: {
        Row: {
          id: string;
          platform: Platform;
          creator_id: string;
          username: string | null;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          followers_count: number;
          verified: boolean;
          category: string | null;
          influence_score: number;
          total_posts_count: number;
          avg_engagement_rate: number;
          last_post_at: string | null;
          trending_score: number;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          platform: Platform;
          creator_id: string;
          username?: string | null;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          followers_count?: number;
          verified?: boolean;
          category?: string | null;
          influence_score?: number;
          total_posts_count?: number;
          avg_engagement_rate?: number;
          last_post_at?: string | null;
          trending_score?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          platform?: Platform;
          creator_id?: string;
          username?: string | null;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          followers_count?: number;
          verified?: boolean;
          category?: string | null;
          influence_score?: number;
          total_posts_count?: number;
          avg_engagement_rate?: number;
          last_post_at?: string | null;
          trending_score?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_posts: {
        Row: {
          post_id: string;
          platform: Platform;
          creator_id: string;
          content: string;
          content_url: string;
          published_at: string;
          media_urls: string[] | null;
          likes_count: number | null;
          ai_summary: string | null;
          ai_sentiment: Sentiment | null;
          ai_tags: string[] | null;
          is_market_related: boolean | null;
          created_at: string;
        };
        Insert: {
          post_id: string;
          platform: Platform;
          creator_id: string;
          content: string;
          content_url: string;
          published_at: string;
          media_urls?: string[] | null;
          likes_count?: number | null;
          ai_summary?: string | null;
          ai_sentiment?: Sentiment | null;
          ai_tags?: string[] | null;
          is_market_related?: boolean | null;
          created_at?: string;
        };
        Update: {
          post_id?: string;
          platform?: Platform;
          creator_id?: string;
          content?: string;
          content_url?: string;
          published_at?: string;
          media_urls?: string[] | null;
          likes_count?: number | null;
          ai_summary?: string | null;
          ai_sentiment?: Sentiment | null;
          ai_tags?: string[] | null;
          is_market_related?: boolean | null;
          created_at?: string;
        };
      };
      user_post_likes: {
        Row: {
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      user_post_favorites: {
        Row: {
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      trending_tickers: {
        Row: {
          id: string;
          ticker: string;
          platform: Platform;
          mention_count: number;
          positive_mentions: number;
          negative_mentions: number;
          neutral_mentions: number;
          sentiment_score: number;
          engagement_score: number;
          trending_score: number;
          unique_authors_count: number;
          top_post_ids: string[] | null;
          related_topics: string[] | null;
          first_seen_at: string | null;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ticker: string;
          platform: Platform;
          mention_count?: number;
          positive_mentions?: number;
          negative_mentions?: number;
          neutral_mentions?: number;
          sentiment_score?: number;
          engagement_score?: number;
          trending_score?: number;
          unique_authors_count?: number;
          top_post_ids?: string[] | null;
          related_topics?: string[] | null;
          first_seen_at?: string | null;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ticker?: string;
          platform?: Platform;
          mention_count?: number;
          positive_mentions?: number;
          negative_mentions?: number;
          neutral_mentions?: number;
          sentiment_score?: number;
          engagement_score?: number;
          trending_score?: number;
          unique_authors_count?: number;
          top_post_ids?: string[] | null;
          related_topics?: string[] | null;
          first_seen_at?: string | null;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Enums - Must match database enum definitions EXACTLY (case-sensitive)
export type MembershipType = "FREE" | "ENHANCED" | "PRO" | "ENTERPRISE";
export type BillingCycle = "MONTHLY" | "YEARLY";
export type NotificationMethod = "EMAIL" | "MESSAGE";
export type PaymentMethod = "CREDIT_CARD" | "PAYPAL" | "ALIPAY" | "WECHAT";
export type PaymentMethodType = "CREDIT_CARD" | "PAYPAL" | "ALIPAY" | "WECHAT";
export type Platform = "TWITTER" | "YOUTUBE" | "REDNOTE" | "REDDIT";
export type Theme = "LIGHT" | "DARK" | "SYSTEM";
export type Sentiment = "negative" | "neutral" | "positive";

// Helper types
export type UserProfile = Database["public"]["Tables"]["users"]["Row"];
export type UserProfileInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserProfileUpdate = Database["public"]["Tables"]["users"]["Update"];

export type KOLEntry = Database["public"]["Tables"]["user_kol_entries"]["Row"];
export type KOLEntryInsert =
  Database["public"]["Tables"]["user_kol_entries"]["Insert"];
export type KOLEntryUpdate =
  Database["public"]["Tables"]["user_kol_entries"]["Update"];

export type PaymentMethodEntry =
  Database["public"]["Tables"]["user_payment_methods"]["Row"];
export type PaymentMethodInsert =
  Database["public"]["Tables"]["user_payment_methods"]["Insert"];
export type PaymentMethodUpdate =
  Database["public"]["Tables"]["user_payment_methods"]["Update"];

export type SocialPost = Database["public"]["Tables"]["social_posts"]["Row"];
export type SocialPostInsert =
  Database["public"]["Tables"]["social_posts"]["Insert"];
export type SocialPostUpdate =
  Database["public"]["Tables"]["social_posts"]["Update"];

export type UserPostLike =
  Database["public"]["Tables"]["user_post_likes"]["Row"];
export type UserPostLikeInsert =
  Database["public"]["Tables"]["user_post_likes"]["Insert"];
export type UserPostLikeUpdate =
  Database["public"]["Tables"]["user_post_likes"]["Update"];

export type UserPostFavorite =
  Database["public"]["Tables"]["user_post_favorites"]["Row"];
export type UserPostFavoriteInsert =
  Database["public"]["Tables"]["user_post_favorites"]["Insert"];
export type UserPostFavoriteUpdate =
  Database["public"]["Tables"]["user_post_favorites"]["Update"];

export type TrendingTicker =
  Database["public"]["Tables"]["trending_tickers"]["Row"];
export type TrendingTickerInsert =
  Database["public"]["Tables"]["trending_tickers"]["Insert"];
export type TrendingTickerUpdate =
  Database["public"]["Tables"]["trending_tickers"]["Update"];
