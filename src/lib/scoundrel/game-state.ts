import { createDeck, MAX_HP } from './constants';
import { GameState } from './types';

export const getInitialState = (): GameState => {
    const deck = createDeck();
    const room = deck.splice(0, 4); // Deal first 4 cards

    return {
        deck,
        room,
        discardPile: [],
        hp: MAX_HP,
        maxHp: MAX_HP,
        weapon: null,
        potionUsedInRoom: false,
        canFlee: true,
        gameOver: false,
        gameWon: false,
        message: 'Welcome to the Dungeon. Choose a card.',
    };
};
