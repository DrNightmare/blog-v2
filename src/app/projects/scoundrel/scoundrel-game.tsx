'use client';

import React, { useReducer, useState, useEffect } from 'react';
import { Card, GameState, Suit } from '@/lib/scoundrel/types';
import { gameReducer } from '@/lib/scoundrel/engine';
import { getInitialState } from '@/lib/scoundrel/game-state';
// Actually, in `blog-v2` usually `cn` is in `lib/utils`. I'll trust it exists.

// --- UI Helpers ---

const getSuitSymbol = (suit: Suit) => {
    switch (suit) {
        case 'hearts': return '♥';
        case 'diamonds': return '♦';
        case 'clubs': return '♣';
        case 'spades': return '♠';
    }
};

const getSuitColor = (suit: Suit) => {
    return (suit === 'hearts' || suit === 'diamonds') ? 'text-red-500' : 'text-slate-900 dark:text-slate-100';
};

const CardView = ({
    card,
    onClick,
    disabled = false,
    className,
    style
}: {
    card: Card;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}) => {
    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

    // Card Visuals
    // Monsters: Dark, Gritty? Or just clean white w/ Black suit?
    // Let's go Clean. White card, colored pips.

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={style}
            className={`
        relative w-24 h-36 md:w-32 md:h-48 
        bg-white dark:bg-slate-800 
        border-2 rounded-xl shadow-sm transition-all duration-200
        flex flex-col justify-between p-2
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-1 hover:shadow-md cursor-pointer active:scale-95'}
        ${isRed ? 'border-red-200 dark:border-red-900/30' : 'border-slate-200 dark:border-slate-700'}
        ${className}
      `}
        >
            {/* Top Left */}
            <div className={`text-left text-lg font-bold leading-none ${getSuitColor(card.suit)}`}>
                <div>{card.rank <= 10 ? card.rank : ['J', 'Q', 'K', 'A'][card.rank - 11]}</div>
                <div className="text-sm">{getSuitSymbol(card.suit)}</div>
            </div>

            {/* Center - Large Suit or Art */}
            <div className={`absolute inset-0 flex items-center justify-center text-4xl opacity-20 pointer-events-none ${getSuitColor(card.suit)}`}>
                {getSuitSymbol(card.suit)}
            </div>

            {/* Bottom Right */}
            <div className={`text-right text-lg font-bold leading-none ${getSuitColor(card.suit)} rotate-180`}>
                <div>{card.rank <= 10 ? card.rank : ['J', 'Q', 'K', 'A'][card.rank - 11]}</div>
                <div className="text-sm">{getSuitSymbol(card.suit)}</div>
            </div>
        </button>
    );
};

import { useGameState } from '@/components/GameStateProvider';

export default function ScoundrelGame() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const { loadState, saveState, resetState } = useGameState();
    const GAME_ID = 'scoundrel';

    const [state, dispatch] = useReducer(gameReducer, null, () => {
        const defaultState = getInitialState();
        return loadState(GAME_ID, defaultState);
    });

    const [useWeapon, setUseWeapon] = React.useState(true);

    // Persist state changes
    useEffect(() => {
        saveState(GAME_ID, state);
    }, [state, saveState]);

    // --- Game Juice State ---
    const [floats, setFloats] = useState<{ id: number; text: string; color: string; x: number; y: number }[]>([]);
    const [prevHp, setPrevHp] = useState(state?.hp ?? 20);
    const [prevWeaponId, setPrevWeaponId] = useState<string | undefined>(undefined);

    // Juice Effect: HP Changes
    useEffect(() => {
        if (!state) return;
        const diff = state.hp - prevHp;
        if (diff !== 0) {
            const id = Date.now();
            const text = diff > 0 ? `+${diff}` : `${diff}`;
            const color = diff > 0 ? 'text-green-500' : 'text-red-500';
            // Randomize position slightly around center/top
            const x = 50 + (Math.random() * 20 - 10);
            const y = 30 + (Math.random() * 10 - 5);

            setFloats(prev => [...prev, { id, text, color, x, y }]);
            setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 1000);
            setPrevHp(state.hp);
        }
    }, [state.hp, prevHp, state]); // Removed optional chaining on state dependence as it's guaranteed by reducer

    // Juice Effect: Weapon Equip
    useEffect(() => {
        if (!state) return;
        if (state.weapon && state.weapon.card.id !== prevWeaponId) {
            const id = Date.now();
            setFloats(prev => [...prev, { id, text: 'Equipped!', color: 'text-blue-500', x: 80, y: 30 }]);
            setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 1000);
            setPrevWeaponId(state.weapon.card.id);
        } else if (!state.weapon) {
            setPrevWeaponId(undefined);
        }
    }, [state.weapon, prevWeaponId, state]);


    if (!mounted) return null;

    // Handlers
    const handleCardClick = (cardId: string) => {
        dispatch({ type: 'PLAY_CARD', cardId, useBarehanded: !useWeapon });
    };

    const handleFlee = () => {
        dispatch({ type: 'FLEE_ROOM' });
    };

    const handleRestart = () => {
        resetState(GAME_ID);
        dispatch({ type: 'START_GAME' });
        setPrevHp(20);
        setFloats([]);
    };

    return (
        <div className="relative flex flex-col items-center max-w-2xl mx-auto p-4 md:p-8 min-h-[600px]">

            {/* Floating Text Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                {floats.map(f => (
                    <div
                        key={f.id}
                        className={`absolute text-2xl font-bold animate-float-up ${f.color}`}
                        style={{ left: `${f.x}%`, top: `${f.y}%` }}
                    >
                        {f.text}
                    </div>
                ))}
            </div>

            {/* HEADER: STATUS */}
            <div className="w-full flex justify-between items-end mb-8 border-b pb-4 border-slate-200 dark:border-slate-700">

                {/* HP Status */}
                <div className="text-center relative">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Health</div>
                    <div className={`text-3xl font-bold transition-transform duration-100 ${state.hp <= 5 ? 'text-red-600 animate-pulse' : 'text-slate-800 dark:text-slate-200'}`}>
                        {state.hp} <span className="text-lg text-slate-400 font-normal">/ {state.maxHp}</span>
                    </div>
                </div>

                {/* Deck Info */}
                <div className="text-center hidden md:block">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Deck</div>
                    <div className="text-xl font-mono text-slate-700 dark:text-slate-300">
                        {state.deck.length} cards
                    </div>
                </div>

                {/* Weapon Slot */}
                <div className="text-center relative flex flex-col items-center w-24">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Weapon</div>

                    {/* Fixed height container for Weapon/Fists */}
                    <div className="h-20 flex flex-col items-center justify-start">
                        {state.weapon ? (
                            <>
                                <div className="font-bold text-lg text-blue-600 dark:text-blue-400 animate-pop-in">
                                    {state.weapon.card.rank <= 10 ? state.weapon.card.rank : ['J', 'Q', 'K', 'A'][state.weapon.card.rank - 11]}
                                    {getSuitSymbol(state.weapon.card.suit)}
                                </div>
                                <div className={`text-xs text-slate-400 mt-1 ${state.weapon.lastSlainValue !== null ? '' : 'invisible'}`}>
                                    Last kill: {state.weapon.lastSlainValue ?? '0'}
                                </div>
                            </>
                        ) : (
                            <div className="text-slate-400 italic text-sm py-2">Fists</div>
                        )}
                    </div>

                    {/* Weapon Toggle - Fixed height container */}
                    <div className="h-6 mt-1 flex items-center justify-center">
                        <label className={`flex items-center justify-center gap-2 cursor-pointer select-none ${state.weapon ? '' : 'invisible'}`}>
                            <input
                                type="checkbox"
                                checked={useWeapon}
                                onChange={(e) => setUseWeapon(e.target.checked)}
                                className="w-3 h-3 accent-blue-600"
                            />
                            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wide">Use Weapon</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* GAME AREA - MESSAGES */}
            <div className="h-12 mb-4 flex items-center justify-center text-center">
                {state.gameOver ? (
                    <div className="text-red-500 font-bold text-xl animate-bounce">YOU DIED</div>
                ) : state.gameWon ? (
                    <div className="text-green-500 font-bold text-xl animate-bounce">DUNGEON CLEARED!</div>
                ) : (
                    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base animate-in fade-in slide-in-from-bottom-2 duration-300" key={state.message}>
                        {state.message}
                    </p>
                )}
            </div>

            {/* ROOM GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {state.room.map((card, index) => (
                    <CardView
                        key={card.id}
                        card={card}
                        onClick={() => handleCardClick(card.id)}
                        disabled={state.gameOver || state.gameWon}
                        className="animate-pop-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    />
                ))}
                {/* Fillers */}
                {state.room.length < 4 && !state.gameOver && !state.gameWon && Array.from({ length: 4 - state.room.length }).map((_, i) => (
                    <div key={i} className="w-24 h-36 md:w-32 md:h-48 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl opacity-50" />
                ))}
            </div>

            {/* CONTROLS */}
            <div className="flex flex-wrap justify-center gap-4 mt-auto">
                {(state.gameOver || state.gameWon) ? (
                    <button
                        onClick={handleRestart}
                        className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-700 transition"
                    >
                        Start New Run
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleFlee}
                            disabled={!state.canFlee || state.room.length !== 4}
                            className={`
                                px-6 py-2 rounded-md font-medium transition
                                ${(state.canFlee && state.room.length === 4)
                                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}
                            `}
                        >
                            Flee Room
                        </button>

                        <button
                            onClick={handleRestart}
                            className="px-4 py-2 rounded-md font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-100"
                            title="Reset Game"
                        >
                            Reset
                        </button>
                    </>
                )}
            </div>

            {/* INSTRUCTIONS MINI */}
            <div className="mt-12 text-xs text-slate-400 max-w-md text-center">
                <p>Goal: Clear the deck (44 cards). Max HP: 20.</p>
                <p>Hearts heal. Diamonds are weapons. Spades/Clubs are monsters.</p>
                <p>Weapons must engage weaker monsters sequentially.</p>
            </div>

        </div>
    );
}
