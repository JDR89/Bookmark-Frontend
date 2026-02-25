import { BookmarksSidebar } from "@/components/dashboard/sidebar";
import { BookmarksHeader } from "@/components/dashboard/header";
import { BookmarksContent } from "@/components/dashboard/content";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { GoogleAuthHandler } from "@/components/dashboard/google-auth-handler";

export default function BookmarksPage() {

    return (
        <SidebarProvider className="bg-sidebar">
            <BookmarksSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
                <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
                    <BookmarksHeader />
                    <BookmarksContent />

                    <Suspense fallback={null}>
                        <GoogleAuthHandler />
                    </Suspense>
                </div>
            </div>
        </SidebarProvider>
    );
}
