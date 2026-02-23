"use client";

import { useBookmarksStore } from "@/store/bookmarks-store";
import { type Bookmark } from "@/mock-data/bookmarks";
import { BookmarkCard } from "./bookmark-card";
import { StatsCards } from "./stats-cards";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";

import { useStore } from "@/hooks/useStore";

export function BookmarksContent() {
  const setFilterType = useBookmarksStore((state) => state.setFilterType);
  const deleteCollection = useBookmarksStore((state) => state.deleteCollection);

  const store = useStore(useBookmarksStore, (state) => state);

  if (!store) {
    return (
      <div className="flex-1 w-full p-4 md:p-6 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-sm">Loading bookmarks...</p>
      </div>
    );
  }

  const {
    selectedCollection,
    getFilteredBookmarks,
    viewMode,
    filterType,
    sortBy,
    collections,
  } = store;

  const filteredBookmarks = getFilteredBookmarks();

  const currentCollection = collections.find(
    (c) => c.id === selectedCollection
  );

  const hasActiveFilters =
    filterType !== "all" || sortBy !== "date-newest";

  return (
    <div className="flex-1 w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        {selectedCollection === "all" && <StatsCards />}

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">
                {currentCollection?.name || "All Bookmarks"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredBookmarks.length} bookmark
                {filteredBookmarks.length !== 1 ? "s" : ""}
                {hasActiveFilters && " (filtered)"}
              </p>
            </div>

            {filterType !== "all" && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                  {filterType === "favorites" && "Favorites only"}
                  <button
                    onClick={() => setFilterType("all")}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              </div>
            )}
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  variant="list"
                />
              ))}
            </div>
          )}

          {filteredBookmarks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg
                  className="size-6 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-1">No bookmarks found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                Try adjusting your search or filter to find what you&apos;re
                looking for, or add a new bookmark.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterType("all");
                  }}
                >
                  Clear filters
                </Button>
              )}

              {selectedCollection !== "all" && !hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => deleteCollection(selectedCollection)}
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete Collection
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
