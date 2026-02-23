import Link from "next/link";
import { Bookmark } from "lucide-react";
import { RegisterForm } from "@/components/landing/register-form";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] selection:bg-blue-500/30 flex flex-col items-center justify-center px-6 py-12">

            <Link href="/" className="flex flex-col items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
                <Bookmark className="size-10 text-blue-500" />
                <span className="text-2xl font-bold text-white tracking-tight">Bookmarks</span>
            </Link>

            <RegisterForm />

        </div>
    );
}
