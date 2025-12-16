'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Lazy load the full CommandPalette only when needed
const CommandPaletteModal = dynamic(
    () => import('./CommandPaletteModal'),
    { ssr: false }
);

/**
 * Lightweight wrapper that only handles the keyboard shortcut.
 * The heavy CommandPaletteModal is only loaded when the user opens it.
 */
export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Only render the modal when open - this triggers the dynamic import
    if (!isOpen) return null;

    return <CommandPaletteModal isOpen={isOpen} setIsOpen={setIsOpen} />;
}
