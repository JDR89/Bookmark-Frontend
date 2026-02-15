"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  ChevronDown,
  ChevronRight,
  Settings,
  Plus,
  Check,
  User,
  LogOut,
  Folder,
  Star,
  Code,
  Palette,
  Wrench,
  BookOpen,
  Sparkles,
  Archive,
  Trash2,
  Briefcase,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { workspaces } from "@/mock-data/bookmarks";
import { CollectionModal } from "@/components/dashboard/collection-modal";

const collectionIcons: Record<string, React.ElementType> = {
  bookmark: Bookmark,
  palette: Palette,
  code: Code,
  wrench: Wrench,
  "book-open": BookOpen,
  sparkles: Sparkles,
  star: Star,
  briefcase: Briefcase,
  image: ImageIcon,
  link: LinkIcon,
};

const navItems = [
  { icon: Star, label: "Favorites", href: "/favorites" },
  { icon: Archive, label: "Archive", href: "/archive" },
  { icon: Trash2, label: "Trash", href: "/trash" },
];

export function BookmarksSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [collectionsOpen, setCollectionsOpen] = React.useState(true);
  const {
    selectedCollection,
    setSelectedCollection,
    selectedWorkspace,
    setSelectedWorkspace,
    collections,
    bookmarks,
  } = useBookmarksStore();

  const isHomePage = pathname === "/";

  // Find current workspace object for display
  const currentWorkspace = workspaces.find(w => w.id === selectedWorkspace) || workspaces[0];

  // Filter collections by current workspace
  const workspaceCollections = collections.filter(
    (c) => c.workspaceId === selectedWorkspace
  );

  return (
    <Sidebar collapsible="offcanvas" className="lg:border-r-0!" {...props}>
      <SidebarHeader className="p-5 pb-0">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
              <div className="size-7 rounded-full overflow-hidden bg-linear-to-br from-blue-400 via-indigo-500 to-violet-500 flex items-center justify-center ring-1 ring-white/40 shadow-lg" />
              <span className="font-medium text-muted-foreground">
                {currentWorkspace.name}
              </span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
                Workspaces
              </DropdownMenuLabel>
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => setSelectedWorkspace(workspace.id)}
                >
                  <div className="size-5 rounded-full bg-linear-to-br from-blue-400 via-indigo-500 to-violet-500 mr-2" />
                  {workspace.name}
                  {selectedWorkspace === workspace.id && (
                    <Check className="size-4 ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Plus className="size-4 mr-2" />
                Create Workspace
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <User className="size-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4 mr-2" />
                Workspace Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-destructive">
                <LogOut className="size-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Avatar className="size-6.5">
            <AvatarImage src="/ln.png" />
            <AvatarFallback>LN</AvatarFallback>
          </Avatar>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-5 pt-5">


        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="flex items-center gap-1.5 px-0 text-[10px] font-semibold tracking-wider text-muted-foreground">
            <button
              onClick={() => setCollectionsOpen(!collectionsOpen)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform",
                  !collectionsOpen && "-rotate-90"
                )}
              />
              COLLECTIONS
            </button>
          </SidebarGroupLabel>
          {collectionsOpen && (
            <SidebarGroupContent>
              <SidebarMenu className="mt-2">
                {/* Special "All Bookmarks" Item logic */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isHomePage && selectedCollection === "all"}
                    className="h-[38px]"
                  >
                    <Link
                      href="/"
                      onClick={() => setSelectedCollection("all")}
                    >
                      <Bookmark className="size-5" />
                      <span className="flex-1">All Bookmarks</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Filtered Collections List */}
                {workspaceCollections.map((collection) => {
                  const IconComponent =
                    collectionIcons[collection.icon] || Folder;
                  const isActive =
                    isHomePage && selectedCollection === collection.id;
                  const count = bookmarks.filter(
                    (b) => b.collectionId === collection.id
                  ).length;
                  return (
                    <SidebarMenuItem key={collection.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="h-[38px]"
                      >
                        <Link
                          href="/"
                          onClick={() => {
                            setSelectedCollection(collection.id);
                          }}
                        >
                          <IconComponent className="size-5" />
                          <span className="flex-1">{collection.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {count}
                          </span>
                          {isActive && (
                            <ChevronRight className="size-4 text-muted-foreground opacity-60" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                <SidebarMenuItem >
                  <CollectionModal />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="h-[38px]"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* <SidebarFooter className="px-5 pb-5">

      </SidebarFooter> */}
    </Sidebar>
  );
}
