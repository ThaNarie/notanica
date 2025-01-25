import { create } from 'zustand';
import { Notes } from '../services/MusicGenerator';

export interface Challenge {
  id: string;
  notes: Notes;
  currentIndex: number;
  name?: string;
}

interface ChallengeState {
  challenges: Challenge[];
  // Actions
  addChallenge: (notes: Notes, name?: string) => string; // Returns the id of the new challenge
  removeChallenge: (id: string) => void;
  getChallenges: () => Challenge[];
  advanceIndex: (challengeId: string) => Challenge | undefined;
  resetProgress: (challengeId: string) => Challenge | undefined;
  resetAllChallenges: () => void;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: [],

  addChallenge: (notes, name) => {
    const id = crypto.randomUUID();
    const challenge: Challenge = {
      id,
      notes,
      currentIndex: 0,
      name,
    };

    set((state) => ({
      challenges: [...state.challenges, challenge],
    }));

    return id;
  },

  removeChallenge: (id) => {
    set((state) => ({
      challenges: state.challenges.filter((c) => c.id !== id),
    }));
  },

  getChallenges: () => {
    return get().challenges;
  },

  advanceIndex: (challengeId) => {
    let updatedChallenge: Challenge | undefined;

    set((state) => {
      const challenges = state.challenges.map((challenge) => {
        if (challenge.id === challengeId) {
          updatedChallenge = {
            ...challenge,
            currentIndex: Math.min(challenge.currentIndex + 1, challenge.notes.length),
          };
          return updatedChallenge;
        }
        return challenge;
      });
      return { challenges };
    });

    return updatedChallenge;
  },

  resetProgress: (challengeId) => {
    let updatedChallenge: Challenge | undefined;

    set((state) => {
      const challenges = state.challenges.map((challenge) => {
        if (challenge.id === challengeId) {
          updatedChallenge = {
            ...challenge,
            currentIndex: 0,
          };
          return updatedChallenge;
        }
        return challenge;
      });
      return { challenges };
    });

    return updatedChallenge;
  },

  resetAllChallenges: () => {
    set((state) => ({
      challenges: state.challenges.map((challenge) => ({
        ...challenge,
        currentIndex: 0,
      })),
    }));
  },
}));
