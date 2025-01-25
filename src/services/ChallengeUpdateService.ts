import { Note } from "../stores/useNoteStore";
import { Challenge, useChallengeStore } from "../stores/useChallengeStore";
import { ScaleNote } from "./MusicGenerator";

export class ChallengeUpdateService {
  /**
   * Check if a played note matches any active challenges and update their progress
   * If a challenge is completed, removed it from the store and reset all other challenges
   */
  static updateChallenges(playedNote: Note): boolean {
    const store = useChallengeStore.getState();
    const challenges = store.getChallenges();

    for (const challenge of challenges) {
      // Get the next note that should be played in this challenge
      const expectedNote = challenge.notes[challenge.currentIndex];
      if (!expectedNote) break; // Challenge is complete

      // Convert MIDI note to ScaleNote format
      const playedNoteName = playedNote.noteName.replace(
        /[0-9]/g,
        ""
      ) as ScaleNote;

      // Check if the played note matches the expected note
      let updatedChallenge: Challenge | undefined;
      if (
        playedNoteName === expectedNote.note &&
        playedNote.octave === expectedNote.octave
      ) {
        updatedChallenge = store.advanceIndex(challenge.id);
      } else {
        updatedChallenge = store.resetProgress(challenge.id);
      }

      if (updatedChallenge && this.isChallengeComplete(updatedChallenge)) {
        store.removeChallenge(challenge.id);
        useChallengeStore.getState().resetAllChallenges();
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a challenge is complete
   */
  static isChallengeComplete(challenge: Challenge): boolean {
    return challenge.currentIndex >= challenge.notes.length;
  }
}
