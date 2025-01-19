import { create } from 'zustand';
import { ChallengeUpdateService } from '../services/ChallengeUpdateService';

export interface Note {
  // Core properties
  pitch: number; // MIDI note number (0-127)
  velocity: number; // Note velocity/intensity (0-127)
  source: string; // What triggered this note (e.g., 'midi', 'keyboard', etc.)

  // Timing
  startTime: number; // When the note was pressed
  endTime?: number; // When the note was released (undefined if still pressed)
  duration?: number; // Time in milliseconds the note was held (undefined if still pressed)

  // Musical notation
  noteName: string; // e.g., 'C#'
  octave: number; // e.g., 4
  fullNoteName: string; // e.g., 'C#4'
  abcNotation: string; // ABC notation (e.g., '^C' for C#, '_B' for Bb)
}

interface NoteState {
  activeNotes: Note[];
  releasedNotes: Note[]; // History of released notes
  // Actions
  pressNote: (note: Pick<Note, 'pitch' | 'velocity' | 'source'>) => void;
  releaseNote: (pitch: number) => void;
  releaseAllNotes: () => void;
  // Queries
  isNotePressed: (pitch: number) => boolean;
  getNoteInfo: (
    pitch: number,
  ) => Omit<Note, 'velocity' | 'source' | 'startTime' | 'endTime' | 'duration'>;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ABC_NOTATION: Record<string, string> = {
  C: 'C',
  'C#': '^C',
  D: 'D',
  'D#': '^D',
  E: 'E',
  F: 'F',
  'F#': '^F',
  G: 'G',
  'G#': '^G',
  A: 'A',
  'A#': '^A',
  B: 'B',
  Db: '_D',
  Eb: '_E',
  Gb: '_G',
  Ab: '_A',
  Bb: '_B',
};

export const useNoteStore = create<NoteState>((set, get) => ({
  activeNotes: [
    // {
    //   pitch: 56,
    //   velocity: 100,
    //   source: 'default',
    //   startTime: Date.now(),
    //   noteName: 'G#',
    //   octave: 3,
    //   fullNoteName: 'G#3',
    //   abcNotation: '^G',
    // },
    // {
    //   pitch: 61,
    //   velocity: 100,
    //   source: 'default',
    //   startTime: Date.now(),
    //   noteName: 'C#',
    //   octave: 4,
    //   fullNoteName: 'C#4',
    //   abcNotation: '^C',
    // },
    // {
    //   pitch: 64,
    //   velocity: 100,
    //   source: 'default',
    //   startTime: Date.now(),
    //   noteName: 'E',
    //   octave: 4,
    //   fullNoteName: 'E4',
    //   abcNotation: 'E',
    // },
  ],
  releasedNotes: [],

  getNoteInfo: (pitch: number) => {
    const octave = Math.floor(pitch / 12) - 1;
    const noteName = NOTE_NAMES[pitch % 12];
    const fullNoteName = `${noteName}${octave}`;
    const abcNotation = ABC_NOTATION[noteName] || noteName;

    return {
      pitch,
      noteName,
      octave,
      fullNoteName,
      abcNotation,
    };
  },

  pressNote: (note) => {
    const noteInfo = get().getNoteInfo(note.pitch);
    const newNote: Note = {
      ...noteInfo,
      ...note,
      startTime: Date.now(),
    };

    set((state) => {
      const newActiveNotes = [...state.activeNotes, newNote].sort((a, b) => a.pitch - b.pitch);
      return { activeNotes: newActiveNotes };
    });

    ChallengeUpdateService.updateChallenges(newNote);
  },

  releaseNote: (pitch) => {
    const now = Date.now();
    set((state) => {
      const noteToRelease = state.activeNotes.find((n) => n.pitch === pitch);
      if (!noteToRelease) return state;

      const releasedNote = {
        ...noteToRelease,
        endTime: now,
        duration: now - noteToRelease.startTime,
      };

      return {
        activeNotes: state.activeNotes.filter((n) => n.pitch !== pitch),
        releasedNotes: [releasedNote, ...state.releasedNotes].slice(0, 1000), // Add to start for reverse chronological order and keep last 1000 notes
      };
    });
  },

  releaseAllNotes: () =>
    set((state) => {
      const now = Date.now();
      const releasedNotes = state.activeNotes.map((note) => ({
        ...note,
        endTime: now,
        duration: now - note.startTime,
      }));
      return {
        activeNotes: [],
        releasedNotes: [...releasedNotes, ...state.releasedNotes].slice(0, 1000), // Keep last 1000 notes
      };
    }),

  isNotePressed: (pitch) => {
    const state = get();
    return state.activeNotes.some((note) => note.pitch === pitch);
  },
}));
