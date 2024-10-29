import { create } from 'zustand';
import { Card } from '../types/cards';
import { GameMode, PlayerType, Phase, TurnState, CombatAction } from '../types/game';
import { pastEchoesCards } from '../data/cards/pastEchoes';
import { emotionsCards } from '../data/cards/emotions';
import { natureEchoesCards } from '../data/cards/natureEchoes';

interface GameState {
  gameMode: GameMode;
  playerLife: number;
  opponentLife: number;
  playerHand: Card[];
  playerField: Card[];
  opponentField: Card[];
  discardPile: Card[];
  turn: TurnState;
  selectedCard: string | null;
  attackingCard: string | null;
  animations: {
    playingCard: boolean;
    attacking: boolean;
    damaged: string[];
  };
  
  // Actions
  initializeGame: (mode: GameMode) => void;
  drawCard: () => void;
  playCard: (cardId: string) => void;
  selectCard: (cardId: string | null) => void;
  declareAttack: (cardId: string) => void;
  executeAttack: (target: string | PlayerType) => void;
  endTurn: () => void;
  processCPUTurn: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameMode: 'cpu',
  playerLife: 20,
  opponentLife: 20,
  playerHand: [],
  playerField: [],
  opponentField: [],
  discardPile: [],
  selectedCard: null,
  attackingCard: null,
  turn: {
    currentPlayer: 'player1',
    phase: 'draw',
    turnNumber: 1,
  },
  animations: {
    playingCard: false,
    attacking: false,
    damaged: [],
  },

  initializeGame: (mode: GameMode) => {
    set({
      gameMode: mode,
      playerLife: 20,
      opponentLife: 20,
      playerHand: [],
      playerField: [],
      opponentField: [],
      discardPile: [],
      turn: {
        currentPlayer: 'player1',
        phase: 'draw',
        turnNumber: 1,
      },
    });
    // Draw initial hand
    for (let i = 0; i < 5; i++) {
      get().drawCard();
    }
  },

  drawCard: () => {
    const allCards = [...pastEchoesCards, ...emotionsCards, ...natureEchoesCards];
    const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
    set(state => ({
      playerHand: [...state.playerHand, randomCard],
      turn: { ...state.turn, phase: 'main' },
    }));
  },

  playCard: (cardId: string) => {
    const { playerHand, playerField, turn } = get();
    if (turn.phase !== 'main') return;

    const cardIndex = playerHand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;

    const card = playerHand[cardIndex];
    const newHand = [...playerHand];
    newHand.splice(cardIndex, 1);

    // Start playing animation
    set({ animations: { ...get().animations, playingCard: true } });

    setTimeout(() => {
      set(state => ({
        playerHand: newHand,
        playerField: card.type === 'creature' ? [...state.playerField, card] : state.playerField,
        discardPile: card.type !== 'creature' ? [...state.discardPile, card] : state.discardPile,
        animations: { ...state.animations, playingCard: false },
      }));
    }, 500);
  },

  selectCard: (cardId: string | null) => {
    set({ selectedCard: cardId });
  },

  declareAttack: (cardId: string) => {
    const { turn } = get();
    if (turn.phase !== 'combat') return;
    set({ attackingCard: cardId });
  },

  executeAttack: (target: string | PlayerType) => {
    const { attackingCard, playerField, opponentField } = get();
    if (!attackingCard) return;

    const attacker = playerField.find(card => card.id === attackingCard);
    if (!attacker) return;

    set(state => ({
      animations: { ...state.animations, attacking: true, damaged: [target as string] }
    }));

    setTimeout(() => {
      if (typeof target === 'string') {
        // Attack creature
        const defender = opponentField.find(card => card.id === target);
        if (defender) {
          // Combat logic
        }
      } else {
        // Attack player
        set(state => ({
          opponentLife: state.opponentLife - (attacker.power || 0)
        }));
      }

      set(state => ({
        attackingCard: null,
        animations: { ...state.animations, attacking: false, damaged: [] }
      }));
    }, 1000);
  },

  endTurn: () => {
    const { turn, gameMode } = get();
    
    const nextPlayer = turn.currentPlayer === 'player1' 
      ? (gameMode === 'cpu' ? 'cpu' : 'player2')
      : 'player1';

    set(state => ({
      turn: {
        currentPlayer: nextPlayer,
        phase: 'draw',
        turnNumber: state.turn.turnNumber + 1,
      }
    }));

    if (nextPlayer === 'cpu') {
      setTimeout(() => get().processCPUTurn(), 1000);
    }
  },

  processCPUTurn: () => {
    // Simple CPU AI
    const { opponentField, playerField, playerLife } = get();

    // Draw phase
    get().drawCard();

    // Main phase - Play cards
    // ... CPU card playing logic

    // Combat phase
    if (opponentField.length > 0) {
      // Attack logic
      const attacker = opponentField[0];
      if (playerField.length === 0) {
        // Attack player directly
        set(state => ({
          playerLife: state.playerLife - (attacker.power || 0)
        }));
      } else {
        // Attack creature
        const target = playerField[0];
        // Combat logic
      }
    }

    // End turn
    setTimeout(() => get().endTurn(), 1000);
  },
}));