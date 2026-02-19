"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { workspaceColors } from "@/components/dashboard/create-workspace-modal";
import { cn } from "@/lib/utils";

interface WorkspaceSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function WorkspaceSettingsModal({ open, onOpenChange }: WorkspaceSettingsModalProps) {
    const workspaces = useBookmarksStore((state) => state.workspaces);
    const collections = useBookmarksStore((state) => state.collections);
    const bookmarks = useBookmarksStore((state) => state.bookmarks);
    const deleteWorkspace = useBookmarksStore((state) => state.deleteWorkspace);
    const selectedWorkspace = useBookmarksStore((state) => state.selectedWorkspace);

    const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(null);

    const workspaceToDeleteObj = workspaces.find((w) => w.id === workspaceToDelete);

    const getWorkspaceStats = (workspaceId: string) => {
        const wsCollections = collections.filter((c) => c.workspaceId === workspaceId);
        const collectionIds = wsCollections.map((c) => c.id);
        const wsBookmarks = bookmarks.filter((b) => collectionIds.includes(b.collectionId));
        return { collections: wsCollections.length, bookmarks: wsBookmarks.length };
    };

    const handleDelete = () => {
        if (workspaceToDelete) {
            deleteWorkspace(workspaceToDelete);
            setWorkspaceToDelete(null);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Workspace Settings</DialogTitle>
                        <DialogDescription>
                            Manage your workspaces. You can have up to 5 workspaces.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 pt-2">
                        {workspaces.map((workspace) => {
                            const stats = getWorkspaceStats(workspace.id);
                            const colorClass = workspaceColors.find((c) => c.id === workspace.color)?.class || workspaceColors[0].class;
                            const isActive = selectedWorkspace === workspace.id;
                            const isLastWorkspace = workspaces.length <= 1;

                            return (
                                <div
                                    key={workspace.id}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                                        isActive && "border-primary/30 bg-accent/50"
                                    )}
                                >
                                    {/* Color sphere */}
                                    <div
                                        className={cn(
                                            "size-9 shrink-0 rounded-full shadow-sm",
                                            colorClass
                                        )}
                                    />

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium truncate">
                                                {workspace.name}
                                            </span>
                                            {isActive && (
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {stats.collections} collections · {stats.bookmarks} bookmarks
                                        </p>
                                    </div>

                                    {/* Delete button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "shrink-0 size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                                            isLastWorkspace && "opacity-30 pointer-events-none"
                                        )}
                                        onClick={() => setWorkspaceToDelete(workspace.id)}
                                        disabled={isLastWorkspace}
                                        title={isLastWorkspace ? "You must have at least one workspace" : "Delete workspace"}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    {workspaces.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-6">
                            No workspaces found.
                        </p>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirmation dialog */}
            <AlertDialog open={!!workspaceToDelete} onOpenChange={(open) => !open && setWorkspaceToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete &quot;{workspaceToDeleteObj?.name}&quot;?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. All collections and bookmarks
                            inside this workspace will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
