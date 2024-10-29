export type GameMode = 'cpu' | 'pvp' | 'online';
export type PlayerType = 'player1' | 'player2' | 'cpu';
export type Phase = 'draw' | 'main' | 'combat' | 'end';
export type ResourceType = 'mana' | 'energy' | 'nature' | 'emotion' | 'tech';

export interface Resources {
  current: number;
  max: number;
  types: Record<ResourceType, number>;
}

export interface TurnState {
  currentPlayer: PlayerType;
  phase: Phase;
  turnNumber: number;
  resources: Resources;
}

export interface CombatAction {
  attackerId: string;
  defenderId?: string;
  targetPlayer?: PlayerType;
  effects?: CardEffect[];
}

export interface CardEffect {
  type: 'instant' | 'continuous' | 'triggered';
  condition?: string;
  duration?: number;
  action: (state: GameState) => GameState;
}

export interface AIState {
  difficulty: 'easy' | 'medium' | 'hard';
  strategy: 'aggressive' | 'defensive' | 'balanced';
  memory: {
    playerPlayStyle: string[];
    cardsPlayed: string[];
    successfulCombos: string[];
  };
}

export interface GameState {
  mode: GameMode;
  players: {
    [key in PlayerType]?: {
      life: number;
      resources: Resources;
      hand: string[];
      field: string[];
      deck: string[];
      graveyard: string[];
    };
  };
  turn: TurnState;
  effects: CardEffect[];
  combat: CombatAction | null;
  ai: AIState;
}