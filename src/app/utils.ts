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
