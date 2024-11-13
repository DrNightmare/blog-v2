import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import path from "path";

function getMDXFiles(dir: string) {
    return readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function getMDXData(dir: string) {

    const mdxFiles = getMDXFiles(dir);

    return mdxFiles.map((fileName) => {
        const filePath = path.join(dir, fileName);
        const fileContent = readFileSync(filePath, 'utf-8')

        const { data: metadata, content } = matter(fileContent)

        const slug = path.basename(fileName, path.extname(fileName));

        return {
            metadata,
            slug,
            content,
        };
    })
}

export function getEssays() {
    return getMDXData(path.join(process.cwd(), 'src', 'app', 'essays'));
}

export function getNotes() {
    return getMDXData(path.join(process.cwd(), 'src', 'app', 'notes'));
}