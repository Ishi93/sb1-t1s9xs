export type CardType = 'creature' | 'spell' | 'effect';
export type DeckType = 
  | 'alternative-realities'
  | 'past-echoes'
  | 'unexpected-synergies'
  | 'emotions'
  | 'nature-echoes'
  | 'organic-tech';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  deck: DeckType;
  cost: number;
  power?: number;
  defense?: number;
  description: string;
  imageUrl: string;
  effects: string[];
}