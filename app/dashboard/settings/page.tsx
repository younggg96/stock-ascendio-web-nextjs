"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  CreditCard,
  Bell,
  Settings,
  Sparkles,
  Globe,
  Sun,
  Moon,
  Monitor,
  SunMoon,
} from "lucide-react";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SectionCard from "@/components/SectionCard";
import PricingCard from "@/components/PricingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, useUserProfile } from "@/hooks";
import { updateTheme as updateThemeDb } from "@/lib/supabase/api/users";
import type { Theme as ThemeType } from "@/lib/supabase/database.types";

const settingsTabs = [
  { value: "billing", icon: CreditCard, label: "Billing" },
  { value: "notifications", icon: Bell, label: "Notifications" },
  { value: "preferences", icon: Settings, label: "Preferences" },
];

const getPricingPlans = (currentMembership: string) => [
  {
    name: "Free",
    price: 0,
    features: [
      { text: "Basic market data", included: true },
      { text: "5 watchlist stocks", included: true },
      { text: "Daily market news", included: true },
      { text: "Real-time data", included: false },
      { text: "AI analysis", included: false },
    ],
    buttonText: currentMembership === "FREE" ? "Current Plan" : "Downgrade",
    buttonVariant: "outline" as const,
    buttonDisabled: currentMembership === "FREE",
    badge:
      currentMembership === "FREE"
        ? { icon: Sparkles, text: "Current Plan" }
        : undefined,
    highlight: currentMembership === "FREE",
  },
  {
    name: "Pro",
    price: 29,
    features: [
      { text: "Real-time market data", included: true, highlighted: true },
      { text: "Unlimited watchlist", included: true, highlighted: true },
      { text: "AI-powered analysis", included: true, highlighted: true },
      { text: "Advanced charts", included: true, highlighted: true },
      { text: "Priority support", included: true, highlighted: true },
    ],
    buttonText: currentMembership === "PRO" ? "Current Plan" : "Upgrade",
    buttonVariant: "default" as const,
    buttonDisabled: currentMembership === "PRO",
    badge:
      currentMembership === "PRO"
        ? { icon: Sparkles, text: "Current Plan" }
        : undefined,
    highlight: currentMembership === "PRO",
    popularLabel: "POPULAR",
  },
  {
    name: "Enterprise",
    price: 99,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Custom AI models", included: true },
      { text: "API access", included: true },
      { text: "Team collaboration", included: true },
      { text: "24/7 dedicated support", included: true },
    ],
    buttonText: currentMembership === "ENTERPRISE" ? "Current Plan" : "Upgrade",
    buttonVariant: "default" as const,
    buttonDisabled: currentMembership === "ENTERPRISE",
    badge:
      currentMembership === "ENTERPRISE"
        ? { icon: Sparkles, text: "Current Plan" }
        : undefined,
    highlight: currentMembership === "ENTERPRISE",
  },
];

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const { user, isLoading: authLoading } = useAuth();
  const {
    profile,
    isLoading: profileLoading,
    refresh: refreshProfile,
  } = useUserProfile();

  const [activeTab, setActiveTab] = useState("billing");
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    priceAlerts: true,
    marketNews: true,
    portfolioUpdates: true,
    breakingNews: true,
    tradeConfirmations: true,
  });

  useEffect(() => {
    setMounted(true);

    // Get tab from URL
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard/settings?tab=${value}`, { scroll: false });
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);

    if (user && profile) {
      // Update theme in database
      const themeValue = newTheme.toUpperCase() as ThemeType;
      await updateThemeDb(user.id, themeValue);
    }
  };

  const handleNotificationChange = async (
    key: keyof typeof notificationSettings,
    value: boolean
  ) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));

    // TODO: Save to database when notification settings are mapped to database fields
    // For now, just update local state
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300 overflow-hidden">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title="Settings"
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-2 min-w-0">
            {/* Settings Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <div className="flex flex-col md:flex-row gap-2">
                {/* Vertical Tab List (Tablet/Desktop) / Horizontal Tab List (Mobile) */}
                <div className="w-full md:w-48 flex-shrink-0">
                  {/* Mobile: Horizontal scrolling tabs */}
                  <TabsList className="h-auto rounded-lg flex md:hidden flex-row items-center gap-1.5 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark p-1.5 overflow-x-auto scrollbar-hide">
                    {settingsTabs.map((tab) => {
                      const isActive = activeTab === tab.value;
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className={`flex-shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/70"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {/* Tablet/Desktop: Vertical tabs */}
                  <TabsList className="hidden md:flex h-auto flex-col items-stretch gap-1 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-2 sticky top-0">
                    {settingsTabs.map((tab) => {
                      const isActive = activeTab === tab.value;
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className={`w-full flex items-center justify-start gap-2 px-2.5 h-9 rounded-lg text-xs font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/70"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="flex-1 text-left">{tab.label}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>

                {/* Tab Content Area */}
                <div className="flex-1 min-w-0">
                  {/* Billing Tab */}
                  <TabsContent value="billing" className="mt-0">
                    <SectionCard
                      title="Choose Your Plan"
                      useSectionHeader
                      sectionHeaderIcon={CreditCard}
                      sectionHeaderSubtitle="Select the perfect plan for your investment needs"
                    >
                      {/* Pricing Cards */}
                      <div className="px-4 sm:px-6 mt-0 sm:mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                        {getPricingPlans(profile?.membership || "FREE").map(
                          (plan) => (
                            <PricingCard key={plan.name} {...plan} />
                          )
                        )}
                      </div>
                    </SectionCard>
                  </TabsContent>

                  {/* Notifications Tab */}
                  <TabsContent
                    value="notifications"
                    className="mt-0 space-y-4 sm:space-y-6"
                  >
                    <SectionCard
                      title="Notifications"
                      useSectionHeader
                      sectionHeaderIcon={Bell}
                      sectionHeaderSubtitle="Manage how you receive notifications"
                    >
                      <div className="px-4 pb-4 space-y-4 sm:space-y-5">
                        {/* Email Notifications */}
                        <div>
                          <h3 className="text-xs font-medium mb-2 text-gray-700 dark:text-white/70">
                            Email Notifications
                          </h3>
                          <div className="space-y-2">
                            {[
                              {
                                id: "price-alerts",
                                label: "Price Alerts",
                                description:
                                  "Get notified when your watchlist stocks hit target prices",
                              },
                              {
                                id: "market-news",
                                label: "Market News",
                                description:
                                  "Receive daily market news and analysis",
                              },
                              {
                                id: "portfolio-updates",
                                label: "Portfolio Updates",
                                description:
                                  "Weekly summary of your portfolio performance",
                              },
                            ].map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200"
                              >
                                <div className="flex-1 space-y-0.5 pr-2">
                                  <Label
                                    htmlFor={item.id}
                                    className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                                  >
                                    {item.label}
                                  </Label>
                                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-white/60">
                                    {item.description}
                                  </p>
                                </div>
                                <Switch
                                  id={item.id}
                                  defaultChecked
                                  className="ml-2 flex-shrink-0"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Push Notifications */}
                        <div>
                          <h3 className="text-xs font-medium mb-2 text-gray-700 dark:text-white/70">
                            Push Notifications
                          </h3>
                          <div className="space-y-2">
                            {[
                              {
                                id: "breaking-news",
                                label: "Breaking News",
                                description:
                                  "Instant alerts for major market events",
                              },
                              {
                                id: "trade-confirmations",
                                label: "Trade Confirmations",
                                description:
                                  "Notifications when trades are executed",
                              },
                            ].map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200"
                              >
                                <div className="flex-1 space-y-0.5 pr-2">
                                  <Label
                                    htmlFor={item.id}
                                    className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                                  >
                                    {item.label}
                                  </Label>
                                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-white/60">
                                    {item.description}
                                  </p>
                                </div>
                                <Switch
                                  id={item.id}
                                  defaultChecked
                                  className="ml-2 flex-shrink-0"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </SectionCard>
                  </TabsContent>

                  {/* Preferences Tab */}
                  <TabsContent
                    value="preferences"
                    className="mt-0 space-y-4 sm:space-y-6"
                  >
                    <SectionCard
                      title="Display Preferences"
                      useSectionHeader
                      sectionHeaderIcon={Settings}
                      sectionHeaderSubtitle="Customize your experience"
                    >
                      <div className="px-4 pb-4 space-y-3 sm:space-y-4">
                        {/* Language */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-white/70 flex items-center gap-1.5">
                            <Globe className="w-3 h-3" />
                            Language
                          </Label>
                          <Select defaultValue="english">
                            <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="zh-cn">Chinese</SelectItem>
                              <SelectItem value="spanish">Spanish</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Theme Selection */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-gray-700 dark:text-white/70 flex items-center gap-1.5">
                            <SunMoon className="w-3 h-3" />
                            Theme Mode
                          </Label>
                          {mounted && (
                            <div className="flex flex-wrap gap-2">
                              {[
                                {
                                  value: "light",
                                  icon: Sun,
                                  label: "Light",
                                  description: "Light theme",
                                },
                                {
                                  value: "dark",
                                  icon: Moon,
                                  label: "Dark",
                                  description: "Dark theme",
                                },
                                {
                                  value: "system",
                                  icon: Monitor,
                                  label: "System",
                                  description: "Follow system",
                                },
                              ].map((mode) => {
                                const Icon = mode.icon;
                                const isActive = theme === mode.value;
                                return (
                                  <button
                                    key={mode.value}
                                    onClick={() =>
                                      handleThemeChange(mode.value)
                                    }
                                    className={`w-[100px] flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 ${
                                      isActive
                                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                                        : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10"
                                    }`}
                                  >
                                    <div
                                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${
                                        isActive
                                          ? "bg-primary text-white"
                                          : "dark:bg-card-dark text-gray-600 dark:text-white/70"
                                      }`}
                                    >
                                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                    </div>
                                    <div className="text-center">
                                      <p
                                        className={`font-medium text-[10px] sm:text-xs ${
                                          isActive
                                            ? "text-primary"
                                            : "text-gray-900 dark:text-white"
                                        }`}
                                      >
                                        {mode.label}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        {/* Data Display */}
                        <div>
                          <h3 className="text-xs font-medium mb-2 text-gray-700 dark:text-white/70">
                            Data Display
                          </h3>
                          <div className="space-y-2">
                            {[
                              {
                                id: "percentage-change",
                                label: "Show percentage change",
                                description:
                                  "Display price changes as percentages",
                              },
                              {
                                id: "auto-refresh",
                                label: "Auto-refresh data",
                                description:
                                  "Automatically refresh market data every 30 seconds",
                              },
                              {
                                id: "compact-view",
                                label: "Compact view",
                                description: "Show more data in less space",
                              },
                            ].map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200"
                              >
                                <div className="flex-1 space-y-0.5 pr-2">
                                  <Label
                                    htmlFor={item.id}
                                    className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                                  >
                                    {item.label}
                                  </Label>
                                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-white/60">
                                    {item.description}
                                  </p>
                                </div>
                                <Switch
                                  id={item.id}
                                  defaultChecked
                                  className="ml-2 flex-shrink-0"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </SectionCard>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
