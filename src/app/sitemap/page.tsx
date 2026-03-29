import Link from "next/link";
import { getSitemapData } from "../utils";
import SitemapTree from "@/components/SitemapTree";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sitemap | Arvind Prakash",
    description: "Interactive site map of all content.",
};

export default async function SitemapPage() {
    const sitemapData = await getSitemapData();

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6">
            <main className="max-w-3xl mx-auto">
                <header className="text-center mb-10 sm:mb-14">
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
                        Navigation
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
                        Sitemap
                    </h1>
                    <p className="text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
                        Full index of pages, essays, notes, and projects—expand any section to explore.
                    </p>
                </header>

                <div className="rounded-2xl border border-border bg-surface/50 p-5 sm:p-8 shadow-sm dark:bg-surface/30">
                    <SitemapTree root={sitemapData} />
                </div>

                <p className="mt-10 text-center text-sm text-text-muted">
                    <Link
                        href="/sitemap.xml"
                        className="text-primary/90 hover:text-primary hover:underline underline-offset-2"
                    >
                        Machine-readable sitemap
                    </Link>
                    <span className="mx-2 text-border">·</span>
                    <span>For search engines and feeds</span>
                </p>
            </main>
        </div>
    );
}
