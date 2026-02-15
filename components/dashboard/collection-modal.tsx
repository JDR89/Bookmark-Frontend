"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Plus,
    Folder,
    BookOpen,
    Sparkles,
    Star,
    Link,
    Code,
    Image as ImageIcon,
    Briefcase,
    Palette,
    Wrench,
    Bookmark
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBookmarksStore } from "@/store/bookmarks-store";

// 1. Validation Schema
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    icon: z.string().optional(),
});

export function CollectionModal({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    const addCollection = useBookmarksStore((state) => state.addCollection);
    const selectedWorkspace = useBookmarksStore((state) => state.selectedWorkspace);

    const icons = [
        { name: "folder", icon: Folder },
        { name: "book-open", icon: BookOpen },
        { name: "sparkles", icon: Sparkles },
        { name: "star", icon: Star },
        { name: "code", icon: Code },
        { name: "palette", icon: Palette },
        { name: "wrench", icon: Wrench },
        { name: "bookmark", icon: Bookmark },
        { name: "briefcase", icon: Briefcase },
        { name: "image", icon: ImageIcon },
        { name: "link", icon: Link },
    ];

    // 2. Form Definition
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            icon: "folder",
        },
    });

    // 3. Submit Handler
    function onSubmit(values: z.infer<typeof formSchema>) {
        addCollection({
            name: values.name,
            workspaceId: selectedWorkspace,
            icon: values.icon,
        });

        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button size="sm" variant="ghost" className="w-full cursor-pointer justify-start gap-2 px-2">
                        <Plus className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">New Collection</span>
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Collection</DialogTitle>
                    <DialogDescription>
                        Add a new collection to your {selectedWorkspace} workspace.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Folder className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                            <Input
                                                placeholder="e.g. Project Resources"
                                                className="pl-9"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Icon Selection */}
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <div className="flex flex-wrap gap-2">
                                        {icons.map((item) => {
                                            const IconComponent = item.icon;
                                            return (
                                                <div
                                                    key={item.name}
                                                    onClick={() => field.onChange(item.name)}
                                                    className={`
                                                        p-2 rounded-md cursor-pointer border hover:bg-accent transition-colors
                                                        ${field.value === item.name ? "bg-accent border-primary ring-1 ring-primary" : "border-border"}
                                                    `}
                                                    title={item.name}
                                                >
                                                    <IconComponent className="size-4" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit">Create Collection</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
