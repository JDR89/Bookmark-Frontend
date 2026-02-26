import Link from "next/link"

export const LoginButtonSidebar = () => {
    return (
        <Link href="/">
            <button
                type="button"
                className="flex items-center justify-center w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium  transition-colors duration-200 active:scale-95"
            >
                <span className="text-sm uppercase tracking-wider">
                    Login
                </span>
            </button>
        </Link>
    )
}