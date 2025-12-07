'use client';

import { useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { colorSchemes } from '@/config/colorSchemes';
import ColorPreviewCard from './ColorPreviewCard';

export default function ColorSchemeSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const { colorScheme, setColorScheme, mounted } = useColorScheme();

    if (!mounted) {
        return <div className="w-8 h-8" />; // Placeholder
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 transition-colors"
                aria-label="Choose Color Scheme"
                title="Choose Color Scheme"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl border border-border shadow-lg z-50 p-4">
                        <div className="mb-3">
                            <h3 className="text-sm font-semibold text-foreground mb-1">
                                Choose Color Scheme
                            </h3>
                            <p className="text-xs text-text-muted">
                                Select a color palette for the site
                            </p>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {colorSchemes.map((scheme) => (
                                <button
                                    key={scheme.id}
                                    onClick={() => {
                                        setColorScheme(scheme);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left transition-all ${colorScheme.id === scheme.id
                                            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
                                            : 'hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-700'
                                        } rounded-lg overflow-hidden`}
                                >
                                    <div className="p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-foreground">
                                                {scheme.name}
                                            </span>
                                            {colorScheme.id === scheme.id && (
                                                <svg
                                                    className="w-4 h-4 text-primary"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <ColorPreviewCard scheme={scheme} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
