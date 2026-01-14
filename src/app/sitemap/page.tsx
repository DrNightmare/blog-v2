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
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Sitemap
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Explore the digital garden.
                    </p>
                </div>

                <div className="bg-border-light/30 rounded-3xl p-4 sm:p-8 backdrop-blur-sm">
                    <InteractiveSitemap root={sitemapData} />
                </div>
            </main>
        </div>
    );
}
