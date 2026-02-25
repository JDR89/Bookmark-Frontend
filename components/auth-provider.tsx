"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useBookmarksStore } from "@/store/bookmarks-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { authStatus, token, login, logout } = useBookmarksStore((state) => state);
    const [isRefreshing, setIsRefreshing] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Redirección instantánea si está logueado y entra al landing
        if (authStatus === "authenticated" && pathname === "/") {
            router.replace("/bookmarks");
        }
    }, [authStatus, pathname, router]);

    useEffect(() => {
        const checkAndRefreshToken = async () => {
            // Ponemos un log acá para ver si la función al menos "se despierta"
            console.log("🔍 Estado actual antes de pedir refresh:", authStatus);
            if (authStatus !== "authenticated" || !token) {
                setIsRefreshing(false);
                return;
            }
            try {
                console.log("🔄 Enviando petición a NestJS...");
                const { data } = await api.get("/auth/check-status");
                console.log("✅ Token nuevo recibido");
                login(data.token);
            } catch (error) {
                console.error("❌ Falló la renovación:", error);
                logout();
            } finally {
                setIsRefreshing(false);
            }
        };
        checkAndRefreshToken();

        // CAMBIO IMPORTANTE: Agregamos [authStatus] a las dependencias
        // para que si pasa de guest a authenticated después de hidratarse, se dispare.
    }, [authStatus]);
    // Opcional: Podrías mostrar una pantalla en blanco o un spinner ultra sutil 
    // mientras esto verifica (suele tardar menos de 20ms).
    if (isRefreshing && authStatus === "authenticated") {
        return null; // O un <LoadingScreen /> si tuvieras uno.
    }

    return <>{children}</>;
}
