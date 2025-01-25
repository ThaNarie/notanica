import { describe, it, expect } from "vitest";
import { noteToAbcNotation, notesToAbcNotation, sequenceToAbcNotation } from "../tonal-abc";
import { type Sequence, type SequenceUnit } from "../../types/Sequence";
import { Key } from "tonal";
import { getNote } from "../tonal-helpers";

describe('noteToAbcNotation', () => {
  it('should convert quarter note to ABC notation', () => {
    expect(noteToAbcNotation(getNote('C4'))).toBe('C1/4');
  });

  it('should convert half note to ABC notation', () => {
    expect(noteToAbcNotation(getNote('D4', 'h'))).toBe('D1/2');
  });

  it('should convert eighth note to ABC notation', () => {
    expect(noteToAbcNotation(getNote('E4', 'e'))).toBe('E1/8');
  });

  it('should convert sixteenth note to ABC notation', () => {
    expect(noteToAbcNotation(getNote('F4', 's'))).toBe('F1/16');
  });

  it('should handle accidentals in ABC notation', () => {
    expect(noteToAbcNotation(getNote('F#4'))).toBe('^F1/4');
    expect(noteToAbcNotation(getNote('Bb4'))).toBe('_B1/4');
  });

  it('should handle whole notes in ABC notation', () => {
    expect(noteToAbcNotation(getNote('G4', 'w'))).toBe('G1/1');
  });

  it('should handle dotted notes', () => {
    expect(noteToAbcNotation(getNote('G4', 'q.'))).toBe('G3/8');
  });

  it('should handle higher octave notes', () => {
    expect(noteToAbcNotation(getNote('C5'))).toBe('c1/4');
    expect(noteToAbcNotation(getNote('C6'))).toBe("c'1/4");
  });

  it('should handle lower octave notes', () => {
    expect(noteToAbcNotation(getNote('C3'))).toBe('C,1/4');
    expect(noteToAbcNotation(getNote('C2'))).toBe('C,,1/4');
  });
});

describe('notesToAbcNotation', () => {
  it('should convert single note to ABC notation', () => {
    const unit: SequenceUnit = {
      notes: [getNote('C4')],
      meta: {}
    };
    expect(notesToAbcNotation(unit)).toBe('[C1/4]');
  });

  it('should convert multiple notes to ABC notation', () => {
    const unit: SequenceUnit = {
      notes: [
        getNote('C4'),
        getNote('E4'),
        getNote('G4')
      ],
      meta: {}
    };
    expect(notesToAbcNotation(unit)).toBe('[C1/4 E1/4 G1/4]');
  });

  it('should handle notes with different durations', () => {
    const unit: SequenceUnit = {
      notes: [
        getNote('C4', 'h'),
        getNote('E4', 'q')
      ],
      meta: {}
    };
    expect(notesToAbcNotation(unit)).toBe('[C1/2 E1/4]');
  });

  it('should handle notes with accidentals', () => {
    const unit: SequenceUnit = {
      notes: [
        getNote('F#4'),
        getNote('Bb4')
      ],
      meta: {}
    };
    expect(notesToAbcNotation(unit)).toBe('[^F1/4 _B1/4]');
  });

  it('should handle notes in different octaves', () => {
    const unit: SequenceUnit = {
      notes: [
        getNote('C3'),
        getNote('C4'),
        getNote('C5')
      ],
      meta: {}
    };
    expect(notesToAbcNotation(unit)).toBe('[C,1/4 C1/4 c1/4]');
  });
});

describe('sequenceToAbcNotation', () => {
  it('should convert sequence with treble clef melody', () => {
    const sequence: Sequence = {
      hands: {
        treble: [
          {
            notes: [getNote('C4')],
            meta: {}
          },
          {
            notes: [getNote('E4')],
            meta: {}
          },
          {
            notes: [getNote('G4')],
            meta: {}
          },
          {
            notes: [getNote('C5')],
            meta: {}
          }
        ]
      },
      timeSignature: [4, 4],
      key: Key.majorKey('C')
    };

    const expected = `
X: 1
M: 4/4
L: 1/1
K: Cmajor
V:treble clef=treble
[C1/4] [E1/4] [G1/4] [c1/4]`;

    expect(sequenceToAbcNotation(sequence)).toBe(expected);
  });

  it('should convert sequence with both treble and bass clefs', () => {
    const sequence: Sequence = {
      hands: {
        treble: [
          {
            notes: [getNote('E4')],
            meta: {}
          },
          {
            notes: [getNote('G4')],
            meta: {}
          }
        ],
        bass: [
          {
            notes: [
              getNote('C3', 'h'),
              getNote('E3', 'h'),
              getNote('G3', 'h')
            ],
            meta: {}
          },
          {
            notes: [
              getNote('F3', 'h'),
              getNote('A3', 'h'),
              getNote('C4', 'h')
            ],
            meta: {}
          }
        ]
      },
      timeSignature: [4, 4],
      key: Key.minorKey('C#')
    };

    const expected = `
X: 1
M: 4/4
L: 1/1
K: C#minor
V:treble clef=treble
[E1/4] [G1/4]
V:bass clef=bass
[C,1/2 E,1/2 G,1/2] [F,1/2 A,1/2 C1/2]`;

    expect(sequenceToAbcNotation(sequence)).toBe(expected);
  });
});