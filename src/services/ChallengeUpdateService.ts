import { Note } from '../stores/useNoteStore';
import { Challenge, useChallengeStore } from '../stores/useChallengeStore';
import { ScaleNote } from './MusicGenerator';

export class ChallengeUpdateService {
    /**
     * Check if a played note matches any active challenges and update their progress
     */
    static updateChallenges(playedNote: Note): void {
        const store = useChallengeStore.getState();
        const challenges = store.getChallenges();

        challenges.forEach(challenge => {
            // Get the next note that should be played in this challenge
            const expectedNote = challenge.notes[challenge.currentIndex];
            if (!expectedNote) return; // Challenge is complete

            // Convert MIDI note to ScaleNote format
            const playedNoteName = playedNote.noteName.replace(/[0-9]/g, '') as ScaleNote;
            
            // Check if the played note matches the expected note
            let updatedChallenge: Challenge | undefined;
            if (playedNoteName === expectedNote.note && playedNote.octave === expectedNote.octave) {
                updatedChallenge = store.advanceIndex(challenge.id);
            }
            else {
                updatedChallenge = store.resetProgress(challenge.id);
            }

            console.log('Checking for challenge completion...');
            if (updatedChallenge && this.isChallengeComplete(updatedChallenge)) {
                console.log('Challenge complete!');
                store.removeChallenge(challenge.id);

                // TODO: do other logic here for completing a challenge
                // Maybe return the list of completed challenges?
            }
        });
    }

    /**
     * Check if a challenge is complete
     */
    static isChallengeComplete(challenge: Challenge): boolean {
        return challenge.currentIndex >= challenge.notes.length;
    }
}
