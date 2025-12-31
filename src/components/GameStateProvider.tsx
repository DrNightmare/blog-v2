'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

type GameStateContextType = {
    loadState: <T>(gameId: string, initialState: T) => T;
    saveState: <T>(gameId: string, state: T) => void;
    resetState: (gameId: string) => void;
};

const GameStateContext = createContext<GameStateContextType | null>(null);

export function useGameState() {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGameState must be used within a GameStateProvider');
    }
    return context;
}

export default function GameStateProvider({ children }: { children: ReactNode }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const loadState = useCallback(<T,>(gameId: string, initialState: T): T => {
        if (!isClient) return initialState;
        try {
            const saved = localStorage.getItem(`game_state_${gameId}`);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load game state', e);
        }
        return initialState;
    }, [isClient]);

    const saveState = useCallback(<T,>(gameId: string, state: T) => {
        if (!isClient) return;
        try {
            localStorage.setItem(`game_state_${gameId}`, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save game state', e);
        }
    }, [isClient]);

    const resetState = useCallback((gameId: string) => {
        if (!isClient) return;
        try {
            localStorage.removeItem(`game_state_${gameId}`);
        } catch (e) {
            console.error('Failed to reset game state', e);
        }
    }, [isClient]);

    return (
        <GameStateContext.Provider value={{ loadState, saveState, resetState }}>
            {children}
        </GameStateContext.Provider>
    );
}
