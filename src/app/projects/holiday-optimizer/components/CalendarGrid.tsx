'use client';

import React, { useMemo } from 'react';
import { DayType } from '../optimizer';

interface CalendarGridProps {
    year: number;
    dayData: Map<string, DayType>;
    onDayClick: (dateStr: string) => void;
    highlightSegments?: { start: string; end: string; color: string }[];
    isOptimized?: boolean;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarGrid({ year, dayData, onDayClick, highlightSegments, isOptimized }: CalendarGridProps) {
    const calendar = useMemo(() => {
        const months = [];
        for (let m = 0; m < 12; m++) {
            // UTC safe way to get days in month
            // Date.UTC(year, m + 1, 0) gives last day of month m
            const daysInMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();

            // Start day of week (0=Sun)
            const startDay = new Date(Date.UTC(year, m, 1)).getUTCDay();
            const days = [];

            // Padding
            for (let i = 0; i < startDay; i++) {
                days.push(null);
            }

            // Days
            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                days.push(dateStr);
            }
            months.push(days);
        }
        return months;
    }, [year]);

    // Fast check for highlights
    const highlights = useMemo(() => {
        const map = new Map<string, string>();
        if (!highlightSegments) return map;

        highlightSegments.forEach(seg => {
            // Already computed day-by-day in parent? 
            // The container now passes granular segments [string, string] where start==end?
            // Actually, wait. Container highlight logic passes single-day segments now!
            // So start == end.

            // We can just rely on string equality, no need to iterate dates if start==end.
            if (seg.start === seg.end) {
                map.set(seg.start, seg.color);
            } else {
                // Fallback if we still get ranges
                const [y1, m1, d1] = seg.start.split('-').map(Number);
                const [y2, m2, d2] = seg.end.split('-').map(Number);

                const curr = new Date(Date.UTC(y1, m1 - 1, d1));
                const end = new Date(Date.UTC(y2, m2 - 1, d2));

                while (curr <= end) {
                    const year = curr.getUTCFullYear();
                    const month = curr.getUTCMonth() + 1;
                    const day = curr.getUTCDate();
                    const str = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                    map.set(str, seg.color);
                    curr.setUTCDate(curr.getUTCDate() + 1);
                }
            }
        });
        return map;
    }, [highlightSegments]);

    const getDayInfo = (dateStr: string) => {
        const type = dayData.get(dateStr) ?? DayType.WORK;
        const highlight = highlights.get(dateStr);

        let tooltip = '';
        let className = '';
        let style = {};

        if (highlight) {
            className = 'text-white font-bold';
            style = { backgroundColor: highlight };

            // Determine tooltip based on highlight color
            if (highlight === '#db2777') {
                tooltip = 'Custom Leave';
            } else if (highlight === '#a855f7') {
                tooltip = 'Recommended Leave';
            } else if (highlight === '#10b981') {
                tooltip = 'Holiday/Weekend';
            }
        } else {
            // No highlight, use base type
            switch (type) {
                case DayType.MANDATORY:
                    className = 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400';
                    tooltip = 'Custom Leave';
                    break;
                case DayType.FREE:
                    className = 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400';
                    tooltip = 'Holiday/Weekend';
                    break;
                case DayType.WORK:
                default:
                    className = 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800';
                    tooltip = '';
                    break;
            }
        }

        return { className, style, tooltip };
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 select-none">
            {MONTHS.map((month, monthIdx) => (
                <div key={month} className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{month}</h3>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <span key={d} className="text-slate-300 dark:text-slate-600 font-medium py-1">{d}</span>
                        ))}
                        {calendar[monthIdx].map((dateStr, idx) => {
                            if (!dateStr) return <div key={`pad-${idx}`} />;

                            const info = getDayInfo(dateStr);

                            return (
                                <div
                                    key={dateStr}
                                    onClick={() => onDayClick(dateStr)}
                                    className={`
                                        aspect-square flex items-center justify-center rounded cursor-pointer transition-colors relative group
                                        ${info.className}
                                    `}
                                    style={info.style}
                                >
                                    {parseInt(dateStr.split('-')[2])}
                                    {info.tooltip && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            {info.tooltip}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
