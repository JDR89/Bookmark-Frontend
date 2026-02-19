export type Workspace = {
  id: string;
  name: string;
  icon: string;
  orderIndex: number;
  color: string;
};

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  description: string;
  favicon: string;
  collectionId: string;
  createdAt: string;
  isFavorite: boolean;
  hasDarkIcon?: boolean;
  status: BookmarkStatus;
};

export type BookmarkStatus = 'active' | 'archived' | 'trashed';

export type Collection = {
  id: string;
  workspaceId: string;
  name: string;
  icon: string;
};

export const workspaces: Workspace[] = [
  {
    id: "personal",
    name: "Personal",
    icon: "user",
    orderIndex: 0,
    color: "blue",
  },
  {
    id: "work",
    name: "Work",
    icon: "briefcase",
    orderIndex: 1,
    color: "violet",
  },
];

export const collections: Collection[] = [
  {
    id: "design",
    workspaceId: "work",
    name: "Design Resources",
    icon: "palette",

  },
  {
    id: "dev",
    workspaceId: "work",
    name: "Development",
    icon: "code",

  },
  {
    id: "tools",
    workspaceId: "work",
    name: "Tools",
    icon: "wrench",

  },
  {
    id: "reading",
    workspaceId: "personal",
    name: "Reading List",
    icon: "book-open",

  },
  {
    id: "inspiration",
    workspaceId: "personal",
    name: "Inspiration",
    icon: "sparkles",

  },
];

export const bookmarks: Bookmark[] = [
  {
    id: "1",
    title: "Shadcn UI",
    url: "https://ui.shadcn.com",
    description:
      "Beautifully designed components built with Radix UI and Tailwind CSS.",
    favicon: "code",
    collectionId: "dev",
    createdAt: "2024-01-15",
    isFavorite: true,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "2",
    title: "Vercel",
    url: "https://vercel.com",
    description:
      "Develop. Preview. Ship. The best frontend developer experience.",
    favicon: "code",
    collectionId: "dev",
    createdAt: "2024-01-14",
    isFavorite: true,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "3",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description: "A utility-first CSS framework for rapid UI development.",
    favicon: "code",
    collectionId: "dev",
    createdAt: "2024-01-13",
    isFavorite: false,
    status: "active",
  },
  {
    id: "4",
    title: "Figma",
    url: "https://figma.com",
    description: "The collaborative interface design tool.",
    favicon: "image",
    collectionId: "design",
    createdAt: "2024-01-12",
    isFavorite: true,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "5",
    title: "Dribbble",
    url: "https://dribbble.com",
    description: "Discover the world's top designers & creatives.",
    favicon: "image",
    collectionId: "inspiration",
    createdAt: "2024-01-11",
    isFavorite: false,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "6",
    title: "React Documentation",
    url: "https://react.dev",
    description: "The library for web and native user interfaces.",
    favicon: "book",
    collectionId: "dev",
    createdAt: "2024-01-10",
    isFavorite: true,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "7",
    title: "TypeScript Handbook",
    url: "https://typescriptlang.org",
    description: "TypeScript is JavaScript with syntax for types.",
    favicon: "book",
    collectionId: "dev",
    createdAt: "2024-01-09",
    isFavorite: false,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "8",
    title: "Next.js Documentation",
    url: "https://nextjs.org",
    description: "The React Framework for the Web.",
    favicon: "code",
    collectionId: "dev",
    createdAt: "2024-01-08",
    isFavorite: true,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "9",
    title: "Lucide Icons",
    url: "https://lucide.dev",
    description: "Beautiful & consistent icon toolkit made by the community.",
    favicon: "image",
    collectionId: "tools",
    createdAt: "2024-01-07",
    isFavorite: false,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "10",
    title: "Radix UI",
    url: "https://radix-ui.com",
    description: "Unstyled, accessible components for building design systems.",
    favicon: "code",
    collectionId: "dev",
    createdAt: "2024-01-06",
    isFavorite: false,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "11",
    title: "Linear",
    url: "https://linear.app",
    description: "The issue tracking tool you'll enjoy using.",
    favicon: "briefcase",
    collectionId: "tools",
    createdAt: "2024-01-05",
    isFavorite: true,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "12",
    title: "Notion",
    url: "https://notion.so",
    description:
      "The all-in-one workspace for your notes, tasks, wikis, and databases.",
    favicon: "briefcase",
    collectionId: "tools",
    createdAt: "2024-01-04",
    isFavorite: false,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "13",
    title: "Awwwards",
    url: "https://awwwards.com",
    description:
      "The awards of design, creativity and innovation on the internet.",
    favicon: "image",
    collectionId: "inspiration",
    createdAt: "2024-01-03",
    isFavorite: false,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "14",
    title: "Frontend Masters",
    url: "https://frontendmasters.com",
    description: "Advance your skills with in-depth, modern front-end courses.",
    favicon: "book",
    collectionId: "reading",
    createdAt: "2024-01-02",
    isFavorite: false,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "15",
    title: "CSS Tricks",
    url: "https://css-tricks.com",
    description:
      "Daily articles about CSS, HTML, JavaScript, and all things web design.",
    favicon: "book",
    collectionId: "reading",
    createdAt: "2024-01-01",
    isFavorite: false,
    hasDarkIcon: true,
    status: "active",
  },
  {
    id: "16",
    title: "Framer",
    url: "https://framer.com",
    description: "Ship sites with unmatched speed and style.",
    favicon: "image",
    collectionId: "design",
    createdAt: "2023-12-31",
    isFavorite: true,
    hasDarkIcon: true,
    status: "active",
  },
];
