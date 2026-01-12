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

interface Cluster {
    start: number;
    end: number;
}

interface BridgeOpportunity {
    gapStart: number;
    gapEnd: number;
    gapSize: number;
    totalStreak: number;
    efficiency: number;
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

        // Helpers
        const isTaken = (idx: number) => takenIndices.has(idx);

        const isFree = (idx: number): boolean => {
            if (idx < 0 || idx >= this.dayTypes.length) return false;
            return this.dayTypes[idx] === DayType.FREE || isTaken(idx);
        };

        const isWork = (idx: number): boolean => {
            if (idx < 0 || idx >= this.dayTypes.length) return false;
            return this.dayTypes[idx] === DayType.WORK && !isTaken(idx);
        };

        // PHASE 1: Bidirectional Bridge Opportunities

        // Step 1: Find all FREE clusters (O(n) single pass)
        const clusters: Cluster[] = [];
        let inCluster = false;
        let clusterStart = 0;

        for (let i = startIdx; i < this.dayTypes.length; i++) {
            if (isFree(i)) {
                if (!inCluster) {
                    clusterStart = i;
                    inCluster = true;
                }
            } else {
                if (inCluster) {
                    clusters.push({ start: clusterStart, end: i - 1 });
                    inCluster = false;
                }
            }
        }
        // Catch last cluster
        if (inCluster) {
            clusters.push({ start: clusterStart, end: this.dayTypes.length - 1 });
        }

        // Step 2: Identify bridge opportunities between clusters (O(m) where m = clusters)
        const bridges: BridgeOpportunity[] = [];

        for (let i = 0; i < clusters.length - 1; i++) {
            const gapStart = clusters[i].end + 1;
            const gapEnd = clusters[i + 1].start - 1;
            const gapSize = gapEnd - gapStart + 1;

            // Only bridge gaps of size 1 or 2 (efficient bridges)
            if (gapSize >= 1 && gapSize <= 2) {
                // Check if gap contains only WORK days (no MANDATORY that are already taken)
                let isValidGap = true;
                for (let j = gapStart; j <= gapEnd; j++) {
                    if (!isWork(j)) {
                        isValidGap = false;
                        break;
                    }
                }

                if (isValidGap) {
                    const totalStreak = clusters[i + 1].end - clusters[i].start + 1;
                    const efficiency = totalStreak / gapSize;

                    bridges.push({
                        gapStart,
                        gapEnd,
                        gapSize,
                        totalStreak,
                        efficiency
                    });
                }
            }
        }

        // Step 3: Sort by efficiency descending (O(b log b) where b = bridges)
        bridges.sort((a, b) => b.efficiency - a.efficiency);

        // Step 4: Greedily select best bridges (O(b))
        for (const bridge of bridges) {
            if (leavesLeft >= bridge.gapSize) {
                // Take all days in the gap
                for (let i = bridge.gapStart; i <= bridge.gapEnd; i++) {
                    takenIndices.add(i);
                    leavesLeft--;
                }

                segments.push({
                    startIdx: bridge.gapStart,
                    endIdx: bridge.gapEnd,
                    type: 'VACATION',
                    leavesUsed: bridge.gapSize,
                    scoreContribution: bridge.gapSize === 1 ? 2 : 3
                });
            }
        }

        // PHASE 2: Spaced Friday Extensions
        const candidates: number[] = [];
        const startDayOffset = 4; // Jan 1 2026 is Thu

        for (let i = startIdx; i < this.dayTypes.length; i++) {
            const currentDayOfWeek = (i + startDayOffset) % 7;

            if (currentDayOfWeek === 5) { // Friday
                if (isWork(i) && !isTaken(i)) {
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
            let high = this.dayTypes.length - startIdx;
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
            let lastPos = -Infinity;

            for (let i = 0; i < candidates.length; i++) {
                if (count >= k) break;
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
        if (currentStreak >= 3) {
            longWeekendCount++;
        }

        segments.sort((a, b) => a.startIdx - b.startIdx);

        return { score: longWeekendCount, segments };
    }
}
