'use client';

import { useEffect, useState } from 'react';
import { ColorScheme, colorSchemes, defaultScheme } from '@/config/colorSchemes';

const STORAGE_KEY = 'blog-color-scheme';

export function useColorScheme() {
    const [colorScheme, setColorSchemeState] = useState<ColorScheme>(defaultScheme);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const scheme = colorSchemes.find(s => s.id === stored);
            if (scheme) {
                setColorSchemeState(scheme);
                applyColorScheme(scheme);
            }
        }
    }, []);

    const setColorScheme = (scheme: ColorScheme) => {
        setColorSchemeState(scheme);
        localStorage.setItem(STORAGE_KEY, scheme.id);
        applyColorScheme(scheme);
    };

    return { colorScheme, setColorScheme, mounted };
}

function applyColorScheme(scheme: ColorScheme) {
    const root = document.documentElement;

    // Apply light mode colors
    root.style.setProperty('--primary', scheme.colors.primary);
    root.style.setProperty('--primary-hover', scheme.colors.primaryHover);
    root.style.setProperty('--primary-light', scheme.colors.primaryLight);
    root.style.setProperty('--primary-subtle', scheme.colors.primarySubtle);

    // Apply dark mode colors if provided
    if (scheme.colors.primaryDark) {
        // We need to update the .dark class CSS variables
        // For now, we'll use a data attribute approach
        root.setAttribute('data-color-scheme', scheme.id);
    }
}

// Helper to get CSS for dark mode overrides
export function getColorSchemeStyles() {
    return colorSchemes.map(scheme => {
        if (!scheme.colors.primaryDark) return '';

        return `
      [data-color-scheme="${scheme.id}"].dark {
        --primary: ${scheme.colors.primaryDark};
        --primary-hover: ${scheme.colors.primaryHoverDark};
        --primary-light: ${scheme.colors.primaryLightDark};
        --primary-subtle: ${scheme.colors.primarySubtleDark};
      }
    `;
    }).join('\n');
}
