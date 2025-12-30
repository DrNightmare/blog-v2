'use client';

import React, { useReducer, useEffect, useState } from 'react';
import { gameReducer, getInitialState, calculateColumnScore, calculateTotalScore, MAX_PER_COL } from '@/lib/knucklebones/engine';
import { getAiMove, Difficulty } from '@/lib/knucklebones/ai';
import { COLS } from '@/lib/knucklebones/engine';

// --- Components ---

const Die = ({ value, className }: { value: number; className?: string }) => {
    // Dice pips patterns
    const pips = {
        1: [<div key="c" className="w-2 h-2 bg-current rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />],
        2: [
            <div key="tl" className="w-2 h-2 bg-current rounded-full absolute top-2 left-2" />,
            <div key="br" className="w-2 h-2 bg-current rounded-full absolute bottom-2 right-2" />
        ],
        3: [
            <div key="tl" className="w-2 h-2 bg-current rounded-full absolute top-2 left-2" />,
            <div key="c" className="w-2 h-2 bg-current rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />,
            <div key="br" className="w-2 h-2 bg-current rounded-full absolute bottom-2 right-2" />
        ],
        4: [
            <div key="tl" className="w-2 h-2 bg-current rounded-full absolute top-2 left-2" />,
            <div key="tr" className="w-2 h-2 bg-current rounded-full absolute top-2 right-2" />,
            <div key="bl" className="w-2 h-2 bg-current rounded-full absolute bottom-2 left-2" />,
            <div key="br" className="w-2 h-2 bg-current rounded-full absolute bottom-2 right-2" />
        ],
        5: [
            <div key="tl" className="w-2 h-2 bg-current rounded-full absolute top-2 left-2" />,
            <div key="tr" className="w-2 h-2 bg-current rounded-full absolute top-2 right-2" />,
            <div key="c" className="w-2 h-2 bg-current rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />,
            <div key="bl" className="w-2 h-2 bg-current rounded-full absolute bottom-2 left-2" />,
            <div key="br" className="w-2 h-2 bg-current rounded-full absolute bottom-2 right-2" />
        ],
        6: [
            <div key="tl" className="w-2 h-2 bg-current rounded-full absolute top-2 left-2" />,
            <div key="tr" className="w-2 h-2 bg-current rounded-full absolute top-2 right-2" />,
            <div key="ml" className="w-2 h-2 bg-current rounded-full absolute top-1/2 left-2 -translate-y-1/2" />,
            <div key="mr" className="w-2 h-2 bg-current rounded-full absolute top-1/2 right-2 -translate-y-1/2" />,
            <div key="bl" className="w-2 h-2 bg-current rounded-full absolute bottom-2 left-2" />,
            <div key="br" className="w-2 h-2 bg-current rounded-full absolute bottom-2 right-2" />
        ]
    };

    return (
        <div className={`
            w-12 h-12 md:w-16 md:h-16 relative bg-white dark:bg-slate-800 
            border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-sm
            text-slate-800 dark:text-slate-200 flex-shrink-0
            ${className}
        `}>
            {pips[value as keyof typeof pips]}
        </div>
    );
};

export default function KnucklebonesGame() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [state, dispatch] = useReducer(gameReducer, null, getInitialState);
    const [aiThinking, setAiThinking] = useState(false);
    const [difficulty, setDifficulty] = useState<Difficulty>('Easy');

    // AI Turn Effect
    useEffect(() => {
        if (state.turn === 'cpu' && !state.gameOver) {
            setAiThinking(true);
            const timer = setTimeout(() => {
                const col = getAiMove(state, difficulty);
                dispatch({ type: 'PLACE_DIE', columnIndex: col });
                setAiThinking(false);
            }, 1000 + Math.random() * 500); // 1-1.5s delay for "thinking"
            return () => clearTimeout(timer);
        }
    }, [state.turn, state.gameOver, state, difficulty]);

    const handleColumnClick = (colIndex: number) => {
        if (state.turn !== 'player' || state.gameOver) return;
        dispatch({ type: 'PLACE_DIE', columnIndex: colIndex });
    };

    const handleRestart = () => {
        dispatch({ type: 'START_GAME' });
    };

    if (!mounted) return null;

    const playerScore = calculateTotalScore(state.playerBoard);
    const cpuScore = calculateTotalScore(state.cpuBoard);

    return (
        <div className="flex flex-col items-center max-w-2xl mx-auto p-4 md:p-8 min-h-[700px]">

            {/* Header / Game Info */}
            <div className="w-full flex justify-between items-center mb-6">
                {/* Difficulty Selector */}
                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                    {(['Easy', 'Hard'] as Difficulty[]).map(d => (
                        <button
                            key={d}
                            onClick={() => setDifficulty(d)}
                            className={`
                                px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all
                                ${difficulty === d
                                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}
                            `}
                        >
                            {d}
                        </button>
                    ))}
                </div>

                {/* Turn Indicator */}
                <div className={`
                    text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border
                    ${state.gameOver ? 'opacity-0' : 'opacity-100'}
                    ${state.turn === 'player'
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-900'
                        : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}
                 `}>
                    {state.turn === 'player' ? 'Your Turn' : 'Opponent Thinking...'}
                </div>
            </div>

            {/* CPU Area */}
            <div className="w-full mb-4">
                <div className="flex justify-between items-end mb-3 px-2">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Opponent</div>
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">Score: {cpuScore}</div>
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800 items-end">
                    {Array.from({ length: COLS }).map((_, colIdx) => {
                        const colScore = calculateColumnScore(state.cpuBoard[colIdx]);
                        // Always render 3 slots. CPU fills from bottom (index 0).
                        const slots = [0, 1, 2].map(slotIdx => state.cpuBoard[colIdx][slotIdx]);

                        return (
                            <div key={`cpu-col-${colIdx}`} className="flex flex-col-reverse items-center justify-start gap-2 relative w-full bg-white/50 dark:bg-black/20 rounded-xl py-4 transition-colors">
                                <div className="text-xs text-slate-400 font-mono font-bold mt-1">{colScore > 0 ? colScore : '-'}</div>
                                {slots.map((val, i) => (
                                    <div key={i} className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                                        {val !== undefined ? (
                                            <Die value={val} className="animate-pop-in shadow-sm" />
                                        ) : (
                                            <div className="w-full h-full rounded-xl border-2 border-dashed border-slate-300/50 dark:border-slate-700/50" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Game Status / Current Roll */}
            <div className="flex items-center justify-center h-28 my-2 w-full relative z-10">
                {state.gameOver ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-800 p-6 animate-in zoom-in duration-300 shadow-xl">
                        <div className="text-4xl font-black mb-4 tracking-tight">
                            {state.winner === 'player' ? <span className="text-green-500 drop-shadow-sm">YOU WIN!</span> :
                                state.winner === 'cpu' ? <span className="text-red-500 drop-shadow-sm">YOU LOST</span> :
                                    <span className="text-slate-500">DRAW</span>}
                        </div>
                        <button
                            onClick={handleRestart}
                            className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <span>↻</span> Play Again
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                            {state.turn === 'player' ? 'Place this die' : 'Rolling...'}
                        </div>
                        <div className={`transition-all duration-300 ${state.turn === 'cpu' ? 'opacity-50 scale-90 grayscale' : 'scale-110 drop-shadow-xl'}`}>
                            <Die value={state.currentRoll} className="border-primary dark:border-primary shadow-lg ring-4 ring-primary/10 dark:ring-primary/20" />
                        </div>
                    </div>
                )}
            </div>

            {/* Player Area */}
            <div className={`w-full transition-opacity duration-300 ${state.turn !== 'player' ? 'opacity-90' : ''}`}>
                <div className="grid grid-cols-3 gap-3 md:gap-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800 items-start cursor-pointer">
                    {Array.from({ length: COLS }).map((_, colIdx) => {
                        const colScore = calculateColumnScore(state.playerBoard[colIdx]);
                        const isFull = state.playerBoard[colIdx].length >= MAX_PER_COL;
                        const canPlace = state.turn === 'player' && !isFull && !state.gameOver;

                        // Always render 3 slots. Player now fills from top (index 0 at top).
                        const slots = [0, 1, 2].map(slotIdx => state.playerBoard[colIdx][slotIdx]);

                        return (
                            <button
                                key={`p-col-${colIdx}`}
                                onClick={() => handleColumnClick(colIdx)}
                                disabled={!canPlace}
                                className={`
                                    flex flex-col items-center justify-start gap-2 relative rounded-xl transition-all duration-200 w-full py-4 group
                                    ${canPlace ? 'bg-white hover:bg-white hover:shadow-md hover:-translate-y-1 dark:bg-slate-800 dark:hover:bg-slate-700' : 'bg-slate-200/50 dark:bg-slate-800/50 cursor-default'}
                                `}
                            >
                                <div className="text-xs text-slate-400 font-mono font-bold mb-1">{colScore > 0 ? colScore : '-'}</div>
                                {slots.map((val, i) => (
                                    <div key={i} className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                                        {val !== undefined ? (
                                            <Die value={val} className="animate-pop-in shadow-sm" />
                                        ) : (
                                            <div className={`w-full h-full rounded-xl border-2 border-dashed ${canPlace ? 'border-indigo-200 dark:border-indigo-900 group-hover:border-indigo-400' : 'border-slate-300/50 dark:border-slate-700/50'}`} />
                                        )}
                                    </div>
                                ))}
                            </button>
                        );
                    })}
                </div>
                <div className="flex justify-between items-start mt-4 px-2">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Player</div>
                    <div className="text-2xl font-bold text-primary dark:text-primary-hover">Score: {playerScore}</div>
                </div>
            </div>

        </div>
    );
}
