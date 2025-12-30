export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
// 11=Jack, 12=Queen, 13=King, 14=Ace

export interface Card {
    id: string; // Unique ID for React keys
    suit: Suit;
    rank: Rank;
    value: number; // The numeric value used for calculations (2-14)
}

export interface Weapon {
    card: Card;
    lastSlainValue: number | null; // Value of the last monster killed with this weapon
}

export type CardType = 'monster' | 'weapon' | 'health_potion';

export interface GameState {
    deck: Card[];
    room: Card[];
    discardPile: Card[]; // Cards that have been "used" or "fled"
    hp: number;
    maxHp: number;
    weapon: Weapon | null;
    potionUsedInRoom: boolean;
    canFlee: boolean; // Can only flee if previous room wasn't fled
    gameOver: boolean;
    gameWon: boolean;
    message: string; // User feedback (e.g. "Weapon too weak!")
}

export type GameAction =
    | { type: 'START_GAME' }
    | { type: 'PLAY_CARD'; cardId: string; useBarehanded?: boolean }
    | { type: 'FLEE_ROOM' };
