import { Card, Rank, Suit } from './types';

export const MAX_HP = 20;

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
// Standard deck ranks. 
// Scoundrel Rules: 
// - Spades/Clubs (Monsters): 2-10, J, Q, K, A.
// - Hearts (Health): 2-10 only. (No J, Q, K, A)
// - Diamonds (Weapons): 2-10, J, Q, K, A.
// Wait, the rules source said: "Remove all Jokers, red face cards (King, Queen, Jack of Hearts and Diamonds), and red Aces".
// Let's re-read carefully.
// "Remove... red face cards (King, Queen, Jack of Hearts and Diamonds), and red Aces".
// This implies Hearts/Diamonds Face cards & Aces are removed.
// So Hearts & Diamonds are 2-10 only?
// Let's verify standard Scoundrel deck:
// Monsters (black): 2-10, J, Q, K, A (13 cards * 2 suits = 26)
// Hearts (Health): 2-10 (9 cards) - Red Face/Ace removed.
// Diamonds (Weapons): 2-10 (9 cards) - Red Face/Ace removed.
// Total: 26 + 9 + 9 = 44 cards. Correct.

export const createDeck = (): Card[] => {
    const deck: Card[] = [];

    SUITS.forEach((suit) => {
        // Monsters (Black suits) have full range 2-14
        if (suit === 'spades' || suit === 'clubs') {
            for (let r = 2; r <= 14; r++) {
                deck.push({
                    id: `${suit}-${r}-${Math.random().toString(36).substr(2, 9)}`,
                    suit,
                    rank: r as Rank,
                    value: r,
                });
            }
        }
        // Red suits (Hearts/Diamonds) have only 2-10
        else {
            for (let r = 2; r <= 10; r++) {
                deck.push({
                    id: `${suit}-${r}-${Math.random().toString(36).substr(2, 9)}`,
                    suit,
                    rank: r as Rank,
                    value: r,
                });
            }
        }
    });

    return shuffle(deck);
};

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export const getCardType = (card: Card) => {
    if (card.suit === 'hearts') return 'health_potion';
    if (card.suit === 'diamonds') return 'weapon';
    return 'monster';
};
