import { notFound } from "next/navigation";
import { createElement } from "react";
import { getEssayMetaBySlug, getEssaysIndex, toIsoDatePublished } from "../../utils";
import { getEssayMdx } from "@/content/essays/registry";
import EssayJsonLd from "@/components/EssayJsonLd";
import type { Metadata } from "next";

type EssayParam = {
    slug: string;
};

export async function generateStaticParams(): Promise<EssayParam[]> {
    const essays = await getEssaysIndex();
    return essays.map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata(
    { params }: { params: Promise<EssayParam> }
): Promise<Metadata> {
    const { slug } = await params;
    const essays = await getEssaysIndex();
    const entry = essays.find((e) => e.slug === slug);
    if (!entry) {
        return {
            title: "Essay not found",
            description: "The requested essay could not be found.",
        };
    }

    const title = String(entry.metadata.title || entry.slug);
    const description = String(
        entry.metadata.summary || "Long form writing by Arvind Prakash."
    );
    const url = `/essays/${entry.slug}`;

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
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function Essay({ params }: { params: Promise<EssayParam> }) {
    const { slug } = await params;
    const EssayMdx = getEssayMdx(slug);
    if (!EssayMdx) {
        return notFound();
    }

    let essay: Awaited<ReturnType<typeof getEssayMetaBySlug>>;
    try {
        essay = await getEssayMetaBySlug(slug);
    } catch {
        return notFound();
    }

    const title = String(essay.metadata.title || essay.slug);
    const description = String(
        essay.metadata.summary || "Long form writing by Arvind Prakash."
    );
    const datePublished = toIsoDatePublished(essay.metadata.date);

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
                        {createElement(EssayMdx)}
                    </article>
                </div>
            </div>
        </>
    );
}
