"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, Briefcase } from "lucide-react";

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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Define available colors with their gradient classes
export const workspaceColors = [
    {
        id: "blue",
        class: "bg-linear-to-br from-blue-400 via-indigo-500 to-violet-500",
    },
    {
        id: "emerald",
        class: "bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-500",
    },
    {
        id: "amber",
        class: "bg-linear-to-br from-amber-400 via-orange-500 to-red-500",
    },
    {
        id: "violet",
        class: "bg-linear-to-br from-violet-400 via-fuchsia-500 to-pink-500",
    },
    {
        id: "rose",
        class: "bg-linear-to-br from-rose-400 via-pink-500 to-purple-500",
    },
];

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(12, "Name must be at most 12 characters"),
    color: z.string().min(1, "Please select a color"),
});

interface CreateWorkspaceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceModal({ open, onOpenChange }: CreateWorkspaceModalProps) {
    const addWorkspace = useBookmarksStore((state) => state.addWorkspace);
    const workspaces = useBookmarksStore((state) => state.workspaces);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            color: "blue",
        },
    });

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            form.reset();
        }
    }, [open, form.reset]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formattedName = values.name.charAt(0).toUpperCase() + values.name.slice(1).toLowerCase();

        addWorkspace({
            name: formattedName,
            color: values.color,
        });
        onOpenChange(false);
        form.reset();
    }

    const isLimitReached = workspaces.length >= 5;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>
                        Add a new workspace to organize your collections.
                        {isLimitReached && (
                            <span className="block text-destructive mt-2">
                                You have reached the limit of 5 workspaces.
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>
                {!isLimitReached && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="e.g. Side Hustle"
                                                    className="pl-9"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Color Theme</FormLabel>
                                        <FormControl>
                                            <div className="flex justify-between gap-2">
                                                {workspaceColors.map((color) => (
                                                    <div
                                                        key={color.id}
                                                        className={cn(
                                                            "relative cursor-pointer rounded-full p-0.5 transition-all hover:scale-110",
                                                            field.value === color.id
                                                                ? "ring-2 ring-primary ring-offset-2"
                                                                : "ring-1 ring-transparent hover:ring-border"
                                                        )}
                                                        onClick={() => field.onChange(color.id)}
                                                    >
                                                        <div
                                                            className={cn(
                                                                "size-8 rounded-full shadow-sm",
                                                                color.class
                                                            )}
                                                        />
                                                        {field.value === color.id && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <Check className="size-4 text-white drop-shadow-md" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end pt-2">
                                <Button type="submit">Create Workspace</Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
