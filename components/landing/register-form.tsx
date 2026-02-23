"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { api } from "@/lib/api";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// 1. Esquema de Validación Zod
const formSchema = z.object({
    email: z.string().email({
        message: "Ingresa un email válido.",
    }),
    password: z.string().min(6, {
        message: "La contraseña debe tener al menos 6 caracteres.",
    }),
    fullName: z.string().optional(), // El backend permite registrarse solo con email/pass
});

export function RegisterForm() {
    const router = useRouter();
    const login = useBookmarksStore((state) => state.login);
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            fullName: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setError("");
        try {
            // El backend recibe fullName, email y password
            const { data } = await api.post("/auth/register", values);
            login(data.token);
            router.push("/bookmarks");
        } catch (err: any) {
            console.error("Register failed:", err);
            setError(err.response?.data?.message || "Error al crear la cuenta");
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
                <p className="text-sm text-zinc-400">Join us to start organizing your web</p>
            </div>

            <Button
                variant="outline"
                className="w-full bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white mb-6 h-11"
            >
                <svg
                    className="mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="20px"
                    height="20px"
                >
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Continue with Google
            </Button>

            <div className="relative flex items-center mb-6">
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-zinc-500 uppercase">Or</span>
                <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg">
                            {error}
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="you@example.com"
                                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-11 focus-visible:ring-blue-500"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white pb-0">Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Create a password"
                                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-11 focus-visible:ring-blue-500"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                                <p className="text-xs text-zinc-500 mt-1">
                                    By signing up, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium h-11 mt-4"
                    >
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-zinc-400 mt-6">
                Already have an account?{" "}
                <Link href="/" className="text-blue-500 hover:text-blue-400">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
