"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PostList from "@/components/PostList";

export default function Dashboard() {
  return (
    <DashboardLayout title="Home">
      <div className="flex-1 gap-2 p-2 overflow-hidden">
        <PostList />
      </div>
    </DashboardLayout>
  );
}
