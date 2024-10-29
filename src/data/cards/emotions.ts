import { Card } from '../../types/cards';

export const emotionsCards: Card[] = [
  {
    id: 'em-1',
    name: 'Furia Desatada',
    type: 'spell',
    deck: 'emotions',
    cost: 3,
    description: 'Aumenta el ataque de todas las criaturas en el campo, pero reduce su defensa.',
    imageUrl: 'https://images.unsplash.com/photo-1513759565286-20e9c5fad06b',
    effects: ['+3 ataque a todas las criaturas', '-2 defensa a todas las criaturas']
  },
  {
    id: 'em-2',
    name: 'Tristeza Profunda',
    type: 'spell',
    deck: 'emotions',
    cost: 2,
    description: 'Debilita a las criaturas enemigas, reduciendo su ataque y defensa.',
    imageUrl: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c',
    effects: ['-2/-2 a todas las criaturas enemigas']
  },
  {
    id: 'em-3',
    name: 'Alegría Contagiosa',
    type: 'spell',
    deck: 'emotions',
    cost: 4,
    description: 'Permite a las criaturas aliadas ganar vida o recursos adicionales.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    effects: ['+2 vida a criaturas aliadas', '+1 recurso por criatura']
  }
];