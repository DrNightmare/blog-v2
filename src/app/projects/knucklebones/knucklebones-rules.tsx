import React from 'react';

export default function KnucklebonesRules() {
    return (
        <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-8">

                {/* Introduction */}
                <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                    <h3 className="font-bold text-xl text-foreground mb-4">Objective</h3>
                    <p className="text-text-secondary leading-relaxed">
                        Fill your board with dice to end the game. The player with the <strong>highest score</strong> wins.
                    </p>
                </div>

                {/* Core Mechanics Grid */}
                <div className="grid gap-6 md:grid-cols-2">

                    {/* Scoring */}
                    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-bold">1</span>
                            Multipliers
                        </h3>
                        <p className="text-sm text-text-secondary mb-2">
                            Dice of the same value in a column multiply their score!
                        </p>
                        <div className="text-xs bg-slate-100 dark:bg-slate-900 rounded p-2 font-mono space-y-1 text-text-muted">
                            <p>[4] = 4 pts</p>
                            <p>[4, 4] = (4+4) × 2 = 16 pts</p>
                            <p>[4, 4, 4] = (4+4+4) × 3 = 36 pts</p>
                        </div>
                    </div>

                    {/* Destruction */}
                    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">💥</span>
                            Destruction
                        </h3>
                        <div className="space-y-2 text-sm text-text-secondary">
                            <p>Place a die to <strong>destroy</strong> all opponent dice of the same value in that column.</p>
                            <p className="text-text-muted italic text-xs">This is the best way to reduce their score!</p>
                        </div>
                    </div>
                </div>

                {/* Game End */}
                <div className="bg-surface rounded-xl border border-border p-5">
                    <h3 className="font-bold text-lg text-foreground mb-2">Game End</h3>
                    <p className="text-sm text-text-secondary">
                        The game ends immediately when <strong>one player fills all 9 slots</strong> on their board.
                    </p>
                </div>

            </div>
        </div>
    );
}
