export enum DayType {
    WORK = 0,
    FREE = 1, // Weekend or Holiday
    MANDATORY = 2 // User forced leave
}

export interface OptimizerConfig {
    totalLeaves: number;
    startDateIdx: number; // 0 to 365
}

export interface OptimizedResult {
    score: number; // Represents count of long weekends and bridges
    segments: ScheduleSegment[];
}

export interface ScheduleSegment {
    startIdx: number;
    endIdx: number; // inclusive
    type: 'WORK' | 'STREAK' | 'VACATION' | 'MANDATORY';
    leavesUsed: number;
    scoreContribution: number;
}

export class OptimizerEngine {
    private dayTypes: DayType[];
    private config: OptimizerConfig;

    constructor(dayTypes: DayType[], config: OptimizerConfig) {
        this.dayTypes = dayTypes;
        this.config = config;
    }

    public solve(): OptimizedResult {
        const segments: ScheduleSegment[] = [];
        let leavesLeft = this.config.totalLeaves;
        const takenIndices = new Set<number>();
        const startIdx = this.config.startDateIdx;

        // PHASE 0: Process User Mandatory Leaves
        // These are effectively "Taken" already, cost leaves, and act as anchors (Free)
        for (let i = 0; i < this.dayTypes.length; i++) {
            if (this.dayTypes[i] === DayType.MANDATORY) {
                // If the user selected a day, we MUST take it.
                // We consume a leave for it.
                leavesLeft--;
                takenIndices.add(i);
                segments.push({
                    startIdx: i,
                    endIdx: i,
                    type: 'MANDATORY',
                    leavesUsed: 1,
                    scoreContribution: 0 // Will be counted in final scan if part of a streak
                });
            }
        }

        // Helper: Check if index is valid and taken
        const isTaken = (idx: number) => takenIndices.has(idx);

        // Helper to check day type (considering taken as FREE for logic connectivity?)
        const isFree = (idx: number): boolean => {
            if (idx < 0 || idx >= this.dayTypes.length) return false;
            // It is free if it's naturally free OR if we took it (Mandatory or Generated).
            return this.dayTypes[idx] === DayType.FREE || isTaken(idx);
        };

        const isWork = (idx: number): boolean => {
            if (idx < 0 || idx >= this.dayTypes.length) return false;
            // Work is Work AND NOT Taken
            return this.dayTypes[idx] === DayType.WORK && !isTaken(idx);
        };

        // PHASE 1: Bridge Opportunities (Greedy)
        // Find existing FREE days. Look ahead.
        // If we see GAP of size 1 or 2 WORK days followed by FREE, take them.

        // We iterate through every day starting from startIdx
        for (let i = startIdx; i < this.dayTypes.length; i++) {
            if (leavesLeft <= 0) break;

            if (isFree(i)) {
                // Check forward for bridge
                // Possible patterns:
                // Free(i) - Work(i+1) - Free(i+2) [Gap 1]
                // Free(i) - Work(i+1) - Work(i+2) - Free(i+3) [Gap 2]

                // Gap 1 Check
                if (isWork(i + 1) && isFree(i + 2)) {
                    if (leavesLeft >= 1) {
                        // Take i+1
                        leavesLeft--;
                        takenIndices.add(i + 1);
                        segments.push({
                            startIdx: i + 1,
                            endIdx: i + 1,
                            type: 'VACATION',
                            leavesUsed: 1,
                            scoreContribution: 2 // High value for bridge
                        });
                        continue;
                    }
                }

                // Gap 2 Check
                if (isWork(i + 1) && isWork(i + 2) && isFree(i + 3)) {
                    if (leavesLeft >= 2) {
                        // Take i+1, i+2
                        leavesLeft -= 2;
                        takenIndices.add(i + 1);
                        takenIndices.add(i + 2);
                        segments.push({
                            startIdx: i + 1,
                            endIdx: i + 2,
                            type: 'VACATION',
                            leavesUsed: 2,
                            scoreContribution: 3 // Higher value
                        });
                    }
                }
            }
        }

        // PHASE 2: Spaced Friday Extensions
        // Identify Candidates: Work(Fri) where Sat/Sun are Free.
        // AND Fri is not already taken

        const candidates: number[] = [];
        const startDayOffset = 4; // Jan 1 2026 is Thu

        for (let i = startIdx; i < this.dayTypes.length; i++) {
            const currentDayOfWeek = (i + startDayOffset) % 7;

            if (currentDayOfWeek === 5) { // Friday
                if (isWork(i) && !isTaken(i)) {
                    // Check adjacents
                    // Sat (i+1) must be Free
                    // Sun (i+2) must be Free
                    if (isFree(i + 1) && isFree(i + 2)) {
                        candidates.push(i);
                    }
                }
            }
        }

        const k = Math.min(candidates.length, leavesLeft);

        if (k > 0) {
            // Aggressive Cows / Binary Search for optimal gap
            let low = 1;
            let high = this.dayTypes.length - startIdx; // Gap relative to remaining space
            let bestGap = 1;

            const canPlace = (minGap: number): boolean => {
                let count = 1;
                let lastPos = candidates[0];
                for (let i = 1; i < candidates.length; i++) {
                    if (candidates[i] - lastPos >= minGap) {
                        count++;
                        lastPos = candidates[i];
                    }
                    if (count >= k) return true;
                }
                return false;
            };

            if (k > 1) {
                while (low <= high) {
                    const mid = Math.floor((low + high) / 2);
                    if (canPlace(mid)) {
                        bestGap = mid;
                        low = mid + 1;
                    } else {
                        high = mid - 1;
                    }
                }
            }

            // Select
            let count = 0;
            let lastPos = -Infinity; // Ensure first is picked if valid

            for (let i = 0; i < candidates.length; i++) {
                if (count >= k) break;
                // For first item, lastPos is -Inf, diff is Inf >= bestGap. true.
                if (candidates[i] - lastPos >= bestGap) {
                    leavesLeft--;
                    takenIndices.add(candidates[i]);
                    segments.push({
                        startIdx: candidates[i],
                        endIdx: candidates[i],
                        type: 'VACATION',
                        leavesUsed: 1,
                        scoreContribution: 1
                    });
                    lastPos = candidates[i];
                    count++;
                }
            }
        }

        // Final Score Calculation: Count distinct long weekend blocks within range
        let longWeekendCount = 0;
        let currentStreak = 0;

        for (let i = startIdx; i < this.dayTypes.length; i++) {
            if (isFree(i)) {
                currentStreak++;
            } else {
                if (currentStreak >= 3) {
                    longWeekendCount++;
                }
                currentStreak = 0;
            }
        }
        // Check last Streak
        if (currentStreak >= 3) {
            longWeekendCount++;
        }

        segments.sort((a, b) => a.startIdx - b.startIdx);

        return { score: longWeekendCount, segments };
    }
}
