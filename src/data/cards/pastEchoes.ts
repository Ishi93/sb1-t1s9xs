import { Card } from '../../types/cards';

export const pastEchoesCards: Card[] = [
  {
    id: 'pe-1',
    name: 'Recuerdo de la Batalla',
    type: 'spell',
    deck: 'past-echoes',
    cost: 3,
    description: 'Permite al jugador recuperar una carta de su pila de descartes y jugarla nuevamente.',
    imageUrl: 'https://images.unsplash.com/photo-1599790772272-d1425cd3242e',
    effects: ['Recupera una carta del descarte', 'Juégala inmediatamente']
  },
  {
    id: 'pe-2',
    name: 'Espectro del Guerrero',
    type: 'creature',
    deck: 'past-echoes',
    cost: 4,
    power: 3,
    defense: 4,
    description: 'Gana habilidades de las criaturas que han sido derrotadas en la partida.',
    imageUrl: 'https://images.unsplash.com/photo-1590684874075-c2f45ecf3f92',
    effects: ['Hereda habilidades de criaturas derrotadas']
  },
  {
    id: 'pe-3',
    name: 'Memoria Colectiva',
    type: 'spell',
    deck: 'past-echoes',
    cost: 2,
    description: 'Otorga a todas las criaturas en el campo un bono basado en el número de cartas en la pila de descartes.',
    imageUrl: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb',
    effects: ['Bono por cartas descartadas', '+1/+1 por cada 2 cartas en el descarte']
  }
];