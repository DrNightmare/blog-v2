'use client';

import React, { useState } from 'react';
import ScoundrelGame from './scoundrel-game';
import ScoundrelRules from './scoundrel-rules';

export default function ScoundrelContainer() {
    const [activeTab, setActiveTab] = useState<'game' | 'rules'>('game');

    return (
        <div className="w-full max-w-4xl mx-auto">

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
                <div className="bg-surface border border-border p-1 rounded-xl inline-flex shadow-sm">
                    <button
                        onClick={() => setActiveTab('game')}
                        className={`
                            px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${activeTab === 'game'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-text-secondary hover:text-foreground hover:bg-slate-50 dark:hover:bg-white/5'}
                        `}
                    >
                        Play Game
                    </button>
                    <button
                        onClick={() => setActiveTab('rules')}
                        className={`
                            px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${activeTab === 'rules'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-text-secondary hover:text-foreground hover:bg-slate-50 dark:hover:bg-white/5'}
                        `}
                    >
                        Rules
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">
                {activeTab === 'game' ? (
                    <ScoundrelGame />
                ) : (
                    <ScoundrelRules />
                )}
            </div>
        </div>
    );
}
