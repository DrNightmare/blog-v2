import { open, readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { cache } from "react";

const FRONTMATTER_READ_BYTES = 16_384;

async function parseFrontmatterWithBoundedRead(filePath: string) {
    const fh = await open(filePath, "r");
    try {
        const buf = Buffer.alloc(FRONTMATTER_READ_BYTES);
        const { bytesRead } = await fh.read(buf, 0, FRONTMATTER_READ_BYTES, 0);
        const partial = buf.subarray(0, bytesRead).toString("utf-8");
        const first = partial.indexOf("---");
        if (first === -1) {
            const full = await readFile(filePath, "utf-8");
            return matter(full);
        }
        const second = partial.indexOf("---", first + 3);
        if (second === -1) {
            const full = await readFile(filePath, "utf-8");
            return matter(full);
        }
        return matter(partial);
    } finally {
        await fh.close();
    }
}

async function getMDXFiles(dir: string) {
    const files = await readdir(dir);
    return files.filter((file) => path.extname(file) === '.mdx');
}

export type EssayIndexEntry = {
    slug: string;
    metadata: Record<string, unknown>;
};

export const getEssaysIndex = cache(async (): Promise<EssayIndexEntry[]> => {
    const dir = path.join(process.cwd(), "src", "app", "essays");
    const mdxFiles = await getMDXFiles(dir);
    const results = await Promise.all(
        mdxFiles.map(async (fileName) => {
            const filePath = path.join(dir, fileName);
            const slug = path.basename(fileName, path.extname(fileName));
            const { data: metadata } = await parseFrontmatterWithBoundedRead(filePath);
            return { slug, metadata };
        })
    );
    return results;
});

export const getEssayBySlug = cache(async (slug: string) => {
    const dir = path.join(process.cwd(), "src", "app", "essays");
    const filePath = path.join(dir, `${slug}.mdx`);
    const fileContent = await readFile(filePath, "utf-8");
    const { data: metadata, content } = matter(fileContent);
    return { slug, metadata, content };
});

export const getEssaysSorted = cache(async () => {
    const essays = await getEssaysIndex();
    return essays.slice().sort((a, b) => {
        const da = new Date(a.metadata.date as string).getTime();
        const db = new Date(b.metadata.date as string).getTime();
        return db - da;
    });
});

export const NOTES_PER_PAGE = 3;

export type NoteIndexEntry = {
    slug: string;
    metadata: Record<string, unknown>;
};

export type NoteSitemapEntry = {
    title: string;
    path: string;
};

export const getNotesIndex = cache(async (): Promise<NoteIndexEntry[]> => {
    const dir = path.join(process.cwd(), "src", "app", "notes");
    const mdxFiles = await getMDXFiles(dir);
    const results = await Promise.all(
        mdxFiles.map(async (fileName) => {
            const filePath = path.join(dir, fileName);
            const slug = path.basename(fileName, path.extname(fileName));
            const { data: metadata } = await parseFrontmatterWithBoundedRead(filePath);
            return { slug, metadata };
        })
    );
    return results;
});

export const getNoteSitemapEntries = cache(async (): Promise<NoteSitemapEntry[]> => {
    const notes = await getNotesIndex();
    const reversedNotes = notes.slice().reverse();
    return reversedNotes.map((note, index) => {
        const page = Math.floor(index / NOTES_PER_PAGE) + 1;
        const title =
            (note.metadata.title as string | undefined) || note.slug;
        const path = `/notes?page=${page}#${note.slug}`;
        return { title, path };
    });
});

export const getNoteBySlug = cache(async (slug: string) => {
    const dir = path.join(process.cwd(), "src", "app", "notes");
    const filePath = path.join(dir, `${slug}.mdx`);
    const fileContent = await readFile(filePath, "utf-8");
    const { data: metadata, content } = matter(fileContent);
    return { slug, metadata, content };
});

export type SitemapNode = {
    title: string;
    url?: string;
    children?: SitemapNode[];
};

// Cache the results to avoid re-reading files during the same request
export const getProjects = cache(async () => {
    // List of projects including external ones
    return [
        {
            slug: "speaktype",
            title: "SpeakType",
            summary: "Local-first Windows dictation app that leverages on-device Whisper to convert speech into clean text, inserting it into any editor via global hotkeys.",
            date: "Jan 14, 2026",
            type: "Github",
            externalUrl: "https://github.com/DrNightmare/speaktype"
        },
        {
            slug: "atlas",
            title: "Atlas",
            summary: "Your smart travel companion. Atlas organizes scattered travel documents into a single, intelligent timeline for stress-free check-ins.",
            date: "Dec 28, 2025",
            type: "Github",
            externalUrl: "https://github.com/DrNightmare/Project-Atlas"
        },
        {
            slug: "vacation-planner",
            title: "Vacation Planner",
            summary: "Smart vacation planner that maximizes break quality by prioritizing 4-5 day trips and ensuring they are evenly spaced throughout the year.",
            date: "Jan 12, 2026",
            type: "Tool"
        },
        {
            slug: "knucklebones",
            title: "Knucklebones",
            summary: "A dice game of risk and reward. Place dice to match your own or destroy your opponent's.",
            date: "Dec 31, 2024",
            type: "Game"
        },
        {
            slug: "scoundrel",
            title: "Scoundrel",
            summary: "A solitaire card dungeon crawler. Navigate the room, equip weapons, and slay monsters to clear the deck.",
            date: "Dec 30, 2024",
            type: "Game"
        }
    ];
});

export const getSitemapData = cache(async (): Promise<SitemapNode> => {
    const essays = await getEssaysIndex();
    const noteEntries = await getNoteSitemapEntries();
    const projects = await getProjects();

    const essayNodes: SitemapNode[] = essays.map((essay) => ({
        title: (essay.metadata.title as string | undefined) || essay.slug,
        url: `/essays/${essay.slug}`,
    }));

    const noteNodes: SitemapNode[] = noteEntries.map((entry) => ({
        title: entry.title,
        url: entry.path,
    }));

    const projectNodes: SitemapNode[] = projects.map(project => ({
        title: project.title,
        url: project.externalUrl || `/projects/${project.slug}`
    }));

    return {
        title: "Home",
        url: "/",
        children: [
            {
                title: "About",
                url: "/about",
            },
            {
                title: "Essays",
                children: essayNodes,
            },
            {
                title: "Notes",
                children: noteNodes,
            },
            {
                title: "Projects",
                children: projectNodes,
            },
            {
                title: "Library",
                url: "/library",
            },
            {
                title: "Resume",
                url: "/resume",
            },
            {
                title: "Travel",
                url: "/travel",
            },
        ],
    };
});
