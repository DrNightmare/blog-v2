'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { useColorScheme } from '@/hooks/useColorScheme';
import { colorSchemes } from '@/config/colorSchemes';

type Command = {
    id: string;
    name: string;
    section: string;
    href?: string;
    action?: () => void;
};

export default function CommandPalette() {
    const { isOpen, setIsOpen } = useCommandPalette();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { setTheme } = useTheme();
    const { setColorScheme } = useColorScheme();

    const commands: Command[] = useMemo(() => {
        const navCommands: Command[] = [
            { id: 'home', name: 'Home', href: '/', section: 'Navigation' },
            { id: 'essays', name: 'Essays', href: '/essays', section: 'Navigation' },
            { id: 'notes', name: 'Notes', href: '/notes', section: 'Navigation' },
            { id: 'library', name: 'Library', href: '/library', section: 'Navigation' },
            { id: 'about', name: 'About', href: '/about', section: 'Navigation' },
            { id: 'resume', name: 'Resume', href: '/resume', section: 'Navigation' },
        ];

        const themeCommands: Command[] = [
            { id: 'theme-light', name: 'Switch to Light Mode', action: () => setTheme('light'), section: 'Theme' },
            { id: 'theme-dark', name: 'Switch to Dark Mode', action: () => setTheme('dark'), section: 'Theme' },
            { id: 'theme-system', name: 'Switch to System Theme', action: () => setTheme('system'), section: 'Theme' },
        ];

        const colorCommands: Command[] = colorSchemes.map(scheme => ({
            id: `scheme-${scheme.id}`,
            name: `Change color to ${scheme.name}`,
            action: () => setColorScheme(scheme),
            section: 'Colors'
        }));

        return [...navCommands, ...themeCommands, ...colorCommands];
    }, [setTheme, setColorScheme]);

    const filteredCommands = useMemo(() => {
        if (!query) return commands;
        const lowerQuery = query.toLowerCase();
        return commands.filter((command) =>
            command.name.toLowerCase().includes(lowerQuery) ||
            command.section.toLowerCase().includes(lowerQuery)
        );
    }, [query, commands]);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            // Small timeout to ensure DOM is ready
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }, [isOpen]);

    // Handle keyboard navigation within the list
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((i) => (i + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    handleSelect(filteredCommands[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, selectedIndex, filteredCommands, setIsOpen]);

    const handleSelect = (command: Command) => {
        setIsOpen(false);
        if (command.action) {
            command.action();
        } else if (command.href) {
            router.push(command.href);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto p-4 sm:p-6 md:p-20">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Palette Panel */}
            <div className="mx-auto max-w-xl transform divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-2xl ring-1 ring-black/5 transition-all">
                <div className="relative">
                    <svg
                        className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-text-muted"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-foreground placeholder:text-text-muted focus:ring-0 sm:text-sm"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                    />
                </div>

                {filteredCommands.length > 0 ? (
                    <ul className="max-h-80 scroll-py-2 divide-y divide-border overflow-y-auto">
                        {filteredCommands.map((command, index) => (
                            <li
                                key={command.id}
                                className={`cursor-pointer select-none px-4 py-4 sm:px-6 ${index === selectedIndex
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-text-secondary hover:bg-slate-50 dark:hover:bg-white/5'
                                    }`}
                                onClick={() => handleSelect(command)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{command.name}</span>
                                    <span className="text-xs text-text-subtle">{command.section}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="px-4 py-14 text-center sm:px-6">
                        <p className="text-sm text-text-muted">No commands found for "{query}"</p>
                    </div>
                )}

                <div className="flex flex-wrap items-center bg-slate-50 px-4 py-2.5 text-xs text-text-muted dark:bg-white/5 border-t border-border">
                    <span className="mx-1">
                        <kbd className="font-sans font-semibold border border-slate-200 dark:border-slate-700 rounded px-1">↑</kbd>
                        <kbd className="font-sans font-semibold border border-slate-200 dark:border-slate-700 rounded px-1 ml-1">↓</kbd>
                        <span className="ml-1">to navigate</span>
                    </span>
                    <span className="mx-1 ml-auto">
                        <kbd className="font-sans font-semibold border border-slate-200 dark:border-slate-700 rounded px-1">Esc</kbd>
                        <span className="ml-1">to close</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
