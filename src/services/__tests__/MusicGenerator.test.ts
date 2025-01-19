import { MusicGenerator, Key, ChordType, ScaleNote } from '../MusicGenerator';

describe('MusicGenerator', () => {
    describe('getChordsOfType', () => {
        it('should return all major chords in C major scale', () => {
            const majorChords = MusicGenerator.getChordsOfType(Key.CMajor, ChordType.Major);
            expect(majorChords).toEqual([
                [ScaleNote.C, ScaleNote.E, ScaleNote.G],  // C major
                [ScaleNote.F, ScaleNote.A, ScaleNote.C],  // F major
                [ScaleNote.G, ScaleNote.B, ScaleNote.D],  // G major
            ]);
        });

        it('should return all minor chords in C major scale', () => {
            const minorChords = MusicGenerator.getChordsOfType(Key.CMajor, ChordType.Minor);
            expect(minorChords).toEqual([
                [ScaleNote.D, ScaleNote.F, ScaleNote.A],  // D minor
                [ScaleNote.E, ScaleNote.G, ScaleNote.B],  // E minor
                [ScaleNote.A, ScaleNote.C, ScaleNote.E],  // A minor
            ]);
        });

        it('should return diminished chords in C major scale', () => {
            const dimChords = MusicGenerator.getChordsOfType(Key.CMajor, ChordType.Diminished);
            expect(dimChords).toEqual([
                [ScaleNote.B, ScaleNote.D, ScaleNote.F],  // B diminished
            ]);
        });

        it('should return correct major chords in F major scale', () => {
            const majorChords = MusicGenerator.getChordsOfType(Key.FMajor, ChordType.Major);
            expect(majorChords).toEqual([
                [ScaleNote.F, ScaleNote.A, ScaleNote.C],   // F major
                [ScaleNote.Bb, ScaleNote.D, ScaleNote.F],  // Bb major
                [ScaleNote.C, ScaleNote.E, ScaleNote.G],   // C major
            ]);
        });
    });

    describe('getKeyNotes', () => {
        it('should return all notes in C major scale', () => {
            const notes = MusicGenerator.getKeyNotes(Key.CMajor);
            expect(notes).toEqual([
                ScaleNote.C,
                ScaleNote.D,
                ScaleNote.E,
                ScaleNote.F,
                ScaleNote.G,
                ScaleNote.A,
                ScaleNote.B
            ]);
        });

        it('should return all notes in F major scale', () => {
            const notes = MusicGenerator.getKeyNotes(Key.FMajor);
            expect(notes).toEqual([
                ScaleNote.F,
                ScaleNote.G,
                ScaleNote.A,
                ScaleNote.Bb,
                ScaleNote.C,
                ScaleNote.D,
                ScaleNote.E
            ]);
        });
    });

    describe('generateMelody', () => {
        it('should generate melody of correct length', () => {
            const length = 8;
            const melody = MusicGenerator.generateMelody(Key.CMajor, length);
            expect(melody).toHaveLength(length);
        });

        it('should start with the tonic note', () => {
            const melody = MusicGenerator.generateMelody(Key.CMajor, 5);
            expect(melody[0]).toBe(ScaleNote.C);

            const melodyF = MusicGenerator.generateMelody(Key.FMajor, 5);
            expect(melodyF[0]).toBe(ScaleNote.F);
        });

        it('should only use notes from the specified key', () => {
            const melody = MusicGenerator.generateMelody(Key.CMajor, 20);
            const cMajorNotes = new Set(MusicGenerator.getKeyNotes(Key.CMajor));
            
            melody.forEach(note => {
                expect(cMajorNotes.has(note)).toBe(true);
            });
        });

        it('should return empty array for invalid length', () => {
            expect(MusicGenerator.generateMelody(Key.CMajor, 0)).toEqual([]);
            expect(MusicGenerator.generateMelody(Key.CMajor, -1)).toEqual([]);
        });
    });

    describe('getMelodyWithOctaves', () => {
        it('should return empty array for empty melody', () => {
            expect(MusicGenerator.getMelodyWithOctaves([])).toEqual([]);
        });

        it('should start with octave 4', () => {
            const melody = [ScaleNote.C];
            const withOctaves = MusicGenerator.getMelodyWithOctaves(melody);
            expect(withOctaves[0]).toEqual({ note: ScaleNote.C, octave: 4 });
        });

        it('should handle octave changes correctly', () => {
            const melody = [ScaleNote.C, ScaleNote.B, ScaleNote.C];
            const withOctaves = MusicGenerator.getMelodyWithOctaves(melody);
            
            expect(withOctaves).toEqual([
                { note: ScaleNote.C, octave: 4 },
                { note: ScaleNote.B, octave: 3 },
                { note: ScaleNote.C, octave: 4 }
            ]);
        });
    });
});
