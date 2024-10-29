import { CardEffect, GameState } from '../types/game';

export const createEffect = (
  type: CardEffect['type'],
  action: CardEffect['action'],
  options: Partial<CardEffect> = {}
): CardEffect => ({
  type,
  action,
  ...options
});

export const effectTemplates = {
  damageAll: (amount: number) =>
    createEffect('instant', (state: GameState) => {
      const newState = { ...state };
      Object.keys(newState.players).forEach(player => {
        if (newState.players[player]) {
          newState.players[player]!.life -= amount;
        }
      });
      return newState;
    }),

  healTarget: (amount: number) =>
    createEffect('instant', (state: GameState) => {
      const newState = { ...state };
      const target = newState.players[state.turn.currentPlayer];
      if (target) {
        target.life = Math.min(target.life + amount, 20);
      }
      return newState;
    }),

  drawCards: (amount: number) =>
    createEffect('instant', (state: GameState) => {
      const newState = { ...state };
      const player = newState.players[state.turn.currentPlayer];
      if (player && player.deck.length >= amount) {
        const drawn = player.deck.splice(0, amount);
        player.hand.push(...drawn);
      }
      return newState;
    }),

  buffCreatures: (power: number, defense: number, duration?: number) =>
    createEffect(
      'continuous',
      (state: GameState) => {
        // Implementation of buff effect
        return state;
      },
      { duration }
    ),

  addResources: (type: string, amount: number) =>
    createEffect('instant', (state: GameState) => {
      const newState = { ...state };
      const player = newState.players[state.turn.currentPlayer];
      if (player) {
        player.resources.types[type] += amount;
      }
      return newState;
    })
};