import { describe, it, expect, beforeEach } from "vitest";
import { ChallengeUpdateService } from "../ChallengeUpdateService";
import { useChallengeStore } from "../../stores/useChallengeStore";
import { Note } from "../../stores/useNoteStore";
import { ScaleNote } from "../MusicGenerator";

// Create a helper to make test notes
const createTestNote = (noteName: string, octave: number): Note => ({
  pitch: 60, // Not important for our tests
  velocity: 100,
  source: "test",
  startTime: Date.now(),
  noteName,
  octave,
  fullNoteName: `${noteName}${octave}`,
  abcNotation: "C", // Not important for our tests
});

describe("ChallengeService", () => {
  // Clear the store before each test
  beforeEach(() => {
    const store = useChallengeStore.getState();
    store.getChallenges().forEach((challenge) => {
      store.removeChallenge(challenge.id);
    });
  });

  describe("updateChallenges", () => {
    it("should advance index when correct note is played", () => {
      // Create a simple challenge
      const store = useChallengeStore.getState();
      const challengeId = store.addChallenge([
        { note: ScaleNote.C, octave: 4 },
        { note: ScaleNote.D, octave: 4 },
      ]);

      // Play the correct first note
      ChallengeUpdateService.updateChallenges(createTestNote("C", 4));

      // Check that the index advanced
      const challenge = store.getChallenges().find((c) => c.id === challengeId);
      expect(challenge?.currentIndex).toBe(1);
    });

    it("should reset progress when wrong note is played", () => {
      // Create a challenge and advance it
      const store = useChallengeStore.getState();
      const challengeId = store.addChallenge([
        { note: ScaleNote.C, octave: 4 },
        { note: ScaleNote.D, octave: 4 },
      ]);

      // Advance to the first note
      ChallengeUpdateService.updateChallenges(createTestNote("C", 4));

      // Verify initial state
      let challenge = store.getChallenges().find((c) => c.id === challengeId);
      expect(challenge?.currentIndex).toBe(1);

      // Play wrong note
      ChallengeUpdateService.updateChallenges(createTestNote("E", 4));

      // Check that progress was reset
      challenge = store.getChallenges().find((c) => c.id === challengeId);
      expect(challenge?.currentIndex).toBe(0);
    });

    it("should remove challenge when completed", () => {
      // Create a single-note challenge
      const store = useChallengeStore.getState();
      const challengeId = store.addChallenge([
        { note: ScaleNote.C, octave: 4 },
      ]);

      // Verify initial state
      let challenge = store.getChallenges().find((c) => c.id === challengeId);
      expect(challenge).toBeDefined();
      expect(challenge?.currentIndex).toBe(0);

      // Play the note to complete the challenge
      ChallengeUpdateService.updateChallenges(createTestNote("C", 4));

      // Check that the challenge was removed
      challenge = store.getChallenges().find((c) => c.id === challengeId);
      console.log("Challenge after completion:", challenge);
      expect(challenge).toBeUndefined();
    });

    it("should handle multiple challenges simultaneously", () => {
      const store = useChallengeStore.getState();

      // Create two challenges
      const challenge1Id = store.addChallenge([
        { note: ScaleNote.C, octave: 4 },
        { note: ScaleNote.D, octave: 4 },
      ]);

      const challenge2Id = store.addChallenge([
        { note: ScaleNote.E, octave: 4 },
        { note: ScaleNote.F, octave: 4 },
      ]);

      // Play C4 - should advance only the first challenge
      ChallengeUpdateService.updateChallenges(createTestNote("C", 4));

      const challenges = store.getChallenges();
      const challenge1 = challenges.find((c) => c.id === challenge1Id);
      const challenge2 = challenges.find((c) => c.id === challenge2Id);

      expect(challenge1?.currentIndex).toBe(1); // Advanced
      expect(challenge2?.currentIndex).toBe(0); // Unchanged
    });
  });

  describe("isChallengeComplete", () => {
    it("should return true when index equals notes length", () => {
      const challenge = {
        id: "1",
        notes: [{ note: ScaleNote.C, octave: 4 }],
        currentIndex: 1,
      };
      expect(ChallengeUpdateService.isChallengeComplete(challenge)).toBe(true);
    });

    it("should return false when index is less than notes length", () => {
      const challenge = {
        id: "1",
        notes: [{ note: ScaleNote.C, octave: 4 }],
        currentIndex: 0,
      };
      expect(ChallengeUpdateService.isChallengeComplete(challenge)).toBe(false);
    });
  });
});
