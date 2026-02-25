"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useBookmarksStore } from "@/store/bookmarks-store";

export function GoogleAuthHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const login = useBookmarksStore((state) => state.login);

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            login(token); // Guardamos en Zustand
            router.replace("/bookmarks"); // Limpiamos la URL para que no quede el token a la vista
        }
    }, [searchParams, login, router]);

    return null;
}
