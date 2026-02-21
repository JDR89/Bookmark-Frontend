import Link from "next/link";
import { Bookmark } from "lucide-react";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] selection:bg-blue-500/30 flex flex-col items-center justify-center px-6">

            <Link href="/" className="flex flex-col items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
                <Bookmark className="size-10 text-blue-500" />
                <span className="text-2xl font-bold text-white tracking-tight">Bookmarks</span>
            </Link>

            <div className="w-full max-w-md p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Continue with Google</h2>
                    <p className="text-sm text-zinc-400">
                        Enter with Google.
                    </p>
                </div>

                <button className="cursor-pointer w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-2.5 px-4 rounded-lg border border-zinc-800 transition-colors mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    Sign in with Google
                </button>

                <p className="text-center text-sm text-zinc-400 mt-2">
                    Back to <Link href="/" className="text-blue-500 hover:text-blue-400">Login</Link>
                </p>
            </div>
        </div>
    );
}
