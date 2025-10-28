"use client";

import { useState } from "react";
import Image from "next/image";
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
  createKOL,
  updateKOL,
  deleteKOL,
  CreateKOLInput,
} from "@/lib/kolApi";
import { Pencil, Trash2, Plus, Star, StarOff } from "lucide-react";
import { toast } from "sonner";

interface KOLTrackerTableProps {
  kols: KOL[];
  onUpdate: () => void;
}

export default function KOLTrackerTable({
  kols,
  onUpdate,
}: KOLTrackerTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingKOL, setEditingKOL] = useState<KOL | null>(null);
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

  // Handle add KOL
  const handleAdd = async () => {
    try {
      await createKOL(formData);
      toast.success("KOL added successfully");
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

  // Handle delete KOL
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this KOL?")) return;

    try {
      await deleteKOL(id);
      toast.success("KOL deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete KOL");
      console.error(error);
    }
  };

  // Handle toggle tracking
  const handleToggleTracking = async (kol: KOL) => {
    try {
      await updateKOL(kol.id, { isTracking: !kol.isTracking });
      toast.success(
        kol.isTracking ? "Stopped tracking KOL" : "Started tracking KOL"
      );
      onUpdate();
    } catch (error) {
      toast.error("Failed to update tracking status");
      console.error(error);
    }
  };

  // Open edit dialog
  const openEditDialog = (kol: KOL) => {
    setEditingKOL(kol);
    setFormData({
      name: kol.name,
      username: kol.username,
      platform: kol.platform,
      followers: kol.followers,
      description: kol.description || "",
      avatarUrl: kol.avatarUrl || "",
      isTracking: kol.isTracking,
    });
    setIsEditDialogOpen(true);
  };

  // Open add dialog
  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-3">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full">
          <Input
            placeholder="Search tracked KOLs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 text-xs max-w-xs"
          />
          <Select
            value={filterPlatform}
            onValueChange={(value) =>
              setFilterPlatform(value as Platform | "all")
            }
          >
            <SelectTrigger className="w-full sm:w-[150px] h-8 text-xs">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="twitter">X (Twitter)</SelectItem>
              <SelectItem value="reddit">Reddit</SelectItem>
              <SelectItem value="xiaohongshu">小红书</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={openAddDialog}
          size="sm"
          className="flex items-center gap-1.5 h-8 text-xs w-full sm:w-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Add KOL
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Username</TableHead>
              <TableHead className="text-xs">Platform</TableHead>
              <TableHead className="text-xs">Followers</TableHead>
              <TableHead className="text-xs hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKOLs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-xs text-gray-500 dark:text-white/50">
                    {kols.length === 0
                      ? "No tracked KOLs yet. Add KOLs from the Top Ranking table or click 'Add KOL' button."
                      : "No KOLs match your search criteria."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredKOLs.map((kol) => (
                <TableRow key={kol.id}>
                  <TableCell className="text-xs font-medium">
                    {kol.name}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600 dark:text-white/60">
                    {kol.username}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Image
                        src={platformConfig[kol.platform].icon}
                        alt={platformConfig[kol.platform].name}
                        width={16}
                        height={16}
                        className="opacity-70"
                      />
                      <span className="text-xs">
                        {platformConfig[kol.platform].name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatFollowers(kol.followers)}
                  </TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate hidden md:table-cell">
                    {kol.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => openEditDialog(kol)}
                        title="Edit KOL"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleToggleTracking(kol)}
                        className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
                        title="Stop tracking"
                      >
                        <Star className="w-3.5 h-3.5 fill-yellow-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleDelete(kol.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        title="Delete KOL"
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

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New KOL</DialogTitle>
            <DialogDescription>
              Add a new KOL to track their content and updates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter KOL name"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs">
                Username *
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="@username or u/username"
                className="h-8 text-xs"
              />
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
                  <SelectItem value="xiaohongshu">小红书</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="followers" className="text-xs">
                Followers
              </Label>
              <Input
                id="followers"
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
              <Label htmlFor="description" className="text-xs">
                Description
              </Label>
              <Input
                id="description"
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
                id="tracking"
                checked={formData.isTracking}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isTracking: checked })
                }
              />
              <Label htmlFor="tracking" className="text-xs">
                Start tracking immediately
              </Label>
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
            <Button onClick={handleAdd} size="sm" className="h-8 text-xs">
              Add KOL
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
                placeholder="@username or u/username"
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
                  <SelectItem value="xiaohongshu">小红书</SelectItem>
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
    </div>
  );
}
