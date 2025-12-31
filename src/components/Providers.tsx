'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useState, useEffect } from 'react';
import GameStateProvider from './GameStateProvider';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <GameStateProvider>
                {children}
            </GameStateProvider>
        </ThemeProvider>
    );
}
