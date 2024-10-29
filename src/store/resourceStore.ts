import { create } from 'zustand';
import { ResourceType, Resources } from '../types/game';

interface ResourceState {
  resources: Resources;
  addResource: (type: ResourceType, amount: number) => void;
  spendResource: (type: ResourceType, amount: number) => boolean;
  resetResources: () => void;
  incrementMaxResources: () => void;
}

const initialResources: Resources = {
  current: 1,
  max: 1,
  types: {
    mana: 0,
    energy: 0,
    nature: 0,
    emotion: 0,
    tech: 0
  }
};

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: { ...initialResources },

  addResource: (type: ResourceType, amount: number) => {
    set(state => ({
      resources: {
        ...state.resources,
        types: {
          ...state.resources.types,
          [type]: state.resources.types[type] + amount
        }
      }
    }));
  },

  spendResource: (type: ResourceType, amount: number) => {
    const { resources } = get();
    if (resources.types[type] < amount) return false;

    set(state => ({
      resources: {
        ...state.resources,
        types: {
          ...state.resources.types,
          [type]: state.resources.types[type] - amount
        }
      }
    }));
    return true;
  },

  resetResources: () => {
    set(state => ({
      resources: {
        ...state.resources,
        current: state.resources.max
      }
    }));
  },

  incrementMaxResources: () => {
    set(state => ({
      resources: {
        ...state.resources,
        max: Math.min(state.resources.max + 1, 10),
        current: Math.min(state.resources.max + 1, 10)
      }
    }));
  }
}));