import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import path from "path";

type Metadata = {
    title: string
    publishedAt: string
    summary: string
    image?: string
}

function parseFrontmatter(fileContent: string) {
    let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
    let match = frontmatterRegex.exec(fileContent)
    let frontMatterBlock = match![1]
    let content = fileContent.replace(frontmatterRegex, '').trim()
    let frontMatterLines = frontMatterBlock.trim().split('\n')
    let metadata: Partial<Metadata> = {}

    frontMatterLines.forEach((line) => {
        let [key, ...valueArr] = line.split(': ')
        let value = valueArr.join(': ').trim()
        value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
        metadata[key.trim() as keyof Metadata] = value
    })

    return { metadata: metadata as Metadata, content }
}

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