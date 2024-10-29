import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../types/cards';
import { Shield, Swords, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface CardProps {
  card: CardType;
  isPlayable?: boolean;
  isAttacking?: boolean;
  isDamaged?: boolean;
  onClick?: () => void;
}

export function Card({ card, isPlayable = false, isAttacking = false, isDamaged = false, onClick }: CardProps) {
  const { turn, selectedCard } = useGameStore();
  const isSelected = selectedCard === card.id;

  const cardVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    selected: { scale: 1.1, boxShadow: '0 0 20px rgba(255,255,255,0.5)' },
    attacking: { x: [0, 100, 0], transition: { duration: 0.5 } },
    damaged: { 
      scale: [1, 0.9, 1],
      rotate: [-5, 5, 0],
      transition: { duration: 0.3 }
    }
  };

  const cardStyles = `
    relative w-64 h-96 rounded-xl overflow-hidden
    ${isPlayable ? 'cursor-pointer' : 'opacity-90'}
    bg-gradient-to-br
    ${getDeckGradient(card.deck)}
  `;

  return (
    <motion.div
      className={cardStyles}
      variants={cardVariants}
      initial="initial"
      animate={[
        isSelected ? 'selected' : 'initial',
        isAttacking ? 'attacking' : '',
        isDamaged ? 'damaged' : ''
      ]}
      whileHover={isPlayable ? 'hover' : undefined}
      onClick={isPlayable ? onClick : undefined}
    >
      {/* Card content remains the same */}
      <div className="absolute inset-0.5 bg-black rounded-xl overflow-hidden">
        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${card.imageUrl})` }} />
        
        <div className="p-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{card.name}</h3>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500">
              {card.cost}
            </span>
          </div>
          
          {card.type === 'creature' && (
            <div className="flex gap-4 mb-2">
              <div className="flex items-center gap-1">
                <Swords className="w-4 h-4" />
                <span>{card.power}</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>{card.defense}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">{card.type}</span>
          </div>
          
          <p className="text-sm mb-2">{card.description}</p>
          
          <div className="space-y-1">
            {card.effects.map((effect, index) => (
              <p key={index} className="text-xs italic">{effect}</p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getDeckGradient(deck: CardType['deck']): string {
  const gradients = {
    'alternative-realities': 'from-purple-600 to-blue-600',
    'past-echoes': 'from-amber-600 to-red-600',
    'unexpected-synergies': 'from-green-600 to-teal-600',
    'emotions': 'from-pink-600 to-red-600',
    'nature-echoes': 'from-green-600 to-emerald-600',
    'organic-tech': 'from-cyan-600 to-blue-600'
  };
  
  return gradients[deck] || 'from-gray-600 to-gray-800';
}