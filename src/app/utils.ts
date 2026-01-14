import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { cache } from "react";

async function getMDXFiles(dir: string) {
    const files = await readdir(dir);
    return files.filter((file) => path.extname(file) === '.mdx');
}

async function getMDXData(dir: string) {
    const mdxFiles = await getMDXFiles(dir);

    const results = await Promise.all(
        mdxFiles.map(async (fileName) => {
            const filePath = path.join(dir, fileName);
            const fileContent = await readFile(filePath, 'utf-8');

            const { data: metadata, content } = matter(fileContent);

            const slug = path.basename(fileName, path.extname(fileName));

            return {
                metadata,
                slug,
                content,
            };
        })
    );

    return results;
}

// Cache the results to avoid re-reading files during the same request
export const getEssays = cache(async () => {
    return getMDXData(path.join(process.cwd(), 'src', 'app', 'essays'));
});

export const getNotes = cache(async () => {
    return getMDXData(path.join(process.cwd(), 'src', 'app', 'notes'));
});

export type SitemapNode = {
    title: string;
    url?: string;
    children?: SitemapNode[];
};

export const getProjects = cache(async () => {
    return [
        {
            slug: "holiday-optimizer",
            title: "Annual Leave Spacer",
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
    const essays = await getEssays();
    const notes = await getNotes();
    const projects = await getProjects();

    const essayNodes: SitemapNode[] = essays.map(essay => ({
        title: essay.metadata.title || essay.slug,
        url: `/essays/${essay.slug}`
    }));

    // Notes are displayed in reverse order, 3 per page.
    // We need to calculate the page number for each note to link correctly.
    const reversedNotes = notes.slice().reverse();
    const noteNodes: SitemapNode[] = reversedNotes.map((note, index) => {
        const page = Math.floor(index / 3) + 1;
        return {
            title: note.metadata.title || note.slug,
            url: `/notes?page=${page}#${note.slug}`
        };
    });

    const projectNodes: SitemapNode[] = projects.map(project => ({
        title: project.title,
        url: `/projects/${project.slug}`
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
                title: "Activities",
                url: "/activities",
            },
            {
                title: "Library",
                url: "/library",
            },
            {
                title: "Resume",
                url: "/resume",
            },
        ],
    };
});
