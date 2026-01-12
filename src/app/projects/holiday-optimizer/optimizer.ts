export enum DayType {
    WORK = 0,
    FREE = 1, // Weekend or Holiday
    MANDATORY = 2 // User forced leave
}

export interface OptimizerConfig {
    totalLeaves: number;
    startDateIdx: number;
    minGap: number; // Minimum days between vacation end and next vacation start
}

export interface OptimizedResult {
    score: number; // Total score achieved
    segments: ScheduleSegment[];
}

export interface ScheduleSegment {
    startIdx: number;
    endIdx: number;
    type: 'WORK' | 'STREAK' | 'VACATION' | 'MANDATORY';
    leavesUsed: number;
    scoreContribution: number;
}

export class OptimizerEngine {
    private dayTypes: DayType[];
    private config: OptimizerConfig;
    private workDays: number[]; // Prefix sum for O(1) cost calculation
    private dp: number[][]; // DP[day][leaves] = max score
    private choice: (null | { start: number; end: number })[][]; // For reconstruction

    constructor(dayTypes: DayType[], config: OptimizerConfig) {
        this.dayTypes = dayTypes;
        this.config = config;

        // Build prefix sum array for work days
        this.workDays = new Array(dayTypes.length + 1).fill(0);
        for (let i = 0; i < dayTypes.length; i++) {
            this.workDays[i + 1] = this.workDays[i] + (dayTypes[i] === DayType.WORK ? 1 : 0);
        }

        // Initialize DP table
        this.dp = Array(dayTypes.length + 1).fill(null).map(() =>
            Array(config.totalLeaves + 1).fill(-1)
        );
        this.choice = Array(dayTypes.length + 1).fill(null).map(() =>
            Array(config.totalLeaves + 1).fill(null)
        );
    }

    private getUtility(length: number): number {
        if (length < 3) return 0;
        if (length === 3) return 10;
        if (length === 4) return 25;  // Big jump
        if (length === 5) return 45;  // Massive jump
        return 45 + (length - 5);     // Diminishing returns for 6+
    }

    private getCost(start: number, end: number): number {
        // O(1) cost calculation using prefix sum
        return this.workDays[end + 1] - this.workDays[start];
    }

    public solve(): OptimizedResult {
        const segments: ScheduleSegment[] = [];
        let leavesLeft = this.config.totalLeaves;
        const takenIndices = new Set<number>();
        const startIdx = this.config.startDateIdx;

        // PHASE 0: Process User Mandatory Leaves
        for (let i = 0; i < this.dayTypes.length; i++) {
            if (this.dayTypes[i] === DayType.MANDATORY) {
                leavesLeft--;
                takenIndices.add(i);
                segments.push({
                    startIdx: i,
                    endIdx: i,
                    type: 'MANDATORY',
                    leavesUsed: 1,
                    scoreContribution: 0
                });
            }
        }

        // Initialize DP base case (only from startIdx onward)
        for (let day = 0; day <= startIdx; day++) {
            for (let leaves = 0; leaves <= this.config.totalLeaves; leaves++) {
                this.dp[day][leaves] = 0;
            }
        }

        // DP Phase: Fill the table from startIdx onward
        for (let day = startIdx + 1; day <= this.dayTypes.length; day++) {
            for (let leaves = 0; leaves <= leavesLeft; leaves++) {
                // Option 1: Work today (copy from yesterday)
                this.dp[day][leaves] = this.dp[day - 1][leaves];
                this.choice[day][leaves] = null;

                // Option 2: End a vacation today
                // Try all possible start dates (limit to 30 days back to allow long vacations)
                const maxLookback = Math.min(30, day);
                for (let lookback = 1; lookback <= maxLookback; lookback++) {
                    const start = day - lookback;

                    // Crucial: Vacation cannot start before the planning start date
                    if (start < startIdx) continue;

                    const length = lookback;
                    const cost = this.getCost(start, day - 1);

                    // Can we afford it?
                    if (cost > leaves) continue;

                    const remainingLeaves = leaves - cost;

                    // Apply cooldown: look back MIN_GAP days before vacation start
                    const prevIdx = start - this.config.minGap;
                    let prevScore = 0;

                    if (prevIdx >= 0) {
                        prevScore = this.dp[prevIdx][remainingLeaves];
                        if (prevScore === -1) continue; // Invalid state
                    }

                    const vacationScore = this.getUtility(length) + prevScore;

                    if (vacationScore > this.dp[day][leaves]) {
                        this.dp[day][leaves] = vacationScore;
                        this.choice[day][leaves] = { start, end: day - 1 };
                    }
                }
            }
        }

        // Reconstruct solution using the leaf count that gave the best score
        let bestLeaves = leavesLeft;
        let maxScore = -1;

        // Find optimal leaf usage (sometimes using fewer leaves gives same score, but we want max score)
        // Iterate backwards to prefer using MORE leaves if scores are tied
        for (let l = leavesLeft; l >= 0; l--) {
            if (this.dp[this.dayTypes.length][l] > maxScore) {
                maxScore = this.dp[this.dayTypes.length][l];
                bestLeaves = l;
            }
        }

        const vacationSegments = this.reconstruct(bestLeaves, takenIndices);
        segments.push(...vacationSegments);

        // Sort segments by start index
        segments.sort((a, b) => a.startIdx - b.startIdx);

        // Count actual long weekends (3+ consecutive free days)
        const longWeekendCount = this.countLongWeekends(takenIndices);
        return { score: longWeekendCount, segments };
    }

    private countLongWeekends(takenIndices: Set<number>): number {
        let count = 0;
        let streak = 0;
        const startIdx = this.config.startDateIdx;

        for (let i = startIdx; i < this.dayTypes.length; i++) {
            const isFree = this.dayTypes[i] === DayType.FREE || takenIndices.has(i);

            if (isFree) {
                streak++;
            } else {
                if (streak >= 3) {
                    count++;
                }
                streak = 0;
            }
        }

        // Check final streak
        if (streak >= 3) {
            count++;
        }

        return count;
    }

    private reconstruct(leavesLeft: number, takenIndices: Set<number>): ScheduleSegment[] {
        const segments: ScheduleSegment[] = [];
        let currentDay = this.dayTypes.length;
        let currentLeaves = leavesLeft;
        const startIdx = this.config.startDateIdx;

        while (currentDay > startIdx) {
            const choiceHere = this.choice[currentDay][currentLeaves];

            if (!choiceHere) {
                // No vacation ending here, move back
                currentDay--;
            } else {
                // Found a vacation
                const { start, end } = choiceHere;

                // Skip if vacation starts before startIdx
                if (start < startIdx) {
                    currentDay--;
                    continue;
                }

                const length = end - start + 1;
                let leavesUsed = 0;

                // Mark days as taken and count leaves used
                for (let i = start; i <= end; i++) {
                    if (this.dayTypes[i] === DayType.WORK && !takenIndices.has(i)) {
                        takenIndices.add(i);
                        leavesUsed++;
                    }
                }

                segments.push({
                    startIdx: start,
                    endIdx: end,
                    type: 'VACATION',
                    leavesUsed,
                    scoreContribution: this.getUtility(length)
                });

                // Move to before this vacation with cooldown
                currentDay = start - this.config.minGap;
                currentLeaves -= leavesUsed;
            }
        }

        return segments.reverse();
    }
}
