"use client";

import { useEffect, useState } from "react";
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

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
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
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Get tab from URL
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }

    return () => clearInterval(timer);
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
          subtitle="Manage your account settings and preferences"
          currentTime={currentTime}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <div className="flex-1 overflow-y-auto border-t border-border-light dark:border-border-dark">
          <div className="p-3 sm:p-4 lg:p-5 min-w-0">
            {/* Settings Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* Vertical Tab List (Desktop) / Horizontal Tab List (Mobile) */}
                <div className="w-full lg:w-64 flex-shrink-0">
                  {/* Mobile: Horizontal scrolling tabs */}
                  <TabsList className="h-auto flex lg:hidden flex-row items-center gap-2 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-2 overflow-x-auto scrollbar-hide">
                    {settingsTabs.map((tab) => {
                      const isActive = activeTab === tab.value;
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className={`flex-shrink-0 flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/70"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {/* Desktop: Vertical tabs */}
                  <TabsList className="hidden lg:flex h-auto flex-col items-stretch gap-1.5 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-3 sticky top-0">
                    {settingsTabs.map((tab) => {
                      const isActive = activeTab === tab.value;
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className={`w-full flex items-center justify-start gap-3 px-3 h-11 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/70"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
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
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                              Personal Information
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                              {isEditing
                                ? "Update your personal details"
                                : "View your personal details"}
                            </p>
                          </div>
                        </div>
                        {!isEditing && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditToggle}
                            className="gap-2 w-full sm:w-auto"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                        )}
                      </div>

                      <div className="space-y-5">
                        {/* Profile Avatar Section */}
                        <Dialog
                          open={avatarDialogOpen}
                          onOpenChange={setAvatarDialogOpen}
                        >
                          <div className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4">
                            <div className="relative">
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                                JD
                              </div>
                              <DialogTrigger asChild>
                                <button className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-white dark:bg-card-dark rounded-full flex items-center justify-center shadow-md border-2 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 hover:scale-110 transition-all duration-200 cursor-pointer">
                                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-white/70" />
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
                                onClick={() => {
                                  setAvatarDialogOpen(false);
                                  setSelectedFile(null);
                                  setPreviewUrl(null);
                                }}
                                className="w-full sm:w-auto"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                onClick={handleUploadAvatar}
                                disabled={!selectedFile}
                                className="gap-2 w-full sm:w-auto"
                              >
                                <Upload className="w-4 h-4" />
                                Upload
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        {/* Full Name */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-white/70 flex items-center gap-2">
                            <User className="w-4 h-4" />
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
                              className="h-10 sm:h-11"
                            />
                          ) : (
                            <p className="text-sm sm:text-base text-gray-900 dark:text-white py-2 sm:py-2.5 px-3 sm:px-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                              {formData.fullName}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-white/70 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
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
                              className="h-10 sm:h-11"
                            />
                          ) : (
                            <p className="text-sm sm:text-base text-gray-900 dark:text-white py-2 sm:py-2.5 px-3 sm:px-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 break-all">
                              {formData.email}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-white/70 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
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
                              className="h-10 sm:h-11"
                            />
                          ) : (
                            <p className="text-sm sm:text-base text-gray-900 dark:text-white py-2 sm:py-2.5 px-3 sm:px-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                              {formData.phone}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                            <Button
                              variant="outline"
                              size="default"
                              onClick={handleCancelEdit}
                              className="w-full sm:w-auto"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="default"
                              className="gap-2 w-full sm:w-auto sm:ml-auto"
                              onClick={handleSaveChanges}
                            >
                              <Check className="w-4 h-4" />
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Billing Tab */}
                  <TabsContent value="billing" className="mt-0">
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                            Choose Your Plan
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                            Select the perfect plan for your investment needs
                          </p>
                        </div>
                      </div>

                      {/* Pricing Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        {/* Free Plan */}
                        <div className="group relative flex flex-col p-5 sm:p-6 lg:p-8 bg-white dark:bg-card-dark border-2 border-gray-200 dark:border-white/10 rounded-2xl hover:border-gray-300 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300">
                          <div className="mb-5 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                              Free
                            </h3>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                                $0
                              </span>
                              <span className="text-gray-500 dark:text-white/50 text-sm sm:text-base">
                                /month
                              </span>
                            </div>
                          </div>
                          <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span>Basic market data</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span>5 watchlist stocks</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span>Daily market news</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-400 dark:text-white/30">
                              <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <X className="w-3 h-3" />
                              </div>
                              <span>Real-time data</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-400 dark:text-white/30">
                              <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <X className="w-3 h-3" />
                              </div>
                              <span>AI analysis</span>
                            </li>
                          </ul>
                          <Button
                            variant="outline"
                            className="w-full h-10 sm:h-11 text-sm"
                          >
                            Current Plan
                          </Button>
                        </div>

                        {/* Pro Plan - Current */}
                        <div className="relative flex flex-col p-5 sm:p-6 lg:p-8 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent dark:from-primary/10 dark:via-primary/5 dark:to-transparent border-2 border-primary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 md:scale-105 mt-4 sm:mt-0">
                          {/* Popular Badge */}
                          <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-10">
                            <div className="px-3 py-1 sm:px-4 sm:py-1.5 bg-gradient-to-r from-primary to-primary/80 text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-lg flex items-center gap-1 sm:gap-1.5">
                              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              Current Plan
                            </div>
                          </div>
                          <div className="mb-5 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 flex flex-wrap items-center gap-2">
                              Pro
                              <span className="px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary text-[10px] sm:text-xs font-semibold rounded">
                                POPULAR
                              </span>
                            </h3>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                $29
                              </span>
                              <span className="text-gray-500 dark:text-white/50 text-sm sm:text-base">
                                /month
                              </span>
                            </div>
                          </div>
                          <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span className="font-medium">
                                Real-time market data
                              </span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span className="font-medium">
                                Unlimited watchlist
                              </span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span className="font-medium">
                                AI-powered analysis
                              </span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span className="font-medium">
                                Advanced charts
                              </span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span className="font-medium">
                                Priority support
                              </span>
                            </li>
                          </ul>
                          <Button
                            disabled
                            className="w-full h-10 sm:h-11 opacity-70 text-sm"
                          >
                            Current Plan
                          </Button>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="group relative flex flex-col p-5 sm:p-6 lg:p-8 bg-white dark:bg-card-dark border-2 border-gray-200 dark:border-white/10 rounded-2xl hover:border-primary dark:hover:border-primary hover:shadow-xl transition-all duration-300">
                          <div className="mb-5 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                              Enterprise
                            </h3>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                                $99
                              </span>
                              <span className="text-gray-500 dark:text-white/50 text-sm sm:text-base">
                                /month
                              </span>
                            </div>
                          </div>
                          <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span>Everything in Pro</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span>Custom AI models</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span>API access</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span>Team collaboration</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-white/70">
                              <div className="w-5 h-5 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span>24/7 dedicated support</span>
                            </li>
                          </ul>
                          <Button className="w-full h-10 sm:h-11 group-hover:shadow-lg transition-shadow text-sm">
                            Upgrade to Enterprise
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Notifications Tab */}
                  <TabsContent
                    value="notifications"
                    className="mt-0 space-y-4 sm:space-y-6"
                  >
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                            Notification Preferences
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                            Manage how you receive notifications
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6 sm:space-y-8">
                        {/* Email Notifications */}
                        <div>
                          <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-white/70">
                            Email Notifications
                          </h3>
                          <div className="space-y-3">
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
                                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200"
                              >
                                <div className="flex-1 space-y-0.5 pr-3">
                                  <Label
                                    htmlFor={item.id}
                                    className="text-sm sm:text-base font-medium text-gray-900 dark:text-white cursor-pointer"
                                  >
                                    {item.label}
                                  </Label>
                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                                    {item.description}
                                  </p>
                                </div>
                                <Switch
                                  id={item.id}
                                  defaultChecked
                                  className="ml-2 sm:ml-4 flex-shrink-0"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Push Notifications */}
                        <div>
                          <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-white/70">
                            Push Notifications
                          </h3>
                          <div className="space-y-3">
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
                                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200"
                              >
                                <div className="flex-1 space-y-0.5 pr-3">
                                  <Label
                                    htmlFor={item.id}
                                    className="text-sm sm:text-base font-medium text-gray-900 dark:text-white cursor-pointer"
                                  >
                                    {item.label}
                                  </Label>
                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                                    {item.description}
                                  </p>
                                </div>
                                <Switch
                                  id={item.id}
                                  defaultChecked
                                  className="ml-2 sm:ml-4 flex-shrink-0"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Preferences Tab */}
                  <TabsContent
                    value="preferences"
                    className="mt-0 space-y-4 sm:space-y-6"
                  >
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Settings className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                            Display Preferences
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                            Customize your experience
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 sm:space-y-6">
                        {/* Language */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-white/70 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Language
                          </Label>
                          <Select defaultValue="english">
                            <SelectTrigger>
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
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-gray-700 dark:text-white/70 flex items-center gap-2">
                            <SunMoon className="w-4 h-4" />
                            Theme Mode
                          </Label>
                          {mounted && (
                            <div className="flex flex-wrap gap-2 sm:gap-3">
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
                                    className={`w-[120px] flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                                      isActive
                                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                                        : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10"
                                    }`}
                                  >
                                    <div
                                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-colors ${
                                        isActive
                                          ? "bg-primary text-white"
                                          : "dark:bg-card-dark text-gray-600 dark:text-white/70"
                                      }`}
                                    >
                                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="text-center">
                                      <p
                                        className={`font-medium text-xs sm:text-sm ${
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
                          <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-white/70">
                            Data Display
                          </h3>
                          <div className="space-y-3">
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
                                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200"
                              >
                                <div className="flex-1 space-y-0.5 pr-3">
                                  <Label
                                    htmlFor={item.id}
                                    className="text-sm sm:text-base font-medium text-gray-900 dark:text-white cursor-pointer"
                                  >
                                    {item.label}
                                  </Label>
                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                                    {item.description}
                                  </p>
                                </div>
                                <Switch
                                  id={item.id}
                                  defaultChecked
                                  className="ml-2 sm:ml-4 flex-shrink-0"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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
