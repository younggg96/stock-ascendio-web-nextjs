"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  User,
  CreditCard,
  Bell,
  Settings,
  Upload,
  Mail,
  Phone,
  Check,
  X,
  Sparkles,
  Globe,
  Clock,
  DollarSign,
  Camera,
  Image as ImageIcon,
  Edit,
  Sun,
  Moon,
  Monitor,
  SunMoon,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const settingsTabs = [
  { value: "account", icon: User, label: "Account" },
  { value: "billing", icon: CreditCard, label: "Billing" },
  { value: "notifications", icon: Bell, label: "Notifications" },
  { value: "preferences", icon: Settings, label: "Preferences" },
];

const pricingPlans = [
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
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
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
    buttonText: "Current Plan",
    buttonVariant: "default" as const,
    buttonDisabled: true,
    badge: { icon: Sparkles, text: "Current Plan" },
    highlight: true,
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
    buttonText: "Upgrade",
    buttonVariant: "default" as const,
  },
];

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("account");
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 000-0000",
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = () => {
    if (selectedFile) {
      // TODO: Implement actual upload logic
      console.log("Uploading file:", selectedFile);
      setAvatarDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    // TODO: Implement actual save logic
    console.log("Saving changes:", formData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset form data to original values
    setFormData({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 000-0000",
    });
    setIsEditing(false);
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
                  {/* Account Tab */}
                  <TabsContent
                    value="account"
                    className="mt-0 space-y-4 sm:space-y-6"
                  >
                    {/* Personal Information */}
                    <SectionCard
                      title="Personal Information"
                      useSectionHeader
                      sectionHeaderIcon={User}
                      sectionHeaderSubtitle={
                        isEditing
                          ? "Update your personal details"
                          : "View your personal details"
                      }
                      sectionHeaderAction={
                        !isEditing ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditToggle}
                            className="gap-1.5 h-8 text-xs"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                        ) : undefined
                      }
                    >
                      <div className="space-y-4 px-4 pb-4">
                        {/* Profile Avatar Section */}
                        <Dialog
                          open={avatarDialogOpen}
                          onOpenChange={setAvatarDialogOpen}
                        >
                          <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3">
                            <div className="relative">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                                JD
                              </div>
                              <DialogTrigger asChild>
                                <button className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-white dark:bg-card-dark rounded-full flex items-center justify-center shadow-md border-2 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 hover:scale-110 transition-all duration-200 cursor-pointer">
                                  <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 dark:text-white/70" />
                                </button>
                              </DialogTrigger>
                            </div>
                          </div>

                          <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto">
                            <DialogHeader>
                              <DialogTitle className="text-base sm:text-lg">
                                Upload Avatar
                              </DialogTitle>
                              <DialogDescription className="text-xs sm:text-sm">
                                Choose an image file to upload as your profile
                                picture.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center justify-center w-full">
                                <label
                                  htmlFor="avatar-upload"
                                  className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-gray-300 dark:border-white/10 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200"
                                >
                                  {previewUrl ? (
                                    <div className="relative w-full h-full p-3 sm:p-4">
                                      <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center pt-4 pb-5 sm:pt-5 sm:pb-6 px-4">
                                      <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-gray-400 dark:text-white/40" />
                                      <p className="mb-2 text-xs sm:text-sm text-gray-600 dark:text-white/60 text-center">
                                        <span className="font-semibold">
                                          Click to upload
                                        </span>{" "}
                                        or drag and drop
                                      </p>
                                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-white/40">
                                        PNG, JPG or GIF (MAX. 2MB)
                                      </p>
                                    </div>
                                  )}
                                  <input
                                    id="avatar-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                  />
                                </label>
                              </div>
                            </div>
                            <DialogFooter className="gap-2 flex-col sm:flex-row">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setAvatarDialogOpen(false);
                                  setSelectedFile(null);
                                  setPreviewUrl(null);
                                }}
                                className="w-full sm:w-auto h-8 text-xs"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={handleUploadAvatar}
                                disabled={!selectedFile}
                                className="gap-1.5 w-full sm:w-auto h-8 text-xs"
                              >
                                <Upload className="w-3 h-3" />
                                Upload
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Full Name */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-white/70 flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            Full Name
                          </Label>
                          {isEditing ? (
                            <Input
                              id="full-name"
                              type="text"
                              value={formData.fullName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  fullName: e.target.value,
                                })
                              }
                              className="h-8 sm:h-9 text-xs sm:text-sm"
                            />
                          ) : (
                            <p className="text-xs sm:text-sm text-gray-900 dark:text-white py-1.5 sm:py-2 px-2.5 sm:px-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                              {formData.fullName}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-white/70 flex items-center gap-1.5">
                            <Mail className="w-3 h-3" />
                            Email Address
                          </Label>
                          {isEditing ? (
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              className="h-8 sm:h-9 text-xs sm:text-sm"
                            />
                          ) : (
                            <p className="text-xs sm:text-sm text-gray-900 dark:text-white py-1.5 sm:py-2 px-2.5 sm:px-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 break-all">
                              {formData.email}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-white/70 flex items-center gap-1.5">
                            <Phone className="w-3 h-3" />
                            Phone Number
                          </Label>
                          {isEditing ? (
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value,
                                })
                              }
                              className="h-8 sm:h-9 text-xs sm:text-sm"
                            />
                          ) : (
                            <p className="text-xs sm:text-sm text-gray-900 dark:text-white py-1.5 sm:py-2 px-2.5 sm:px-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                              {formData.phone}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                          <div className="flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-gray-200 dark:border-white/10">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                              className="w-full sm:w-auto h-8 text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1.5 w-full sm:w-auto sm:ml-auto h-8 text-xs"
                              onClick={handleSaveChanges}
                            >
                              <Check className="w-3 h-3" />
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  </TabsContent>

                  {/* Billing Tab */}
                  <TabsContent value="billing" className="mt-0">
                    <SectionCard
                      title="Choose Your Plan"
                      useSectionHeader
                      sectionHeaderIcon={CreditCard}
                      sectionHeaderSubtitle="Select the perfect plan for your investment needs"
                    >
                      {/* Pricing Cards */}
                      <div className="p-4 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                        {pricingPlans.map((plan) => (
                          <PricingCard key={plan.name} {...plan} />
                        ))}
                      </div>
                    </SectionCard>
                  </TabsContent>

                  {/* Notifications Tab */}
                  <TabsContent
                    value="notifications"
                    className="mt-0 space-y-4 sm:space-y-6"
                  >
                    <SectionCard
                      title="Notification Preferences"
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
                                    onClick={() => setTheme(mode.value)}
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
