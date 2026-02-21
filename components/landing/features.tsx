import { Bookmark, Folder, Search, Tags, Zap, Globe } from "lucide-react";

const features = [
    {
        icon: Bookmark,
        title: "One-Click Save",
        description: "Save any webpage instantly with our browser extension or share target. No friction, just fast capture."
    },
    {
        icon: Folder,
        title: "Smart Folders",
        description: "Auto-organize links into collections based on topics, domains, or your custom rules."
    },
    {
        icon: Search,
        title: "Instant Search",
        description: "Full-text search across titles, URLs, tags, and even page content. Find anything in milliseconds."
    },
    {
        icon: Tags,
        title: "Flexible Tags",
        description: "Create a personal taxonomy with nested tags. Filter and combine them for powerful discovery."
    },
    {
        icon: Zap,
        title: "Blazing Fast",
        description: "Built for speed. Our interface loads instantly and search results appear as you type."
    },
    {
        icon: Globe,
        title: "Access Anywhere",
        description: "Your bookmarks sync across every device. Browser, mobile, or API — always in reach."
    }
];

export function Features() {
    return (
        <section className="py-24 px-6 border-t border-zinc-900 bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-blue-500 font-semibold tracking-wider text-sm uppercase mb-3">Features</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white max-w-2xl mx-auto">
                        Everything you need to master your bookmarks
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors"
                        >
                            <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                                <feature.icon className="size-5 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
