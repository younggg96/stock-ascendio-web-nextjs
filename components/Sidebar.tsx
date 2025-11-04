"use client";

import Link from "next/link";
import LogoIcon from "./LogoIcon";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  TrendingUp,
  Users,
  Heart,
  Star,
  ChevronDown,
  FolderOpen,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import UserMenu from "./UserMenu";
import { Button } from "./ui/button";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const mainNavItems = [
  {
    icon: LayoutDashboard,
    title: "Home",
    href: "/dashboard",
  },
  {
    icon: TrendingUp,
    title: "Stocks",
    href: "/dashboard/stocks",
  },
];

const collectionItems = [
  {
    icon: Users,
    title: "KOL Tracker",
    href: "/dashboard/kol",
  },
  {
    icon: Heart,
    title: "Liked Posts",
    href: "/dashboard/liked",
  },
  {
    icon: Star,
    title: "Favorite Posts",
    href: "/dashboard/favorites",
  },
];

const bottomNavItems = [
  {
    icon: Settings,
    title: "Settings",
    href: "/dashboard/settings",
  },
];

interface AppSidebarProps {
  onNavigate?: () => void;
}

function AppSidebar({ onNavigate }: AppSidebarProps) {
  const pathname = usePathname();
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);
  const { state, toggleSidebar } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href) && href !== "#";
  };

  return (
    <SidebarPrimitive
      variant="sidebar"
      collapsible="icon"
      className="border-r border-border-light dark:border-border-dark"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full"
            onClick={onNavigate}
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
              <LogoIcon size={20} />
            </div>
            <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-sm">Ascendio</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 rounded-lg hidden lg:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
          >
            {state === "expanded" ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    onClick={onNavigate}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Collections */}
        {state === "expanded" ? (
          <Collapsible
            open={isCollectionsOpen}
            onOpenChange={setIsCollectionsOpen}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex h-9 my-1 w-full items-center justify-between gap-2 overflow-hidden rounded-md p-2 text-xs text-gray-600 dark:text-white/90 outline-none transition-colors hover:bg-gray-200 dark:hover:bg-white/5 [&>svg]:size-4 [&>svg]:shrink-0">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    <span>Collections</span>
                  </div>
                  <ChevronDown
                    className={`transition-transform duration-200 ${
                      isCollectionsOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="flex flex-col !gap-1 pl-2">
                    {collectionItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.href)}
                          onClick={onNavigate}
                        >
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ) : (
          <SidebarGroup className="mt-2">
            <SidebarGroupContent>
              <SidebarMenu>
                {collectionItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      onClick={onNavigate}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Bottom Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    onClick={onNavigate}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu isCollapsed={state === "collapsed"} />
      </SidebarFooter>
    </SidebarPrimitive>
  );
}

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export function SidebarWrapper({ children }: SidebarWrapperProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}

export default AppSidebar;
