import { Board, GameState } from './types';
import { MAX_PER_COL, calculateColumnScore } from './engine';

export type Difficulty = 'Easy' | 'Hard';

// Helper to simulate a move and see the result score gain
// This is a naive greedy AI.
// 1. Check if can destroy opponent dice (high priority).
// 2. Check if can match own dice for multiplier (secondary).
// 3. Otherwise pick random valid column.
export const getAiMove = (state: GameState, difficulty: Difficulty = 'Hard'): number => {
    const { cpuBoard, playerBoard, currentRoll } = state;

    const validCols: number[] = [];
    for (let c = 0; c < 3; c++) {
        if (cpuBoard[c].length < MAX_PER_COL) {
            validCols.push(c);
        }
    }

    // Easy: Pure Random
    if (difficulty === 'Easy') {
        if (validCols.length === 0) return 0; // Should not happen if game checks game over
        return validCols[Math.floor(Math.random() * validCols.length)];
    }

    // Hard: Greedy Heuristic
    let bestCol = -1;
    let maxScoreImpact = -Infinity;

    validCols.forEach(c => {
        // Heuristic Scoring
        let impact = 0;

        // Factor 1: Destruction (Weighted heavily)
        // If player has Dice == currentRoll in this column, we destroy them.
        const playerMatches = playerBoard[c].filter(d => d === currentRoll).length;
        if (playerMatches > 0) {
            // High priority for destruction
            impact += (playerMatches * currentRoll) * 10;
        }

        // Factor 2: Self Multiplier
        // If we have dice == currentRoll, we gain multiplier.
        const cpuMatches = cpuBoard[c].filter(d => d === currentRoll).length;
        if (cpuMatches > 0) {
            // Score increase logic
            const gain = currentRoll * (Math.pow(cpuMatches + 1, 2) - Math.pow(cpuMatches, 2));
            impact += gain;
        } else {
            impact += currentRoll;
        }

        if (impact > maxScoreImpact) {
            maxScoreImpact = impact;
            bestCol = c;
        } else if (impact === maxScoreImpact) {
            // Random tie-break
            if (Math.random() > 0.5) bestCol = c;
        }
    });

    return bestCol !== -1 ? bestCol : validCols[0];
};
