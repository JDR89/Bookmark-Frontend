"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Link, Code, Book, Image as ImageIcon, Briefcase } from "lucide-react";

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
import { collections } from "@/mock-data/bookmarks";


// 1. Definir el esquema de validación
const formSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    url: z.string().url("Introduce una URL válida"),
    description: z.string().optional(),
    icon: z.string().optional(),
    collectionId: z.string().min(1, "Selecciona una colección"),
});

export function AddBookmarkModal() {
    const [open, setOpen] = useState(false);


    const addBookmark = useBookmarksStore((state) => state.addBookmark);
    const selectedCollection = useBookmarksStore((state) => state.selectedCollection);
    const selectedWorkspace = useBookmarksStore((state) => state.selectedWorkspace);

    // Filtrar colecciones por el workspace actual
    const workspaceCollections = collections.filter(
        (c) => c.workspaceId === selectedWorkspace
    );

    const icons = [
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
            name: "",
            url: "",
            description: "",
            icon: "link",
            collectionId: selectedCollection === "all" ? "" : selectedCollection,
        },
    });

    // 3. Manejador de envío
    function onSubmit(values: z.infer<typeof formSchema>) {
        addBookmark({
            title: values.name,
            url: values.url,
            collectionId: values.collectionId,
            description: values.description,
            icon: values.icon,
        });

        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="hidden sm:flex gap-2">
                    <Plus className="size-4" />
                    Add Bookmark
                </Button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-[425px]"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Add New Bookmark</DialogTitle>
                    <DialogDescription>
                        Enter the details of the website you want to save.
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
                            <Button type="submit">Save Bookmark</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}