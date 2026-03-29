import { notFound } from "next/navigation";
import { getEssayBySlug, getEssaysIndex } from "../../utils";
import { MDXRemote } from "next-mdx-remote/rsc";
import EssayJsonLd from "@/components/EssayJsonLd";
import CustomLink from "@/components/CustomLink";
import Pre from "@/components/CustomPre";
import { highlight } from "sugar-high";
import { JSX, ReactNode } from "react";
import type { Metadata } from "next";

type EssayParam = {
    slug: string;
};

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
    children?: ReactNode;
}

export async function generateStaticParams(): Promise<EssayParam[]> {
    const essays = await getEssaysIndex();
    return essays.map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata(
    { params }: { params: Promise<EssayParam> }
): Promise<Metadata> {
    const { slug } = await params;
    let essay: Awaited<ReturnType<typeof getEssayBySlug>>;
    try {
        essay = await getEssayBySlug(slug);
    } catch {
        return {
            title: "Essay not found",
            description: "The requested essay could not be found.",
        };
    }

    const title = String(essay.metadata.title || essay.slug);
    const description = String(
        essay.metadata.summary || "Long form writing by Arvind Prakash."
    );
    const url = `/essays/${essay.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            type: "article",
            url,
            images: [
                {
                    url: "/opengraph-image",
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/twitter-image"],
        },
    };
}

function Code({ children, ...props }: CodeProps) {
    const codeHTML = highlight(children as string)
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

const components = {
    a: (props: any) => (
        <CustomLink {...props}>
            {props.children}
        </CustomLink>
    ),
    pre: Pre,
    code: Code,
};

export default async function Essay({ params }: { params: Promise<EssayParam> }) {
    const { slug } = await params;
    let essay: Awaited<ReturnType<typeof getEssayBySlug>>;
    try {
        essay = await getEssayBySlug(slug);
    } catch {
        return notFound();
    }

    const title = String(essay.metadata.title || essay.slug);
    const description = String(
        essay.metadata.summary || "Long form writing by Arvind Prakash."
    );
    const datePublished = String(essay.metadata.date ?? "");

    return (
        <>
            <EssayJsonLd
                slug={essay.slug}
                title={title}
                description={description}
                datePublished={datePublished}
            />
            <div className="flex justify-center m-5">
                <div className="flex-col">
                    <article className="prose dark:prose-invert">
                        <div className="justify-self-center">
                            <h1>{essay.metadata.title as string}</h1>
                        </div>
                        <MDXRemote source={essay.content} components={components} />
                    </article>
                </div>
            </div>
        </>
    );
}
