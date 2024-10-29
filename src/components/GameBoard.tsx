import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card as CardComponent } from './Card';
import { useGameStore } from '../store/gameStore';
import { PlayerType } from '../types/game';

export function GameBoard() {
  const { 
    gameMode,
    playerLife, 
    opponentLife, 
    playerHand, 
    playerField, 
    opponentField,
    turn,
    selectedCard,
    attackingCard,
    animations,
    playCard,
    selectCard,
    declareAttack,
    executeAttack,
    endTurn,
    initializeGame 
  } = useGameStore();

  useEffect(() => {
    initializeGame('cpu');
  }, [initializeGame]);

  const handleCardClick = (cardId: string) => {
    if (turn.phase === 'main') {
      playCard(cardId);
    } else if (turn.phase === 'combat') {
      if (attackingCard) {
        executeAttack(cardId);
      } else {
        declareAttack(cardId);
      }
    }
  };

  const handlePlayerAttack = (target: PlayerType) => {
    if (attackingCard && turn.phase === 'combat') {
      executeAttack(target);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Game Info */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-lg">
            Turn {turn.turnNumber} - {turn.currentPlayer} - {turn.phase} phase
          </div>
          <button
            onClick={endTurn}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            End Turn
          </button>
        </div>

        {/* Opponent's Field */}
        <motion.div 
          className="mb-8"
          animate={{ opacity: turn.currentPlayer === 'cpu' ? 1 : 0.8 }}
        >
          <h2 className="text-xl font-bold mb-4">Opponent's Field</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {opponentField.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                isDamaged={animations.damaged.includes(card.id)}
                onClick={() => attackingCard && handleCardClick(card.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Center Field */}
        <div className="h-48 flex items-center justify-center mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">VS</div>
            <div className="flex gap-8">
              <motion.div 
                className="text-center cursor-pointer"
                whileHover={{ scale: 1.1 }}
                onClick={() => handlePlayerAttack('player1')}
              >
                <div className="text-xl">{playerLife}</div>
                <div className="text-sm">Your Life</div>
              </motion.div>
              <motion.div 
                className="text-center cursor-pointer"
                whileHover={{ scale: 1.1 }}
                onClick={() => handlePlayerAttack(gameMode === 'cpu' ? 'cpu' : 'player2')}
              >
                <div className="text-xl">{opponentLife}</div>
                <div className="text-sm">Enemy Life</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Player's Field */}
        <motion.div 
          className="mb-8"
          animate={{ opacity: turn.currentPlayer === 'player1' ? 1 : 0.8 }}
        >
          <h2 className="text-xl font-bold mb-4">Your Field</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {playerField.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                isPlayable={turn.phase === 'combat'}
                isAttacking={attackingCard === card.id}
                isDamaged={animations.damaged.includes(card.id)}
                onClick={() => handleCardClick(card.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Player's Hand */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Hand</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {playerHand.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                isPlayable={turn.phase === 'main' && turn.currentPlayer === 'player1'}
                onClick={() => handleCardClick(card.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}