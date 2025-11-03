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
