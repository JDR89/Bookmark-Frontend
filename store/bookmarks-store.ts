import { create } from "zustand";
import { bookmarks as initialBookmarks, collections as initialCollections, workspaces as initialWorkspaces, type Bookmark, type Collection, type Workspace } from "@/mock-data/bookmarks";
import { persist } from "zustand/middleware";

type ViewMode = "grid" | "list";
type SortBy = "date-newest" | "date-oldest" | "alpha-az" | "alpha-za";
type FilterType = "all" | "favorites";

interface BookmarksState {
  authStatus: "guest" | "authenticated";
  token: string | null;
  bookmarks: Bookmark[];
  collections: Collection[];
  workspaces: Workspace[];
  selectedWorkspace: string;
  selectedCollection: string;
  searchQuery: string;
  viewMode: ViewMode;
  sortBy: SortBy;
  filterType: FilterType;

  login: (token: string) => void;
  logout: () => void;
  setSelectedWorkspace: (workspaceId: string) => void;
  setSelectedCollection: (collectionId: string) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortBy) => void;
  setFilterType: (filter: FilterType) => void;
  toggleFavorite: (bookmarkId: string) => void;
  archiveBookmark: (bookmarkId: string) => void;
  restoreFromArchive: (bookmarkId: string) => void;
  trashBookmark: (bookmarkId: string) => void;
  restoreFromTrash: (bookmarkId: string) => void;
  permanentlyDelete: (bookmarkId: string) => void;
  getFilteredBookmarks: () => Bookmark[];
  getFavoriteBookmarks: () => Bookmark[];
  getArchivedBookmarks: () => Bookmark[];
  getTrashedBookmarks: () => Bookmark[];
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  addBookmark: (bookmark: { title: string; url: string; collectionId?: string; description?: string; icon?: string }) => void;
  addCollection: (collection: { name: string; workspaceId: string; icon?: string }) => void;
  addWorkspace: (workspace: { name: string; color: string }) => void;
  deleteWorkspace: (workspaceId: string) => void;
  deleteCollection: (collectionId: string) => void;
}



export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      authStatus: "guest",
      token: null,

      bookmarks: initialBookmarks,
      collections: initialCollections,
      workspaces: initialWorkspaces,

      selectedWorkspace: "personal",
      selectedCollection: "all",
      searchQuery: "",
      viewMode: "grid",
      sortBy: "date-newest",
      filterType: "all",

      login: (token) => set({ authStatus: "authenticated", token }),
      logout: () => set({ authStatus: "guest", token: null }),

      setSelectedWorkspace: (workspaceId) =>
        set({ selectedWorkspace: workspaceId, selectedCollection: "all" }),

      setSelectedCollection: (collectionId) => set({ selectedCollection: collectionId }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setSortBy: (sort) => set({ sortBy: sort }),

      setFilterType: (filter) => set({ filterType: filter }),

      toggleFavorite: (bookmarkId) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((bookmark) =>
            bookmark.id === bookmarkId
              ? { ...bookmark, isFavorite: !bookmark.isFavorite }
              : bookmark
          ),
        })),

      archiveBookmark: (bookmarkId) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === bookmarkId ? { ...b, status: "archived" } : b
          ),
        })),

      restoreFromArchive: (bookmarkId) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === bookmarkId ? { ...b, status: "active" } : b
          ),
        })),

      trashBookmark: (bookmarkId) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === bookmarkId ? { ...b, status: "trashed" } : b
          ),
        })),

      restoreFromTrash: (bookmarkId) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === bookmarkId ? { ...b, status: "active" } : b
          ),
        })),

      permanentlyDelete: (bookmarkId) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId),
        })),

      updateBookmark: (id, updates) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      getFilteredBookmarks: () => {
        const state = get();
        // Only show active bookmarks in the main view
        let filtered = state.bookmarks.filter((b) => b.status === "active");

        // 1. Filter by Workspace first
        const workspaceCollectionIds = state.collections
          .filter((c) => c.workspaceId === state.selectedWorkspace)
          .map((c) => c.id);

        // If 'all' is selected, we show bookmarks from ANY collection in this workspace
        if (state.selectedCollection === "all") {
          filtered = filtered.filter((b) => workspaceCollectionIds.includes(b.collectionId));
        } else {
          // If a specific collection is selected, just filter by that
          filtered = filtered.filter((b) => b.collectionId === state.selectedCollection);
        }


        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (b) =>
              b.title.toLowerCase().includes(query) ||
              b.description.toLowerCase().includes(query) ||
              b.url.toLowerCase().includes(query)
          );
        }

        switch (state.filterType) {
          case "favorites":
            filtered = filtered.filter((b) => b.isFavorite);
            break;
        }

        switch (state.sortBy) {
          case "date-newest":
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case "date-oldest":
            filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case "alpha-az":
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case "alpha-za":
            filtered.sort((a, b) => b.title.localeCompare(a.title));
            break;
        }

        return filtered;
      },

      getFavoriteBookmarks: () => {
        const state = get();

        // Get collections for the current workspace
        const workspaceCollectionIds = state.collections
          .filter((c) => c.workspaceId === state.selectedWorkspace)
          .map((c) => c.id);

        // Filter bookmarks: favorites AND belong to a collection in current workspace AND are active
        let filtered = state.bookmarks.filter(
          (b) => b.isFavorite && workspaceCollectionIds.includes(b.collectionId) && b.status === "active"
        );

        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (b) =>
              b.title.toLowerCase().includes(query) ||
              b.description.toLowerCase().includes(query) ||
              b.url.toLowerCase().includes(query)
          );
        }

        switch (state.sortBy) {
          case "date-newest":
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case "date-oldest":
            filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case "alpha-az":
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case "alpha-za":
            filtered.sort((a, b) => b.title.localeCompare(a.title));
            break;
        }

        return filtered;
      },

      getArchivedBookmarks: () => {
        const state = get();
        let filtered = state.bookmarks.filter((b) => b.status === "archived");

        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (b) =>
              b.title.toLowerCase().includes(query) ||
              b.description.toLowerCase().includes(query) ||
              b.url.toLowerCase().includes(query)
          );
        }

        return filtered;
      },

      getTrashedBookmarks: () => {
        const state = get();
        let filtered = state.bookmarks.filter((b) => b.status === "trashed");

        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (b) =>
              b.title.toLowerCase().includes(query) ||
              b.description.toLowerCase().includes(query) ||
              b.url.toLowerCase().includes(query)
          );
        }

        return filtered;
      },

      addBookmark: ({ title, url, collectionId, description, icon }) =>
        set((state) => {
          const newBookmark: Bookmark = {
            id: Math.random().toString(36).substring(2, 15),
            title,
            url,
            description: description || "", // Si no hay descripción, string vacío
            favicon: icon || "link", // Default a "link" si no se proporciona
            collectionId: collectionId || (state.selectedCollection === "all" ? "reading" : state.selectedCollection),
            createdAt: new Date().toISOString().split("T")[0],
            isFavorite: false,
            hasDarkIcon: false,
            status: "active",
          };

          return { bookmarks: [newBookmark, ...state.bookmarks] };
        }),

      addCollection: ({ name, workspaceId, icon }) =>
        set((state) => {
          const newCollection: Collection = {
            id: name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6),
            workspaceId,
            name,
            icon: icon || "folder",
          };
          return { collections: [...state.collections, newCollection] };
        }),

      addWorkspace: ({ name, color }) =>
        set((state) => {
          if (state.workspaces.length >= 5) return state;

          const newWorkspace: Workspace = {
            id: name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6),
            name,
            icon: "briefcase", // Default icon
            color: color,
            orderIndex: state.workspaces.length,
          };


          return {
            workspaces: [...state.workspaces, newWorkspace],
            selectedWorkspace: newWorkspace.id,
            selectedCollection: "all"
          };
        }),

      deleteWorkspace: (workspaceId) =>
        set((state) => {
          // Prevent deleting the last workspace
          if (state.workspaces.length <= 1) return state;

          const collectionIds = state.collections
            .filter((c) => c.workspaceId === workspaceId)
            .map((c) => c.id);

          const remainingWorkspaces = state.workspaces.filter((w) => w.id !== workspaceId);

          return {
            workspaces: remainingWorkspaces,
            collections: state.collections.filter((c) => c.workspaceId !== workspaceId),
            bookmarks: state.bookmarks.filter((b) => !collectionIds.includes(b.collectionId)),
            selectedWorkspace: state.selectedWorkspace === workspaceId
              ? remainingWorkspaces[0].id
              : state.selectedWorkspace,
            selectedCollection: state.selectedWorkspace === workspaceId ? "all" : state.selectedCollection,
          };
        }),

      deleteCollection: (collectionId) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== collectionId),
          bookmarks: state.bookmarks.filter((b) => b.collectionId !== collectionId),
          selectedCollection: "all",
        })),
    }),
    {
      name: "bookmarks-storage", // name of the item in the storage (must be unique)
    }
  )
);
