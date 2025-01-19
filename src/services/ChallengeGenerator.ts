import { Key, MusicGenerator } from './MusicGenerator';
import { useChallengeStore } from '../stores/useChallengeStore';

export class ChallengeGenerator {
    /**
     * Creates a scale challenge for a given key
     * Returns the ID of the created challenge
     */
    static createScaleChallenge(key: Key): string {
        const notes = MusicGenerator.generateMelody(key, 4);
        const scaleWithOctaves = MusicGenerator.getMelodyWithOctaves(notes);

        // Add to store
        return useChallengeStore.getState().addChallenge(
            scaleWithOctaves,
        );
    }
}
