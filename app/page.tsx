import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Bookmark } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    // Agregamos un fondo grid sutil y definimos el color de fondo general en negro
    <div className="min-h-screen bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] selection:bg-blue-500/30">

      {/* Navegación Superior */}
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 lg:px-10 z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <Bookmark className="size-6 text-blue-500" />
          <span className="text-lg font-bold text-white tracking-tight">Bookmarks</span>
        </Link>

      </header>

      <main>
        <Hero />
        <div id="features">
          <Features />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-8 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bookmark className="size-5 text-blue-500" />
            <span className="font-semibold text-white">Bookmarks</span>
          </div>
          <p className="text-sm text-zinc-500">
            Built for people who collect too many tabs.
          </p>
        </div>
      </footer>
    </div>
  );
}
