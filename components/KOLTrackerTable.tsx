"use client";

import { useState } from "react";
import Image from "next/image";
import { useBreakpoints } from "@/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  KOL,
  Platform,
  platformConfig,
  formatFollowers,
  updateKOL,
  CreateKOLInput,
} from "@/lib/kolApi";
import { trackKOL, untrackKOL } from "@/lib/trackedKolApi";
import type { Platform as DBPlatform } from "@/lib/supabase/database.types";
import { Trash2, Plus, Star, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface KOLTrackerTableProps {
  kols: KOL[];
  onUpdate: () => void;
  loading?: boolean;
}

export default function KOLTrackerTable({
  kols,
  onUpdate,
  loading = false,
}: KOLTrackerTableProps) {
  const { isMobile } = useBreakpoints();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingKOL, setEditingKOL] = useState<KOL | null>(null);
  const [deletingKOLId, setDeletingKOLId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<Platform | "all">("all");

  // Form state for add/edit
  const [formData, setFormData] = useState<CreateKOLInput>({
    name: "",
    username: "",
    platform: "twitter",
    followers: 0,
    description: "",
    avatarUrl: "",
    isTracking: false,
  });

  // Filter KOLs (only tracked KOLs are shown in this component)
  const filteredKOLs = kols.filter((kol) => {
    // Search filter
    const matchesSearch =
      kol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kol.username.toLowerCase().includes(searchTerm.toLowerCase());

    // Platform filter
    const matchesPlatform =
      filterPlatform === "all" || kol.platform === filterPlatform;

    return matchesSearch && matchesPlatform;
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      platform: "twitter",
      followers: 0,
      description: "",
      avatarUrl: "",
      isTracking: false,
    });
  };

  // Handle add KOL - now uses real tracking API
  const handleAdd = async () => {
    try {
      // Map platform types for the tracking API
      const platformMap: { [key: string]: DBPlatform } = {
        twitter: "TWITTER",
        reddit: "REDDIT",
        youtube: "YOUTUBE",
        rednote: "REDNOTE",
      };

      await trackKOL({
        kol_id: formData.username,
        platform: platformMap[formData.platform],
        notify: true,
      });
      toast.success("KOL added to tracking list successfully");
      setIsAddDialogOpen(false);
      resetForm();
      onUpdate();
    } catch (error) {
      toast.error("Failed to add KOL");
      console.error(error);
    }
  };

  // Handle edit KOL
  const handleEdit = async () => {
    if (!editingKOL) return;

    try {
      await updateKOL(editingKOL.id, formData);
      toast.success("KOL updated successfully");
      setIsEditDialogOpen(false);
      setEditingKOL(null);
      resetForm();
      onUpdate();
    } catch (error) {
      toast.error("Failed to update KOL");
      console.error(error);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id: string) => {
    setDeletingKOLId(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete KOL - now uses real tracking API
  const handleDelete = async () => {
    if (!deletingKOLId) return;

    try {
      // Find the KOL to get its platform
      const kol = kols.find((k) => k.id === deletingKOLId);
      if (!kol) {
        throw new Error("KOL not found");
      }

      // Map platform type to database format
      const platformMap: { [key: string]: DBPlatform } = {
        twitter: "TWITTER",
        reddit: "REDDIT",
        youtube: "YOUTUBE",
        rednote: "REDNOTE",
      };

      await untrackKOL(deletingKOLId, platformMap[kol.platform]);
      toast.success("KOL removed from tracking list successfully");
      setIsDeleteDialogOpen(false);
      setDeletingKOLId(null);
      onUpdate();
    } catch (error) {
      toast.error("Failed to remove KOL");
      console.error(error);
    }
  };

  // Handle toggle tracking - now uses real tracking API
  const handleToggleTracking = async (kol: KOL) => {
    try {
      // Map platform type to database format
      const platformMap: { [key: string]: DBPlatform } = {
        twitter: "TWITTER",
        reddit: "REDDIT",
        youtube: "YOUTUBE",
        rednote: "REDNOTE",
      };

      // In the tracked tab, toggle means untrack
      await untrackKOL(kol.id, platformMap[kol.platform]);
      toast.success("Stopped tracking KOL");
      onUpdate();
    } catch (error) {
      toast.error("Failed to update tracking status");
      console.error(error);
    }
  };

  // Open add dialog
  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 dark:text-white/50">
              Loading tracked KOLs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full">
          <Input
            placeholder="Search tracked KOLs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={filterPlatform}
            onValueChange={(value) =>
              setFilterPlatform(value as Platform | "all")
            }
          >
            <SelectTrigger className="w-full sm:w-[200px] text-xs">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="twitter">X (Twitter)</SelectItem>
              <SelectItem value="reddit">Reddit</SelectItem>
              <SelectItem value="rednote">Rednote</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={openAddDialog}
          size="lg"
          className="flex items-center gap-1.5 h-[40px] text-xs w-full sm:w-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Track New KOL
        </Button>
      </div>

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="space-y-2">
          {filteredKOLs.length === 0 ? (
            <div className="text-center py-8 border border-border-light dark:border-border-dark rounded-lg">
              <p className="text-xs text-gray-500 dark:text-white/50">
                {kols.length === 0
                  ? "No tracked KOLs yet. Click 'Track New KOL' button to start tracking."
                  : "No KOLs match your search criteria."}
              </p>
            </div>
          ) : (
            filteredKOLs.map((kol) => (
              <div
                key={kol.id}
                className="border border-border-light dark:border-border-dark rounded-lg p-3 bg-card-light dark:bg-card-dark"
              >
                {/* Header with Avatar, Name and Actions */}
                <div className="flex items-start gap-3 mb-2">
                  {/* Avatar */}
                  {kol.avatarUrl ? (
                    <Image
                      src={kol.avatarUrl}
                      alt={kol.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-gray-200 dark:ring-white/10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 dark:ring-white/10">
                      <span className="text-xs font-bold text-gray-600 dark:text-white/60">
                        {kol.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {kol.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-white/60 truncate">
                      {kol.username}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleToggleTracking(kol)}
                      className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 h-7 w-7 p-0"
                      title="Stop tracking"
                    >
                      <Star className="w-3.5 h-3.5 fill-yellow-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => openDeleteDialog(kol.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-7 w-7 p-0"
                      title="Remove from tracking"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Platform and Followers */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={platformConfig[kol.platform].icon}
                      alt={platformConfig[kol.platform].name}
                      width={14}
                      height={14}
                      className="opacity-70"
                    />
                    <span className="text-xs text-gray-700 dark:text-white/70">
                      {platformConfig[kol.platform].name}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {formatFollowers(kol.followers)} followers
                  </span>
                </div>

                {/* Description */}
                {kol.description && (
                  <p className="text-xs text-gray-600 dark:text-white/60 line-clamp-2">
                    {kol.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="border border-border-light dark:border-border-dark rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Creator</TableHead>
                <TableHead className="text-xs">Platform</TableHead>
                <TableHead className="text-xs text-center">Followers</TableHead>
                <TableHead className="text-xs hidden lg:table-cell">
                  Description
                </TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKOLs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      {kols.length === 0
                        ? "No tracked KOLs yet. Click 'Track New KOL' button to start tracking."
                        : "No KOLs match your search criteria."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredKOLs.map((kol) => (
                  <TableRow key={kol.id}>
                    {/* Creator with Avatar */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2.5">
                        {kol.avatarUrl ? (
                          <Image
                            src={kol.avatarUrl}
                            alt={kol.name}
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-full ring-2 ring-gray-100 dark:ring-white/10 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center ring-2 ring-gray-100 dark:ring-white/10 flex-shrink-0">
                            <span className="text-xs font-bold text-gray-600 dark:text-white/60">
                              {kol.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {kol.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-white/50 truncate">
                            {kol.username}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {/* Platform */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5">
                        <Image
                          src={platformConfig[kol.platform].icon}
                          alt={platformConfig[kol.platform].name}
                          width={16}
                          height={16}
                          className="opacity-80"
                        />
                        <span className="text-xs">
                          {platformConfig[kol.platform].name}
                        </span>
                      </div>
                    </TableCell>
                    {/* Followers */}
                    <TableCell className="text-xs text-center font-semibold py-3">
                      {formatFollowers(kol.followers)}
                    </TableCell>
                    {/* Description */}
                    <TableCell className="text-xs max-w-[250px] truncate hidden lg:table-cell py-3">
                      {kol.description || "-"}
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="text-right py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => openDeleteDialog(kol.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                          title="Remove from tracking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Track New KOL</DialogTitle>
            <DialogDescription>
              Add a creator from our database to your tracking list. You can
              find creator IDs from the Top Ranking tab.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs">
                Creator ID *
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Enter creator ID from database"
                className="h-8 text-xs"
              />
              <p className="text-xs text-gray-500 dark:text-white/50">
                Find creators in the Top Ranking tab and use their ID
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="platform" className="text-xs">
                Platform *
              </Label>
              <Select
                value={formData.platform}
                onValueChange={(value: Platform) =>
                  setFormData({ ...formData, platform: value })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">X (Twitter)</SelectItem>
                  <SelectItem value="reddit">Reddit</SelectItem>
                  <SelectItem value="rednote">Rednote</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddDialogOpen(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              size="sm"
              className="h-8 text-xs"
              disabled={!formData.username.trim()}
            >
              Track
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit KOL</DialogTitle>
            <DialogDescription>
              Update the KOL information and tracking status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-xs">
                Name *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter KOL name"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-username" className="text-xs">
                Username *
              </Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="@username"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-platform" className="text-xs">
                Platform *
              </Label>
              <Select
                value={formData.platform}
                onValueChange={(value: Platform) =>
                  setFormData({ ...formData, platform: value })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">X (Twitter)</SelectItem>
                  <SelectItem value="reddit">Reddit</SelectItem>
                  <SelectItem value="rednote">Rednote</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-followers" className="text-xs">
                Followers
              </Label>
              <Input
                id="edit-followers"
                type="number"
                value={formData.followers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    followers: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-description" className="text-xs">
                Description
              </Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description"
                className="h-8 text-xs"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-tracking"
                checked={formData.isTracking}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isTracking: checked })
                }
              />
              <Label htmlFor="edit-tracking" className="text-xs">
                Tracking this KOL
              </Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} size="sm" className="h-8 text-xs">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove KOL from Tracking</DialogTitle>
            <DialogDescription>
              Are you sure you want to stop tracking this KOL? You can add them
              back to your tracking list later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              size="sm"
              className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
