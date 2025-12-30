import { Board, GameAction, GameState, PlayerType } from './types';

// Constants
export const COLS = 3;
export const MAX_PER_COL = 3;

// --- Helpers ---

export const rollDie = () => Math.floor(Math.random() * 6) + 1;

export const createEmptyBoard = (): Board => Array.from({ length: COLS }, () => []);

// Scoring Logic: Sum of dice. If duplicates exist in a column, add sum of duplicates * count.
// Example: [4, 4, 1] -> (4+4)*2 + 1 = 16 + 1 = 17
// Wait, typically Knucklebones rule is: X * N^2. 
// Standard rules: Sum of dice. If multiple dice have same value X, their value is X * Count * Count.
// Example: [4, 4] -> 4 * 2 * 2 = 16. [4, 4, 4] -> 4 * 3 * 3 = 36.
// Let's use this standard multiplier rule.
export const calculateColumnScore = (col: number[]): number => {
    const counts: Record<number, number> = {};
    col.forEach(val => counts[val] = (counts[val] || 0) + 1);

    let score = 0;
    Object.entries(counts).forEach(([valStr, count]) => {
        const val = parseInt(valStr);
        score += val * count * count;
    });
    return score;
};

export const calculateTotalScore = (board: Board): number => {
    return board.reduce((acc, col) => acc + calculateColumnScore(col), 0);
};

export const isBoardFull = (board: Board): boolean => {
    return board.every(col => col.length >= MAX_PER_COL);
};

// --- Engine ---

export const getInitialState = (): GameState => ({
    playerBoard: createEmptyBoard(),
    cpuBoard: createEmptyBoard(),
    turn: Math.random() < 0.5 ? 'player' : 'cpu',
    currentRoll: rollDie(),
    gameOver: false,
    winner: null,
    logs: ['Game Start!']
});

export const gameReducer = (state: GameState, action: GameAction): GameState => {

    switch (action.type) {
        case 'START_GAME':
            const newState = getInitialState();
            // If CPU starts, we might need to handle it outside reducer or have an effect trigger it. 
            // For pure reducer, we just set state. The UI/Effect hook handles CPU move triggering.
            return {
                ...newState,
                logs: [`Game Started! ${newState.turn === 'player' ? 'Player' : 'CPU'} goes first with a ${newState.currentRoll}.`]
            };

        case 'PLACE_DIE': {
            if (state.gameOver) return state;

            const colIdx = action.columnIndex;
            const activeBoard = state.turn === 'player' ? state.playerBoard : state.cpuBoard;
            const passiveBoard = state.turn === 'player' ? state.cpuBoard : state.playerBoard; // The opponent
            const dieValue = state.currentRoll;

            // Validate Move
            if (activeBoard[colIdx].length >= MAX_PER_COL) {
                // Invalid move, ignore (or could return error state)
                return state;
            }

            // 1. Place Die
            const newActiveBoard = [...activeBoard];
            newActiveBoard[colIdx] = [...newActiveBoard[colIdx], dieValue];

            // 2. Destroy Opponent Dice
            // If opponent has dice of same value in same column, remove them.
            let destroyed = false;
            const newPassiveBoard = [...passiveBoard];
            const originalColLen = newPassiveBoard[colIdx].length;
            newPassiveBoard[colIdx] = newPassiveBoard[colIdx].filter(d => d !== dieValue);
            if (newPassiveBoard[colIdx].length !== originalColLen) {
                destroyed = true;
            }

            // 3. Check End Game Condition
            // Game ends immediately when one board is full.
            const activeFull = isBoardFull(newActiveBoard);
            const passiveFull = isBoardFull(newPassiveBoard); // Unlikely to become full on opponent turn but consistent check.

            let gameOver = activeFull || passiveFull;
            let winner = state.winner;

            if (gameOver) {
                const pScore = calculateTotalScore(state.turn === 'player' ? newActiveBoard : newPassiveBoard);
                const cScore = calculateTotalScore(state.turn === 'cpu' ? newActiveBoard : newPassiveBoard);
                if (pScore > cScore) winner = 'player';
                else if (cScore > pScore) winner = 'cpu';
                else winner = 'draw';
            }

            // 4. Prepare Next Turn
            const nextTurn = state.turn === 'player' ? 'cpu' : 'player';
            const nextRoll = rollDie();

            // Logs
            const logMsg = `${state.turn === 'player' ? 'Player' : 'CPU'} placed ${dieValue} in col ${colIdx + 1}.${destroyed ? ' Destroyed opponent dice!' : ''}`;

            return {
                ...state,
                playerBoard: state.turn === 'player' ? newActiveBoard : newPassiveBoard,
                cpuBoard: state.turn === 'cpu' ? newActiveBoard : newPassiveBoard,
                turn: nextTurn,
                currentRoll: nextRoll,
                gameOver,
                winner,
                logs: [logMsg, ...state.logs].slice(0, 5) // Keep last 5 logs
            };
        }

        default:
            return state;
    }
};
