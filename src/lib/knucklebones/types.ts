export type PlayerType = 'player' | 'cpu';

// Each column can hold up to 3 dice.
// Example: [[1, 4], [2], [6, 6, 6]]
export type Board = number[][];

export interface GameState {
    playerBoard: Board;
    cpuBoard: Board;
    turn: PlayerType;
    currentRoll: number; // 1-6
    gameOver: boolean;
    winner: PlayerType | 'draw' | null;
    logs: string[]; // For game log history
}

export type GameAction =
    | { type: 'START_GAME' }
    | { type: 'PLACE_DIE'; columnIndex: number };
