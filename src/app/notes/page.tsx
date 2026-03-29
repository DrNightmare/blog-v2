import { createElement } from "react";
import { getNotesIndex, NOTES_PER_PAGE } from "../utils";
import { getNoteMdx } from "@/content/notes/registry";
import Link from "next/link";
import { listPageMetadata } from "@/lib/sitePageMetadata";

export const metadata = listPageMetadata({
    title: "Notes",
    description: "Short notes, drafts, and in-progress learnings.",
    path: "/notes",
});

type PageProps = {
    searchParams: Promise<{ page?: string }>;
};

export default async function Notes({ searchParams }: PageProps) {
    const params = await searchParams;
    const allNotes = (await getNotesIndex()).slice().reverse();
    const totalNotes = allNotes.length;
    const totalPages = Math.ceil(totalNotes / NOTES_PER_PAGE);

    const currentPage = Math.max(1, Math.min(totalPages, parseInt(params.page || '1', 10) || 1));

    const startIndex = (currentPage - 1) * NOTES_PER_PAGE;
    const endIndex = startIndex + NOTES_PER_PAGE;
    const paginatedIndex = allNotes.slice(startIndex, endIndex);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6">
            <main className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Notes
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        A collection of initial thoughts, brainstorming, and in-progress learnings.
                        <span className="ml-2 inline-flex items-center justify-center bg-primary-light text-primary text-xs font-bold px-2 py-1 rounded-full">
                            {totalNotes}
                        </span>
                    </p>
                </div>

                <div className="space-y-8">
                    {paginatedIndex.map((entry) => {
                        const NoteMdx = getNoteMdx(entry.slug);
                        if (!NoteMdx) return null;
                        return (
                        <div key={entry.slug} id={entry.slug} className="bg-surface rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-foreground">{entry.metadata.title as string}</h2>
                                <time className="text-sm text-text-subtle font-medium bg-border-light px-3 py-1 rounded-full dark:bg-slate-800 dark:text-slate-400">
                                    {entry.metadata.date as string}
                                </time>
                            </div>
                            <article className="prose prose-slate prose-lg max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline dark:prose-invert">
                                {createElement(NoteMdx)}
                            </article>
                        </div>
                        );
                    })}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-12">
                        {currentPage > 1 ? (
                            <Link
                                href={`/notes?page=${currentPage - 1}`}
                                className="px-4 py-2 rounded-lg bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors"
                            >
                                ← Previous
                            </Link>
                        ) : (
                            <span className="px-4 py-2 rounded-lg bg-surface border border-border text-text-subtle cursor-not-allowed opacity-50">
                                ← Previous
                            </span>
                        )}

                        <span className="text-sm text-text-secondary">
                            Page <span className="font-semibold text-foreground">{currentPage}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
                        </span>

                        {currentPage < totalPages ? (
                            <Link
                                href={`/notes?page=${currentPage + 1}`}
                                className="px-4 py-2 rounded-lg bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors"
                            >
                                Next →
                            </Link>
                        ) : (
                            <span className="px-4 py-2 rounded-lg bg-surface border border-border text-text-subtle cursor-not-allowed opacity-50">
                                Next →
                            </span>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
