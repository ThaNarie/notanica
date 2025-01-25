import { AbcNotation, Key, Note } from "tonal";
import type {
  NoteAndDuration,
  Sequence,
  SequenceUnit,
} from "../types/Sequence";

export function noteToAbcNotation(note: NoteAndDuration): string {
  const [numerator, denominator] = note.duration.fraction;
  return (
    AbcNotation.scientificToAbcNotation(note.note.name) +
    `${numerator}/${denominator}`
  );
}

export function notesToAbcNotation(unit: SequenceUnit): string {
  const notes = unit.notes.map(noteToAbcNotation);

  return `[${notes.join(" ")}]`;
}

export function sequenceToAbcNotation(sequence: Sequence): string {
  const [upperTime, lowerTime] = sequence.timeSignature ?? [4, 4];
  const key = sequence.key ?? Key.majorKey("C");

  const voices = Object.entries(sequence.hands)
    .map(([voice, notes]) => {
      return `V:${voice} clef=${voice}
${notes.map(notesToAbcNotation).join(" ")}`;
    })
    .join("\n");

  // note, the L (default note duration) is set to "1", so the note length calculations/annotations are easier
  return `
X: 1
M: ${upperTime}/${lowerTime}
L: 1/1
K: ${key.tonic}${key.type}
${voices}`;
}
