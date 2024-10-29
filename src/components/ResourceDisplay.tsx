import React from 'react';
import { motion } from 'framer-motion';
import { useResourceStore } from '../store/resourceStore';
import { ResourceType } from '../types/game';

export function ResourceDisplay() {
  const { resources } = useResourceStore();

  const resourceIcons: Record<ResourceType, string> = {
    mana: '💠',
    energy: '⚡',
    nature: '🌿',
    emotion: '💗',
    tech: '⚙️'
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center gap-2 text-blue-400">
        <motion.div
          className="text-xl font-bold"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
        >
          {resources.current}/{resources.max}
        </motion.div>
        <span className="text-sm">Resources</span>
      </div>

      <div className="flex gap-2">
        {Object.entries(resources.types).map(([type, amount]) => (
          <motion.div
            key={type}
            className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded"
            whileHover={{ scale: 1.05 }}
          >
            <span>{resourceIcons[type as ResourceType]}</span>
            <span className="text-sm">{amount}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}