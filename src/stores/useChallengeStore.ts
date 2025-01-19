import { create } from 'zustand';
import { Notes } from '../services/MusicGenerator';

export interface Challenge {
  id: string;
  notes: Notes;
  name?: string;
}

interface ChallengeState {
  challenges: Challenge[];
  // Actions
  addChallenge: (notes: Notes, name?: string) => string; // Returns the id of the new challenge
  removeChallenge: (id: string) => void;
  getChallenges: () => Challenge[];
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: [],

  addChallenge: (notes, name) => {
    const id = crypto.randomUUID();
    const challenge: Challenge = {
      id,
      notes,
      name
    };
    
    set(state => ({
      challenges: [...state.challenges, challenge]
    }));

    return id;
  },

  removeChallenge: (id) => {
    set(state => ({
      challenges: state.challenges.filter(c => c.id !== id)
    }));
  },

  getChallenges: () => {
    return get().challenges;
  }
}));
