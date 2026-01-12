'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CalendarGrid from './components/CalendarGrid';
import { OptimizerEngine, OptimizerConfig, DayType, OptimizedResult } from './optimizer';

// Initial config defaults
const DEFAULT_CONFIG: OptimizerConfig = {
    totalLeaves: 20,
    startDateIdx: 0
};

const YEAR = 2026;

// Helper to expand a segment into a full streak range (dates)
const getFullStreakRange = (segment: any, dayData: Map<string, DayType>, dateList: string[]): { start: string, end: string, length: number } => {
    // Expand backwards
    let start = segment.startIdx;
    while (start > 0) {
        const prevParams = dayData.get(dateList[start - 1]);
        // Free OR Mandatory are parts of streaks
        if (prevParams === DayType.FREE || prevParams === DayType.MANDATORY) {
            start--;
        } else {
            break;
        }
    }

    // Expand forwards
    let end = segment.endIdx;
    while (end < dateList.length - 1) {
        const nextParams = dayData.get(dateList[end + 1]);
        if (nextParams === DayType.FREE || nextParams === DayType.MANDATORY) {
            end++;
        } else {
            break;
        }
    }

    return {
        start: dateList[start],
        end: dateList[end],
        length: end - start + 1
    };
};

export default function HolidayOptimizerContainer() {
    const [config, setConfig] = useState<OptimizerConfig>(DEFAULT_CONFIG);
    const [startDateStr, setStartDateStr] = useState(`${YEAR}-01-01`);
    const [dayData, setDayData] = useState<Map<string, DayType>>(new Map());
    const [result, setResult] = useState<OptimizedResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Initialize calendar
    useEffect(() => {
        const initialMap = new Map<string, DayType>();
        const start = new Date(Date.UTC(YEAR, 0, 1));
        const end = new Date(Date.UTC(YEAR + 1, 0, 0));

        for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
            const str = d.toISOString().split('T')[0];
            const dayOfWeek = d.getUTCDay(); // 0=Sun, 6=Sat

            if (dayOfWeek === 0 || dayOfWeek === 6) {
                initialMap.set(str, DayType.FREE);
            } else {
                initialMap.set(str, DayType.WORK);
            }
        }
        setDayData(initialMap);
    }, []);

    const handleDayClick = useCallback((dateStr: string) => {
        setDayData(prev => {
            const next = new Map(prev);
            const current = next.get(dateStr) ?? DayType.WORK;
            // Cycle: WORK -> FREE -> MANDATORY -> WORK
            // Replaces Blackout with Mandatory (User selected leave)
            let newVal = DayType.WORK;
            if (current === DayType.WORK) newVal = DayType.FREE;
            else if (current === DayType.FREE) newVal = DayType.MANDATORY;
            else newVal = DayType.WORK;

            next.set(dateStr, newVal);
            return next;
        });
        setResult(null);
    }, []);

    const runOptimization = () => {
        setIsCalculating(true);
        setTimeout(() => {
            try {
                const days: DayType[] = [];
                const start = new Date(Date.UTC(YEAR, 0, 1));
                const end = new Date(Date.UTC(YEAR + 1, 0, 0));

                let idx = 0;
                let calculatedStartIdx = 0;

                for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
                    const str = d.toISOString().split('T')[0];
                    if (str === startDateStr) {
                        calculatedStartIdx = idx;
                    }
                    days.push(dayData.get(str) ?? DayType.WORK);
                    idx++;
                }

                const engine = new OptimizerEngine(days, { ...config, startDateIdx: calculatedStartIdx });
                const res = engine.solve();
                setResult(res);
            } catch (e) {
                console.error("Optimization failed", e);
            } finally {
                setIsCalculating(false);
            }
        }, 50);
    };

    const highlights = React.useMemo(() => {
        const dateList: string[] = [];
        const start = new Date(Date.UTC(YEAR, 0, 1));
        const end = new Date(Date.UTC(YEAR + 1, 0, 0));
        for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
            dateList.push(d.toISOString().split('T')[0]);
        }

        const highlightMap: { start: string; end: string; color: string }[] = [];

        // Add Mandatory leaves to visualization even if not optimizing?
        // No, result includes them as segments.
        // But before result, we need to see them visually.
        // The dayData coloring handles visual state (Work/Free/Mandatory).
        // CalendarGrid needs to support coloring Mandatory.
        // But highlights sit on top.

        // If we have result, show optimized segments atop.
        if (result) {
            result.segments.forEach(seg => {
                for (let i = seg.startIdx; i <= seg.endIdx; i++) {
                    const dayStr = dateList[i];
                    const dayType = dayData.get(dayStr);

                    let color = '#a855f7'; // Purple (Generated Leave)

                    if (seg.type === 'MANDATORY') {
                        color = '#db2777'; // Pink (User Forced Leave)
                    } else if (dayType === DayType.FREE) {
                        color = '#10b981'; // Emerald (Weekend part)
                    }

                    highlightMap.push({ start: dayStr, end: dayStr, color: color });
                }
            });
        }

        // Also: We must visualize MANDATORY days even if no result is present! 
        // Or if they are not in segments (shouldn't happen, solve() catches them).
        // CalendarGrid default rendering handles "types", so we need to ensure CalendarGrid renders 'MANDATORY' distinct from Work/Free?
        // Currently Grid only knows Work/Free via default props? checking Grid implementation...
        // Actually, we pass dayData to the grid. The grid likely uses dayData to color basic cells.
        // We should ensure the GRID component knows to color MANDATORY days if highlights are null.
        // But wait, the previous implementation used highlights for everything except basic Work/Free.
        // Let's create a 'base' highlight for Mandatory days if no result exists.

        if (!result) {
            dayData.forEach((type, dateStr) => {
                if (type === DayType.MANDATORY) {
                    highlightMap.push({ start: dateStr, end: dateStr, color: '#db2777' });
                }
            });
        }

        return highlightMap;
    }, [result, dayData]);

    const allDates = React.useMemo(() => {
        const dateList: string[] = [];
        const start = new Date(Date.UTC(YEAR, 0, 1));
        const end = new Date(Date.UTC(YEAR + 1, 0, 0));
        for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
            dateList.push(d.toISOString().split('T')[0]);
        }
        return dateList;
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            {/* How it Works */}
            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-2 uppercase tracking-wide">How It Works</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    This planner helps you get the most out of your annual leave. It first looks for opportunities to <strong>bridge holidays</strong> — for example, if there's a Wednesday holiday, taking Thursday and Friday off gives you a 5-day break.
                    Then, it spreads your remaining leaves throughout the year to create 3-day weekends, spaced as evenly as possible so you have breaks all year round.
                </p>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-6 w-full">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                                Total Leaves
                            </label>
                            <input
                                type="number"
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-md px-3 py-2 font-mono text-sm"
                                value={config.totalLeaves}
                                onChange={e => setConfig({ ...config, totalLeaves: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                                Planning Start Date
                            </label>
                            <input
                                type="date"
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-md px-3 py-2 font-mono text-sm"
                                value={startDateStr}
                                min={`${YEAR}-01-01`}
                                max={`${YEAR}-12-31`}
                                onChange={e => setStartDateStr(e.target.value)}
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                                Ignore days before this date.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={runOptimization}
                        disabled={isCalculating}
                        className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isCalculating ? 'Computing...' : 'Find Long Weekends'}
                    </button>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-4">Optimization Results</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                            <span className="text-slate-500 text-xs uppercase font-bold">Long Weekends Found</span>
                            <div className="text-2xl font-black text-slate-800 dark:text-white">{result.score}</div>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                            <span className="text-slate-500 text-xs uppercase font-bold">Leaves Used</span>
                            <div className="text-2xl font-black text-slate-800 dark:text-white">
                                {result.segments.reduce((acc, s) => acc + s.leavesUsed, 0)} / {config.totalLeaves}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar & Legend */}
            <div className="space-y-4">
                {result && (
                    <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-purple-500 shadow-sm"></div>
                            <span className="text-sm text-slate-600 dark:text-slate-300">Recommended Leave</span>
                        </div>
                    </div>
                )}

                <CalendarGrid
                    year={YEAR}
                    dayData={dayData}
                    onDayClick={handleDayClick}
                    highlightSegments={highlights}
                    isOptimized={!!result}
                />
            </div>
        </div>
    );
}
