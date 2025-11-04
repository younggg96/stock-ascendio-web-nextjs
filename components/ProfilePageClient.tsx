"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth, useUserProfile } from "@/hooks";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SectionCard from "./SectionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  User,
  Mail,
  Phone,
  Edit,
  Check,
  Camera,
  Upload,
  Heart,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "sonner";
import { updateUserProfile } from "@/lib/supabase/api/users";
import { createClient } from "@/lib/supabase/client";
import { CardSkeleton, ProfileInfoSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { socialPostToUnifiedPost, UnifiedPost } from "@/lib/postTypes";
import { SwitchTab } from "./ui/switch-tab";
import PostFeedList from "./PostFeedList";

const profileTabs = [
  { value: "info", icon: User, label: "Personal Info" },
  { value: "liked", icon: Heart, label: "Liked" },
  { value: "favorited", icon: Star, label: "Favorited" },
];

const PlatformTabOption = [
  {
    value: "all",
    label: "All",
    icon: "",
  },
  {
    value: "x",
    label: "X",
    icon: (
      <Image
        src="/logo/x.svg"
        alt="X"
        width={16}
        height={16}
        className="w-4 h-4"
      />
    ),
  },
  {
    value: "reddit",
    label: "Reddit",
    icon: (
      <Image
        src="/logo/reddit.svg"
        alt="Reddit"
        width={16}
        height={16}
        className="w-4 h-4"
      />
    ),
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: (
      <Image
        src="/logo/youtube.svg"
        alt="YouTube"
        width={16}
        height={16}
        className="w-4 h-4"
      />
    ),
  },
  {
    value: "rednote",
    label: "Rednote",
    icon: (
      <Image
        src="/logo/rednote.svg"
        alt="Rednote"
        width={16}
        height={16}
        className="w-4 h-4"
      />
    ),
  },
];

export default function ProfilePageClient() {
  const { user } = useAuth();
  const {
    profile,
    isLoading: profileLoading,
    refresh: refreshProfile,
  } = useUserProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  // Form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  // Posts data
  const [likedPosts, setLikedPosts] = useState<UnifiedPost[]>([]);
  const [favoritedPosts, setFavoritedPosts] = useState<UnifiedPost[]>([]);
  const [isLoadingLiked, setIsLoadingLiked] = useState(false);
  const [isLoadingFavorited, setIsLoadingFavorited] = useState(false);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        phone: profile.phone_e164 || "",
      });
    }
  }, [profile]);

  // Fetch liked posts
  const fetchLikedPosts = useCallback(async () => {
    setIsLoadingLiked(true);
    try {
      const response = await fetch("/api/user/posts?type=liked");
      if (!response.ok) throw new Error("Failed to fetch liked posts");
      const data = await response.json();

      const posts = (data.posts || []).map((post: any) =>
        socialPostToUnifiedPost(post)
      );
      setLikedPosts(posts);
    } catch (error) {
      console.error("Error fetching liked posts:", error);
      toast.error("Failed to load liked posts");
    } finally {
      setIsLoadingLiked(false);
    }
  }, []);

  // Fetch favorited posts
  const fetchFavoritedPosts = useCallback(async () => {
    setIsLoadingFavorited(true);
    try {
      const response = await fetch("/api/user/posts?type=favorited");
      if (!response.ok) throw new Error("Failed to fetch favorited posts");
      const data = await response.json();

      const posts = (data.posts || []).map((post: any) =>
        socialPostToUnifiedPost(post)
      );
      setFavoritedPosts(posts);
    } catch (error) {
      console.error("Error fetching favorited posts:", error);
      toast.error("Failed to load favorited posts");
    } finally {
      setIsLoadingFavorited(false);
    }
  }, []);

  // Load posts when tab changes and reset platform filter
  useEffect(() => {
    if (activeTab === "liked") {
      if (likedPosts.length === 0) {
        fetchLikedPosts();
      }
      setSelectedPlatform("all"); // Reset platform filter when switching tabs
    } else if (activeTab === "favorited") {
      if (favoritedPosts.length === 0) {
        fetchFavoritedPosts();
      }
      setSelectedPlatform("all"); // Reset platform filter when switching tabs
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      const supabase = createClient();
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("user-uploads")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("user-uploads").getPublicUrl(filePath);

      const result = await updateUserProfile(user.id, {
        avatar_url: publicUrl,
      });

      if (result.success) {
        toast.success("Avatar updated successfully");
        await refreshProfile();
        setAvatarDialogOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    if (formData.phone && formData.phone.trim() !== "") {
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(formData.phone)) {
        toast.error(
          "Invalid phone format. Use E.164 format: +[country code][number] (e.g., +14155552671)"
        );
        return;
      }
    }

    setIsSaving(true);
    try {
      const result = await updateUserProfile(user.id, {
        username: formData.username || null,
        phone_e164:
          formData.phone && formData.phone.trim() !== ""
            ? formData.phone
            : null,
      });

      if (result.success) {
        toast.success("Profile updated successfully");
        await refreshProfile();
        setIsEditing(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Save error:", error);
      if (error.message?.includes("chk_phone_format")) {
        toast.error(
          "Invalid phone format. Use E.164 format: +[country code][number]"
        );
      } else {
        toast.error(error.message || "Failed to update profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        phone: profile.phone_e164 || "",
      });
    }
    setIsEditing(false);
  };

  // Filter posts by platform
  const filteredLikedPosts =
    selectedPlatform === "all"
      ? likedPosts
      : likedPosts.filter((post) => post.platform === selectedPlatform);

  const filteredFavoritedPosts =
    selectedPlatform === "all"
      ? favoritedPosts
      : favoritedPosts.filter((post) => post.platform === selectedPlatform);

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300 overflow-hidden">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header title="Profile" onMenuClick={() => setIsMobileMenuOpen(true)} />

        <div className="flex-1 overflow-y-auto">
          <div className="p-2 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col md:flex-row gap-2">
                {/* Tabs List */}
                <div className="w-full md:w-48 flex-shrink-0">
                  {/* Mobile: Horizontal tabs */}
                  <TabsList className="h-auto rounded-lg flex md:hidden flex-row items-center gap-1.5 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark p-1.5 overflow-x-auto scrollbar-hide">
                    {profileTabs.map((tab) => {
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

                  {/* Desktop: Vertical tabs */}
                  <TabsList className="hidden md:flex h-auto flex-col items-stretch gap-1 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-2 sticky top-0">
                    {profileTabs.map((tab) => {
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

                {/* Tab Content */}
                <div className="flex-1 min-w-0">
                  {/* Personal Info Tab */}
                  <TabsContent value="info" className="mt-0">
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
                        !isEditing && !profileLoading ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="gap-1.5 h-8 text-xs"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                        ) : undefined
                      }
                    >
                      {profileLoading ? (
                        <ProfileInfoSkeleton />
                      ) : (
                        <div className="space-y-4 px-4 pb-4">
                          {/* Avatar */}
                          <Dialog
                            open={avatarDialogOpen}
                            onOpenChange={setAvatarDialogOpen}
                          >
                            <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3">
                              <div className="relative">
                                {profile?.avatar_url ? (
                                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg">
                                    <Image
                                      src={profile.avatar_url}
                                      alt="Profile"
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 640px) 64px, 80px"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                                    {profile?.username
                                      ? profile.username
                                          .substring(0, 2)
                                          .toUpperCase()
                                      : profile?.email
                                          ?.substring(0, 2)
                                          .toUpperCase() || "US"}
                                  </div>
                                )}
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
                                        <div className="relative w-full h-full">
                                          <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover rounded-lg"
                                            sizes="(max-width: 640px) 300px, 400px"
                                          />
                                        </div>
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
                                  disabled={!selectedFile || isUploading}
                                  className="gap-1.5 w-full sm:w-auto h-8 text-xs"
                                >
                                  <Upload className="w-3 h-3" />
                                  {isUploading ? "Uploading..." : "Upload"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {/* Email */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700 dark:text-white/70 flex items-center gap-1.5">
                              <Mail className="w-3 h-3" />
                              Email Address
                            </Label>
                            <p className="text-xs sm:text-sm text-gray-900 dark:text-white py-1.5 sm:py-2 px-2.5 sm:px-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 break-all">
                              {formData.email}
                            </p>
                          </div>

                          {/* Username */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700 dark:text-white/70 flex items-center gap-1.5">
                              <User className="w-3 h-3" />
                              Username
                            </Label>
                            {isEditing ? (
                              <Input
                                id="username"
                                type="text"
                                value={formData.username}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    username: e.target.value,
                                  })
                                }
                                placeholder="Enter username"
                                className="h-8 sm:h-9 text-xs sm:text-sm"
                              />
                            ) : (
                              <p className="text-xs sm:text-sm text-gray-900 dark:text-white py-1.5 sm:py-2 px-2.5 sm:px-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                                {formData.username || "-"}
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
                              <div className="space-y-1">
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
                                  placeholder="+14155552671"
                                  className="h-8 sm:h-9 text-xs sm:text-sm"
                                />
                              </div>
                            ) : (
                              <p className="text-xs sm:text-sm text-gray-900 dark:text-white py-1.5 sm:py-2 px-2.5 sm:px-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                                {formData.phone || "-"}
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
                                disabled={isSaving}
                              >
                                <Check className="w-3 h-3" />
                                {isSaving ? "Saving..." : "Save Changes"}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </SectionCard>
                  </TabsContent>

                  {/* Liked Posts Tab */}
                  <TabsContent value="liked" className="mt-0">
                    <SectionCard
                      useSectionHeader={false}
                      scrollable
                      contentClassName="space-y-0 px-4 pb-4"
                      className="h-full flex flex-col"
                    >
                      {/* Platform Filter */}
                      <div className="border-b border-border-light dark:border-border-dark">
                        <SwitchTab
                          options={PlatformTabOption}
                          value={selectedPlatform}
                          onValueChange={setSelectedPlatform}
                          size="md"
                          variant="underline"
                          className="w-full"
                        />
                      </div>

                      {isLoadingLiked ? (
                        <div className="space-y-2 pt-3">
                          <CardSkeleton />
                          <CardSkeleton />
                          <CardSkeleton />
                        </div>
                      ) : filteredLikedPosts.length === 0 ? (
                        <div className="px-4 py-8">
                          <EmptyState
                            title={
                              likedPosts.length === 0
                                ? "No liked posts"
                                : "No posts found"
                            }
                          />
                        </div>
                      ) : (
                        <div className="pt-3">
                          <PostFeedList posts={filteredLikedPosts} />
                        </div>
                      )}
                    </SectionCard>
                  </TabsContent>

                  {/* Favorited Posts Tab */}
                  <TabsContent value="favorited" className="mt-0">
                    <SectionCard
                      useSectionHeader={false}
                      scrollable
                      contentClassName="space-y-0 px-4 pb-4"
                      className="h-full flex flex-col"
                    >
                      {/* Platform Filter */}
                      <div className="border-b border-border-light dark:border-border-dark">
                        <SwitchTab
                          options={PlatformTabOption}
                          value={selectedPlatform}
                          onValueChange={setSelectedPlatform}
                          size="md"
                          variant="underline"
                          className="w-full"
                        />
                      </div>

                      {isLoadingFavorited ? (
                        <div className="space-y-2 pt-3">
                          <CardSkeleton />
                          <CardSkeleton />
                          <CardSkeleton />
                        </div>
                      ) : filteredFavoritedPosts.length === 0 ? (
                        <div className="px-4 py-8">
                          <EmptyState
                            title={
                              favoritedPosts.length === 0
                                ? "No favorited posts"
                                : "No posts found"
                            }
                          />
                        </div>
                      ) : (
                        <div className="pt-3">
                          <PostFeedList posts={filteredFavoritedPosts} />
                        </div>
                      )}
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
