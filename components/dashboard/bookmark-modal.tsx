"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Link, Code, Book, Image as ImageIcon, Briefcase, Sparkles, Star } from "lucide-react";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { type Bookmark } from "@/mock-data/bookmarks";


// 1. Definir el esquema de validación
const formSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    url: z.url("Introduce una URL válida"),
    description: z.string().optional(),
    icon: z.string().optional(),
    collectionId: z.string().min(1, "Selecciona una colección"),
});

export function BookmarkModal({ children, bookmarkToEdit }: { children?: React.ReactNode; bookmarkToEdit?: Bookmark }) {
    const [open, setOpen] = useState(false);

    const addBookmark = useBookmarksStore((state) => state.addBookmark);
    const updateBookmark = useBookmarksStore((state) => state.updateBookmark);
    const selectedCollection = useBookmarksStore((state) => state.selectedCollection);
    const selectedWorkspace = useBookmarksStore((state) => state.selectedWorkspace);
    const collections = useBookmarksStore((state) => state.collections);

    // Filtrar colecciones por el workspace actual
    // Filtrar colecciones por el workspace actual
    const workspaceCollections = useMemo(() => collections.filter(
        (c) => c.workspaceId === selectedWorkspace
    ), [collections, selectedWorkspace]);

    const icons = [
        { name: "sparkles", icon: Sparkles },
        { name: "star", icon: Star },
        { name: "link", icon: Link },
        { name: "code", icon: Code },
        { name: "book", icon: Book },
        { name: "image", icon: ImageIcon },
        { name: "briefcase", icon: Briefcase },
    ];

    // 2. Definir el formulario

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: bookmarkToEdit?.title || "",
            url: bookmarkToEdit?.url || "",
            description: bookmarkToEdit?.description || "",
            icon: bookmarkToEdit?.favicon && !bookmarkToEdit.favicon.startsWith("http") ? bookmarkToEdit.favicon : "link",
            collectionId: bookmarkToEdit?.collectionId || (selectedCollection === "all" ? "" : selectedCollection),
        },
    });

    useEffect(() => {
        if (open) {
            let defaultCollectionId = "";

            if (bookmarkToEdit) {
                defaultCollectionId = bookmarkToEdit.collectionId;
            } else if (selectedCollection !== "all" && workspaceCollections.some(c => c.id === selectedCollection)) {
                defaultCollectionId = selectedCollection;
            } else if (workspaceCollections.length > 0) {
                defaultCollectionId = workspaceCollections[0].id; // Default to first collection
            }

            form.reset({
                name: bookmarkToEdit?.title || "",
                url: bookmarkToEdit?.url || "",
                description: bookmarkToEdit?.description || "",
                icon: bookmarkToEdit?.favicon && !bookmarkToEdit.favicon.startsWith("http") ? bookmarkToEdit.favicon : "link",
                collectionId: defaultCollectionId,
            });
        }
    }, [open, bookmarkToEdit, selectedCollection, workspaceCollections, form]);

    // 3. Manejador de envío

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (bookmarkToEdit) {
            updateBookmark(bookmarkToEdit.id, {
                title: values.name,
                url: values.url,
                collectionId: values.collectionId,
                description: values.description,
                favicon: values.icon,
            });
        } else {
            addBookmark({
                title: values.name,
                url: values.url,
                collectionId: values.collectionId,
                description: values.description,
                icon: values.icon,
            });
        }

        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button size="sm" className="hidden sm:flex gap-2">
                        <Plus className="size-4" />
                        Add Bookmark
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-[425px]"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>{bookmarkToEdit ? "Edit Bookmark" : "Add New Bookmark"}</DialogTitle>
                    <DialogDescription>
                        {bookmarkToEdit ? "Make changes to your bookmark here." : "Enter the details of the website you want to save."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Campo: Nombre */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Eje: Reading list" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo: URL */}
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Descripción */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Breve descripción..." {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Icono */}
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <div className="flex gap-2">
                                        {icons.map((item) => {
                                            const IconComponent = item.icon;
                                            return (
                                                <div
                                                    key={item.name}
                                                    onClick={() => field.onChange(item.name)}
                                                    className={`
                                                        p-2 rounded-md cursor-pointer border hover:bg-accent
                                                        ${field.value === item.name ? "bg-accent border-primary ring-1 ring-primary" : "border-border"}
                                                    `}
                                                >
                                                    <IconComponent className="size-5" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Colección (Select) */}
                        <FormField
                            control={form.control}
                            name="collectionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Collection</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a collection" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {workspaceCollections.map((collection) => (
                                                <SelectItem key={collection.id} value={collection.id}>
                                                    {collection.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit">{bookmarkToEdit ? "Save Changes" : "Save Bookmark"}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}