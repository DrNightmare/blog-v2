"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SitemapNode } from "../app/utils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InteractiveSitemapProps {
    root: SitemapNode;
}

export default function InteractiveSitemap({ root }: InteractiveSitemapProps) {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<SitemapNode | null>(null);

    // root.children are the Categories (Level 1): Essays, Notes, Projects, About, etc.
    const categories = root.children || [];

    const handleCategoryClick = (category: SitemapNode) => {
        // If the category has no children, navigate directly to it
        if (!category.children || category.children.length === 0) {
            if (category.url) {
                router.push(category.url);
            }
        } else {
            // Otherwise, show the second level
            setSelectedCategory(category);
        }
    };

    const handleBack = () => {
        setSelectedCategory(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto min-h-[500px]">
            <div className="p-4 md:p-0">
                {!selectedCategory ? (
                    // Categories View
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                        <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-8 px-2">
                            Sections
                        </h2>
                        {categories.map((category) => {
                            const hasChildren = category.children && category.children.length > 0;
                            return (
                                <button
                                    key={category.title}
                                    onClick={() => handleCategoryClick(category)}
                                    className={cn(
                                        "w-full text-left px-6 py-5 rounded-2xl transition-all duration-300 flex items-center justify-between group",
                                        "bg-surface border border-border/50 hover:border-primary/20",
                                        "hover:shadow-lg hover:shadow-primary/5 hover:translate-x-1"
                                    )}
                                >
                                    <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {category.title}
                                    </span>
                                    {hasChildren ? (
                                        <span className="text-2xl text-text-muted/50 group-hover:text-primary transition-all duration-300 group-hover:translate-x-2">
                                            ›
                                        </span>
                                    ) : (
                                        <span className="text-xl text-text-muted/50 group-hover:text-primary transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                                            ↗
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    // Children View with Back Button
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
                        {/* Header Area */}
                        <div className="flex flex-col gap-6 border-b border-border/40 pb-6">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors self-start group px-3 py-1.5 rounded-full hover:bg-surface"
                            >
                                <span className="text-lg transition-transform group-hover:-translate-x-1">←</span>
                                <span className="font-medium">Back to Sections</span>
                            </button>

                            <div>
                                <h3 className="text-3xl font-bold text-foreground">
                                    {selectedCategory.title}
                                </h3>
                                {selectedCategory.url && (
                                    <Link
                                        href={selectedCategory.url}
                                        className="text-base text-primary/80 hover:text-primary hover:underline mt-2 inline-flex items-center gap-1"
                                    >
                                        Visit Main Page <span>↗</span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Children Items */}
                        {selectedCategory.children && selectedCategory.children.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {selectedCategory.children.map((item, idx) => (
                                    <Link
                                        key={item.title}
                                        href={item.url || "#"}
                                        className="group block p-5 rounded-2xl bg-surface border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <div className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                            {item.title}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-text-muted space-y-4 bg-surface/30 rounded-3xl border border-dashed border-border/50">
                                <p className="text-lg">No sub-items in this section</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
