import { DurationValue, Note, type NoteLiteral } from "tonal";
import type { NoteAndDuration } from "../types/Sequence";

type DurationShorthand = 'dl' | 'l' | 'd' | 'w' | 'h' | 'q' | 'e' |'s' | 't' |'sf' | 'h' | 'th';
type DurationInput = `${DurationShorthand}${'' | '.' | '..' | '...'}`

export function getNote(note: NoteLiteral, duration: DurationInput = 'q'): NoteAndDuration {
  return {
    note: Note.get(note),
    duration: DurationValue.get(duration),
  };
}
