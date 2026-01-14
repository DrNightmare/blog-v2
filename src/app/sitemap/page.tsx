import { getSitemapData } from "../utils";
import InteractiveSitemap from "@/components/InteractiveSitemap";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sitemap | Arvind Prakash",
    description: "Interactive site map of all content.",
};

export default async function SitemapPage() {
    const sitemapData = await getSitemapData();

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6">
            <main className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 tracking-tight">
                        Sitemap
                    </h1>
                    <p className="text-xl text-text-secondary">
                        Explore the digital garden.
                    </p>
                </div>

                <InteractiveSitemap root={sitemapData} />
            </main>
        </div>
    );
}
