import { GameAction, GameState, Card, Weapon } from './types';
import { MAX_HP, getCardType, createDeck } from './constants';
import { getInitialState } from './game-state';

export const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'START_GAME':
            return getInitialState();

        case 'FLEE_ROOM': {
            if (!state.canFlee) {
                return { ...state, message: "You cannot flee two rooms in a row!" };
            }

            const cardsToFlee = [...state.room];
            // "Place them at the bottom of the Dungeon"
            // We assume order doesn't matter, or we keep them randomly.
            // Let's just append them to deck.
            // NOTE: "You can choose to flee a room by collecting all four cards". 
            // This implies you can only flee at START of room (when 4 cards present)?
            // Rules check: "Play three of four... You can choose to flee... cannot flee two in a row"
            // Usually Flee implies skipping the whole room encounter. 
            // Most implementation allow flee only if you haven't played cards in the room yet?
            // Source [1][6]: "Escape the *room*". "Flee a room".
            // If I play 1 card, can I flee the remaining 3? 
            // "Deal 4 cards... Play 3... 4th remains". 
            // If I flee, I put all 4 on bottom.
            // So Flee is likely only available when room is full (4 cards).

            if (state.room.length !== 4) {
                return { ...state, message: "You can only flee a full room!" };
            }

            const newDeck = [...state.deck, ...cardsToFlee];
            const newRoom = newDeck.splice(0, 4);

            return {
                ...state,
                deck: newDeck,
                room: newRoom,
                canFlee: false, // Cannot flee next time
                potionUsedInRoom: false,
                message: "You fled the room. Coward.",
            };
        }

        case 'PLAY_CARD': {
            if (state.gameOver || state.gameWon) return state;

            const cardIndex = state.room.findIndex((c) => c.id === action.cardId);
            if (cardIndex === -1) return state;

            const card = state.room[cardIndex];
            const cardType = getCardType(card);
            let newHp = state.hp;
            let newWeapon = state.weapon;
            let newDiscard = [...state.discardPile, card];
            let newMessage = '';
            let potionUsed = state.potionUsedInRoom;

            // --- LOGIC PER CARD TYPE ---

            if (cardType === 'health_potion') {
                if (state.potionUsedInRoom) {
                    // Potion wasted
                    newMessage = "Potion wasted! Only one per room.";
                } else {
                    newHp = Math.min(MAX_HP, state.hp + card.value);
                    potionUsed = true;
                    newMessage = `Healed for ${card.value}. HP: ${newHp}`;
                }
            } else if (cardType === 'weapon') {
                newWeapon = { card, lastSlainValue: null };
                newMessage = `Equipped ${card.value} weapon.`;
            } else if (cardType === 'monster') {
                const monsterVal = card.value;
                let damage = monsterVal;
                let usedWeaponToKill = false;

                // Check if we can use weapon
                if (state.weapon && !action.useBarehanded) {
                    // Weapon rules: 
                    // 1. Can block damage. 
                    // 2. "Cannot use weapon to fight monster with EQUAL or HIGHER value than the one just defeated".
                    // In other words, next monster must be STRICTLY WEAKER (<) than last slain.
                    // If lastSlainValue is null, any monster is fine.

                    const isWeaponValid =
                        state.weapon.lastSlainValue === null ||
                        monsterVal < state.weapon.lastSlainValue;

                    if (isWeaponValid) {
                        damage = Math.max(0, monsterVal - state.weapon.card.value);
                        newWeapon = {
                            ...state.weapon,
                            lastSlainValue: monsterVal
                        };
                        usedWeaponToKill = true;
                        newMessage = `Fought monster (${monsterVal}) with weapon. Took ${damage} damage.`;
                    } else {
                        // Invalid weapon choice
                        // If user didn't explicitly ask for barehanded, but weapon is invalid, 
                        // we default to barehanded but maybe warn? 
                        // For now, let's assume if they click, they take the hit if weapon invalid.
                        newMessage = `Weapon dull! Fought barehanded. Took ${damage} damage.`;
                    }
                } else {
                    newMessage = `Fought barehanded. Took ${damage} damage.`;
                }

                newHp = state.hp - damage;
            }

            // --- END CARD LOGIC ---

            if (newHp <= 0) {
                return {
                    ...state,
                    hp: 0,
                    room: state.room.filter(c => c.id !== action.cardId), // Remove played card visually
                    gameOver: true,
                    message: "You died.",
                };
            }

            // Remove card from room
            let newRoom = [...state.room];
            newRoom.splice(cardIndex, 1);

            // --- ROOM REFILL LOGIC ---
            // "Play three of the four cards... The fourth card remains... becomes part of next room"
            // So refill happens when `newRoom.length === 1`.
            let deck = [...state.deck];
            let canFlee = state.canFlee;

            if (newRoom.length === 1) {
                // Time to refill
                const cardsNeeded = 3;
                if (deck.length > 0) {
                    const newCards = deck.splice(0, cardsNeeded);
                    newRoom = [...newRoom, ...newCards];
                    potionUsed = false; // Reset potion flag for new room
                    canFlee = true; // Reset flee flag ("Cannot flee TWO rooms in a row" -> We just finished one, so we can flee next)
                } else {
                    // Deck empty
                    // If room has 1 card left and deck empty... 
                    // "You win if you go through the entire Dungeon deck".
                    // Does this mean clearing the last room too?
                    // Usually yes.
                    // If deck is empty and room has 1 card left... there are no more cards to add.
                    // The player must deal with the last card?
                    // Or does the game end when deck is empty and only 1 card remains (since you can't form a room)?
                    // "Play three of four". 
                    // If 1 card remains and deck empty, you essentially cleared the dungeon.
                    // Let's say: Game Win if Deck is Empty AND Room.length <= 1?
                    // Actually, if 1 card remains, it "becomes part of next room". But there is no next room.
                    // So you win.
                    if (newRoom.length === 1 && deck.length === 0) {
                        return {
                            ...state,
                            hp: newHp,
                            weapon: newWeapon,
                            room: newRoom,
                            deck,
                            discardPile: newDiscard,
                            gameWon: true,
                            message: "Dungeon Cleared! You Win!",
                        };
                    }
                }
            }

            return {
                ...state,
                hp: newHp,
                weapon: newWeapon,
                room: newRoom,
                deck,
                discardPile: newDiscard,
                potionUsedInRoom: potionUsed,
                canFlee,
                message: newMessage
            };
        }

        default:
            return state;
    }
};
