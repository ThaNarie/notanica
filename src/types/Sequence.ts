import { type NoteType } from "tonal";
import type { MinorKey, MajorKey } from "@tonaljs/key";
import type { DurationValue } from "@tonaljs/duration-value";
import type { Chord } from "@tonaljs/chord";

export type NoteAndDuration =  {
  note: NoteType;
  duration: DurationValue;
}

export type SequenceUnit = {
  // one or multiple notes that are pressed together at the same time (but can have different durations)
  notes: Array<NoteAndDuration>;
  // store information about the note(s), with what info it was generated.
  meta: {
    chord?: Chord;
    tonic?: NoteType;
  }
};

export type Sequence = {
  hands: {
    treble?: Array<SequenceUnit>;
    bass?: Array<SequenceUnit>;
  };
  // will default to C Major
  key?: MinorKey | MajorKey;
  // will default to 4/4
  timeSignature?: [number, number];
};
