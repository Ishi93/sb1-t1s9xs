import { Card } from '../../types/cards';

export const natureEchoesCards: Card[] = [
  {
    id: 'ne-1',
    name: 'Guardianes del Bosque',
    type: 'creature',
    deck: 'nature-echoes',
    cost: 4,
    power: 3,
    defense: 4,
    description: 'Se fortalece en entornos naturales, ganando habilidades adicionales si hay cartas de naturaleza en juego.',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
    effects: ['+2/+2 si hay otras cartas de naturaleza', 'Gana curación al final del turno']
  },
  {
    id: 'ne-2',
    name: 'Tormenta de Polen',
    type: 'spell',
    deck: 'nature-echoes',
    cost: 3,
    description: 'Afecta a todas las criaturas en el campo, causando efectos aleatorios basados en su tipo.',
    imageUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    effects: ['Efecto aleatorio por criatura', 'Basado en el tipo de criatura']
  }
];