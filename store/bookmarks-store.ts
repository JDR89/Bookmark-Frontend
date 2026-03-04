import { create } from "zustand";
import { bookmarks as initialBookmarks, collections as initialCollections, workspaces as initialWorkspaces, type Bookmark, type Collection, type Workspace } from "@/mock-data/bookmarks";
import { persist, devtools } from "zustand/middleware";
import { api } from "@/lib/api";

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
  addCollection: (collection: { name: string; workspaceId: string; icon?: string }) => Promise<void>;
  addWorkspace: (workspace: { name: string; color: string }) => Promise<void>;
  deleteWorkspace: (workspaceId: string) => void;
  deleteCollection: (collectionId: string) => void;
  fetchUserData: () => Promise<void>;
}



export const useBookmarksStore = create<BookmarksState>()(
  devtools(
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
        logout: () => set({
          authStatus: "guest",
          token: null,
          bookmarks: initialBookmarks,      // Restaura la data de prueba
          collections: initialCollections,  // Restaura la data de prueba
          workspaces: initialWorkspaces,    // Restaura la data de prueba
          selectedWorkspace: initialWorkspaces[0]?.id || "personal", // Resetea la selección
          selectedCollection: "all"
        }),
        // Traerme la data luego de la autenticacion
        fetchUserData: async () => {
          const state = get();
          if (state.authStatus !== "authenticated") return; // Solo si estamos logueados
          try {

            const { data } = await api.get("/workspaces");
            // Necesitamos aplanar (flatten) esta estructura para que encaje en Zustand

            const fetchedWorkspaces: Workspace[] = [];
            const fetchedCollections: Collection[] = [];
            const fetchedBookmarks: Bookmark[] = [];
            // Aplanar la respuesta de TypeORM
            data.forEach((ws: any) => {
              fetchedWorkspaces.push({ id: ws.id, name: ws.name, color: ws.color, icon: ws.icon, orderIndex: ws.orderIndex });
              if (ws.collections) {
                ws.collections.forEach((col: any) => {
                  fetchedCollections.push({ id: col.id, name: col.name, icon: col.icon, workspaceId: ws.id });
                  if (col.bookmarks) {
                    col.bookmarks.forEach((bk: any) => {
                      fetchedBookmarks.push({
                        id: bk.id,
                        title: bk.title,
                        url: bk.url,
                        description: bk.description || "",
                        favicon: bk.icon || "link",
                        collectionId: col.id,
                        createdAt: bk.createdAt || new Date().toISOString(),
                        isFavorite: bk.isFavorite || false,
                        hasDarkIcon: false,
                        status: "active"
                      });
                    });
                  }
                });
              }
            });
            // Actualizar Zustand con la data fresca del backend
            set({
              workspaces: fetchedWorkspaces,
              collections: fetchedCollections,
              bookmarks: fetchedBookmarks,
              selectedWorkspace: fetchedWorkspaces.length > 0 ? fetchedWorkspaces[0].id : state.selectedWorkspace
            });
          } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
          }
        },

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

        addCollection: async ({ name, workspaceId, icon }) => {
          const state = get();

          if (state.authStatus === "authenticated") {
            try {
              // Hacemos el POST al Backend API
              const { data } = await api.post("/collections", {
                name,
                workspaceId,
                icon: icon || "folder"
              });

              set({
                // Sumamos la Colección devuelta por Postgres, pero inyectándole
                // el workspaceId que ya conocíamos y aplanando la estructura.
                collections: [
                  ...state.collections,
                  {
                    id: data.id,
                    name: data.name,
                    icon: data.icon,
                    workspaceId: workspaceId // <- El secreto de la reactividad
                  }
                ],
                selectedCollection: data.id
              });
            } catch (error) {
              console.error("Error creating collection:", error);
            }
          }
          else {
            // Lógica Local (Guest)
            const newCollection: Collection = {
              id: "col-" + Math.random().toString(36).substring(2, 9),
              name,
              icon: icon || "folder",
              workspaceId,
            };

            set({
              collections: [...state.collections, newCollection],
              selectedCollection: newCollection.id
            });
          }
        },

        addWorkspace: async ({ name, color }) => {
          const state = get(); // Obtener el estado actual
          if (state.workspaces.length >= 5) return;
          // Si está AUTENTICADO -> BACKEND
          if (state.authStatus === "authenticated") {
            try {
              // Enviar POST al Backend a la ruta configurada en el Controller (/workspaces)
              const response = await api.post("/workspaces", { name, color });
              // Setear en Zustand usando el Workspace real guardado (que traerá su UUID de Postgres)
              set({
                workspaces: [...state.workspaces, response.data],
                selectedWorkspace: response.data.id,
                selectedCollection: "all"
              });
            } catch (error) {
              console.error("Error creating workspace:", error);
              // Opcional: Mostrar Toast de error aquí
            }
          }
          // Si es INVITADO -> LOCALSTORAGE
          else {
            const newWorkspace: Workspace = {
              id: name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6),
              name,
              icon: "briefcase",
              color: color,
              orderIndex: state.workspaces.length,
            };
            set({
              workspaces: [...state.workspaces, newWorkspace],
              selectedWorkspace: newWorkspace.id,
              selectedCollection: "all"
            });
          }
        },

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
    ),
    { name: "BookmarksStore" }



  )
);
