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
        <div className="w-full max-w-3xl mx-auto min-h-[600px] bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 overflow-y-auto">
                {!selectedCategory ? (
                    // Categories View
                    <div className="space-y-2">
                        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 px-2">
                            Sections
                        </h2>
                        {categories.map((category) => {
                            const hasChildren = category.children && category.children.length > 0;
                            return (
                                <button
                                    key={category.title}
                                    onClick={() => handleCategoryClick(category)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group",
                                        "text-text-secondary hover:text-primary border border-border/50 hover:border-border",
                                        "hover:bg-background/70 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                    )}
                                >
                                    <span className="font-medium transition-colors">{category.title}</span>
                                    {hasChildren ? (
                                        <span className="text-xl text-text-muted group-hover:text-primary transition-all group-hover:translate-x-1">
                                            ›
                                        </span>
                                    ) : (
                                        <span className="text-lg text-text-muted group-hover:text-primary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                                            ↗
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    // Children View with Back Button
                    <div className="space-y-6">
                        {/* Back Button */}
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors"
                        >
                            <span>←</span>
                            <span>Back</span>
                        </button>

                        {/* Category Header */}
                        <div className="border-b border-border pb-4">
                            <h3 className="text-2xl font-bold text-foreground">
                                {selectedCategory.title}
                            </h3>
                            {selectedCategory.url && (
                                <Link
                                    href={selectedCategory.url}
                                    className="text-sm text-primary hover:underline mt-1 inline-block"
                                >
                                    Visit Page &rarr;
                                </Link>
                            )}
                        </div>

                        {/* Children Items */}
                        {selectedCategory.children && selectedCategory.children.length > 0 ? (
                            <div className="grid gap-2 sm:grid-cols-2">
                                {selectedCategory.children.map((item) => (
                                    <Link
                                        key={item.title}
                                        href={item.url || "#"}
                                        className="group block p-4 rounded-xl border border-border/50 hover:border-border hover:bg-background/70 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                            {item.title}
                                        </div>
                                        {item.url && (
                                            <div className="text-xs text-text-muted mt-1 truncate">
                                                {item.url}
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-text-muted text-sm space-y-2">
                                <p>No sub-items in this section.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
