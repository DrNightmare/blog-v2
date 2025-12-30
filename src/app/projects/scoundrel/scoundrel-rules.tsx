import React from 'react';

export default function ScoundrelRules() {
    return (
        <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-8">

                {/* Introduction */}
                <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                    <h3 className="font-bold text-xl text-foreground mb-4">Objective</h3>
                    <p className="text-text-secondary leading-relaxed">
                        Clear all 44 cards from the dungeon deck. You start with <strong>20 HP</strong>.
                        If your health drops to zero, you lose.
                    </p>
                </div>

                {/* Core Mechanics Grid */}
                <div className="grid gap-6 md:grid-cols-2">

                    {/* The Room */}
                    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-bold">1</span>
                            The Room
                        </h3>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li>• You are dealt <strong>4 cards</strong> at a time.</li>
                            <li>• You must play <strong>3 of them</strong>.</li>
                            <li>• The last card begins the next room.</li>
                        </ul>
                    </div>

                    {/* Fleeing */}
                    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-bold">🏃</span>
                            Fleeing
                        </h3>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li>• If a room is full (4 cards), you can Flee.</li>
                            <li>• Cards go to the bottom of the deck.</li>
                            <li className="text-text-muted italic text-xs">Cannot flee twice in a row.</li>
                        </ul>
                    </div>
                </div>

                {/* Card Types */}
                <div className="space-y-6">
                    <h3 className="font-bold text-xl text-foreground px-2">Card Types</h3>

                    {/* Potions */}
                    <div className="bg-surface rounded-xl border border-border p-5 flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex flex-shrink-0 items-center justify-center text-xl">♥</div>
                        <div>
                            <h4 className="font-bold text-foreground mb-1">Health Potions</h4>
                            <p className="text-sm text-text-secondary mb-2">Restores HP equal to card value.</p>
                            <p className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded inline-block">
                                Limit: 1 potion per room
                            </p>
                        </div>
                    </div>

                    {/* Weapons */}
                    <div className="bg-surface rounded-xl border border-border p-5 flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex flex-shrink-0 items-center justify-center text-xl">♦</div>
                        <div>
                            <h4 className="font-bold text-foreground mb-1">Weapons</h4>
                            <p className="text-sm text-text-secondary mb-3">Equip to reduce monster damage.</p>
                            <div className="bg-background rounded-lg p-3 text-sm border border-border">
                                <span className="block font-semibold text-text-main mb-1 text-xs uppercase tracking-wide">The Chain Rule</span>
                                <p className="text-text-secondary text-xs leading-relaxed">
                                    Weapons dull after use. A weapon can only kill monsters <strong>weaker</strong> than the last one it slew.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Monsters */}
                    <div className="bg-surface rounded-xl border border-border p-5 flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex flex-shrink-0 items-center justify-center text-xl">♠</div>
                        <div>
                            <h4 className="font-bold text-foreground mb-1">Monsters</h4>
                            <p className="text-sm text-text-secondary mb-2">Deal damage equal to rank (J=11, Q=12, K=13, A=14).</p>
                            <div className="text-xs space-y-1 text-text-muted">
                                <p><span className="font-medium text-text-main">With Weapon:</span> Damage = Monster - Weapon</p>
                                <p><span className="font-medium text-text-main">Barehanded:</span> Damage = Full Monster Value</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
