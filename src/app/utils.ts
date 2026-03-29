import { open, readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { cache } from "react";

import { PROJECTS } from "@/data/projects";

const ESSAYS_CONTENT_DIR = path.join(process.cwd(), "src", "content", "essays");
const NOTES_CONTENT_DIR = path.join(process.cwd(), "src", "content", "notes");

const FRONTMATTER_READ_BYTES = 16_384;

/** Shared shape for essay and note list frontmatter (MDX may add other fields). */
export type ContentFrontmatter = {
    title?: string;
    date?: string;
    summary?: string;
};

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
    metadata: ContentFrontmatter;
};

/** ISO 8601 when parsable; otherwise original string; empty when absent. */
export function toIsoDatePublished(value: unknown): string {
    if (value == null || value === "") return "";
    const s = String(value);
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
    return s;
}

export const getEssaysIndex = cache(async (): Promise<EssayIndexEntry[]> => {
    const dir = ESSAYS_CONTENT_DIR;
    const mdxFiles = await getMDXFiles(dir);
    const results = await Promise.all(
        mdxFiles.map(async (fileName) => {
            const filePath = path.join(dir, fileName);
            const slug = path.basename(fileName, path.extname(fileName));
            const { data } = await parseFrontmatterWithBoundedRead(filePath);
            return { slug, metadata: data as ContentFrontmatter };
        })
    );
    return results;
});

/** Full-file read for metadata only (MDX body is compiled from `src/content/essays`). */
export const getEssayMetaBySlug = cache(async (slug: string) => {
    const filePath = path.join(ESSAYS_CONTENT_DIR, `${slug}.mdx`);
    const fileContent = await readFile(filePath, "utf-8");
    const { data } = matter(fileContent);
    return { slug, metadata: data as ContentFrontmatter };
});

export const getEssaysSorted = cache(async () => {
    const essays = await getEssaysIndex();
    return essays.slice().sort((a, b) => {
        const da = new Date(a.metadata.date ?? "").getTime();
        const db = new Date(b.metadata.date ?? "").getTime();
        return db - da;
    });
});

export const NOTES_PER_PAGE = 3;

export type NoteIndexEntry = {
    slug: string;
    metadata: ContentFrontmatter;
};

export type NoteSitemapEntry = {
    title: string;
    path: string;
};

export const getNotesIndex = cache(async (): Promise<NoteIndexEntry[]> => {
    const dir = NOTES_CONTENT_DIR;
    const mdxFiles = await getMDXFiles(dir);
    const results = await Promise.all(
        mdxFiles.map(async (fileName) => {
            const filePath = path.join(dir, fileName);
            const slug = path.basename(fileName, path.extname(fileName));
            const { data } = await parseFrontmatterWithBoundedRead(filePath);
            return { slug, metadata: data as ContentFrontmatter };
        })
    );
    return results;
});

export const getNoteSitemapEntries = cache(async (): Promise<NoteSitemapEntry[]> => {
    const notes = await getNotesIndex();
    const reversedNotes = notes.slice().reverse();
    return reversedNotes.map((note, index) => {
        const page = Math.floor(index / NOTES_PER_PAGE) + 1;
        const title = note.metadata.title || note.slug;
        const path = `/notes?page=${page}#${note.slug}`;
        return { title, path };
    });
});

export type SitemapNode = {
    title: string;
    url?: string;
    children?: SitemapNode[];
};

export const getProjects = cache(async () => PROJECTS);

export const getSitemapData = cache(async (): Promise<SitemapNode> => {
    const essays = await getEssaysIndex();
    const noteEntries = await getNoteSitemapEntries();
    const projects = await getProjects();

    const essayNodes: SitemapNode[] = essays.map((essay) => ({
        title: essay.metadata.title || essay.slug,
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
