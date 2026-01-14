"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    // Default to the first category if available, otherwise null
    const [activeCategory, setActiveCategory] = useState<SitemapNode | null>(
        root.children && root.children.length > 0 ? root.children[0] : null
    );

    // root.children are the Categories (Level 1): Essays, Notes, Projects, About, etc.
    const categories = root.children || [];

    return (
        <div className="w-full max-w-5xl mx-auto min-h-[600px] flex flex-col md:flex-row bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* Left Panel: Categories */}
            <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border bg-background/50 p-4 space-y-2 overflow-y-auto max-h-[300px] md:max-h-none">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 px-2">
                    Sections
                </h2>
                {categories.map((category) => {
                    const isActive = activeCategory?.title === category.title;
                    return (
                        <button
                            key={category.title}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group",
                                isActive
                                    ? "bg-surface shadow-sm ring-1 ring-border text-foreground font-medium"
                                    : "hover:bg-surface/50 text-text-secondary hover:text-foreground"
                            )}
                        >
                            <span>{category.title}</span>
                            {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Right Panel: Content */}
            <div className="w-full md:w-2/3 p-6 md:p-8 bg-surface overflow-y-auto relative min-h-[400px]">
                {activeCategory ? (
                    <div
                        key={activeCategory.title}
                        className="space-y-6 animate-pop-in"
                    >
                        <div className="border-b border-border pb-4">
                            <h3 className="text-2xl font-bold text-foreground">
                                {activeCategory.title}
                            </h3>
                            {activeCategory.url && (
                                <Link
                                    href={activeCategory.url}
                                    className="text-sm text-primary hover:underline mt-1 inline-block"
                                >
                                    Visit Page &rarr;
                                </Link>
                            )}
                        </div>

                        {activeCategory.children && activeCategory.children.length > 0 ? (
                            <div className="grid gap-2 sm:grid-cols-2">
                                {activeCategory.children.map((item) => (
                                    <Link
                                        key={item.title}
                                        href={item.url || "#"}
                                        className="group block p-4 rounded-xl border border-border/50 hover:border-border hover:bg-background/50 transition-all duration-200"
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
                                {activeCategory.url && (
                                    <Link
                                        href={activeCategory.url}
                                        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors"
                                    >
                                        Go to {activeCategory.title}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-text-muted">
                        Select a category to view contents
                    </div>
                )}
            </div>
        </div>
    );
}
