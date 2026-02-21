import Link from "next/link";
import { Zap, Globe } from "lucide-react";
import { LoginForm } from "./login-form";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-32 lg:pb-24 overflow-hidden px-6">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                {/* Contenido Izquierdo */}
                <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-300 mb-8 mt-4 lg:mt-0">
                        <Zap className="size-4 text-blue-500" />
                        <span>Fast, organized, effortless</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                        Your bookmarks, <br className="hidden lg:block" />
                        <span className="text-blue-500">perfectly organized</span>
                    </h1>

                    <p className="text-lg lg:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto lg:mx-0">
                        Save, tag, and find any link in seconds. Bookmarks gives you a lightning-fast way to manage the web pages that matter most.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
                        <Link
                            href="/bookmarks"
                            className=" flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-center transition-colors"
                        >
                            <Globe className="size-5" />
                            Try as Guest
                        </Link>
                    </div>


                </div>

                {/* Formulario Derecho */}
                <div className="flex-1 flex justify-center lg:justify-end w-full">
                    <LoginForm />
                </div>
            </div>
        </section>
    );
}
