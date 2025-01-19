/**
 * Represents all possible chord types
 */
export enum ChordType {
    Major = 'major',
    Minor = 'minor',
    Diminished = 'diminished'
}

/**
 * Represents the available musical keys in our system
 */
export enum Key {
    CMajor = 'C Major',
    AMinor = 'A Minor',
    FMajor = 'F Major'
}

/**
 * Represents all possible notes in the chromatic scale
 * Including enharmonic equivalents (e.g., C# = Db)
 */
export enum ScaleNote {
    C = 'C',
    Cs = 'C#',
    Db = 'Db',
    D = 'D',
    Ds = 'D#',
    Eb = 'Eb',
    E = 'E',
    F = 'F',
    Fs = 'F#',
    Gb = 'Gb',
    G = 'G',
    Gs = 'G#',
    Ab = 'Ab',
    A = 'A',
    As = 'A#',
    Bb = 'Bb',
    B = 'B'
}

export type Notes = Array<{ note: ScaleNote; octave: number }>;

/**
 * Service class for handling music theory operations
 * This includes chord progressions, scales, and melody generation
 */
export class MusicGenerator {
    private static readonly CMajorScaleChords: Record<ScaleNote, ChordType | undefined> = {
        [ScaleNote.C]: ChordType.Major,
        [ScaleNote.D]: ChordType.Minor,
        [ScaleNote.E]: ChordType.Minor,
        [ScaleNote.F]: ChordType.Major,
        [ScaleNote.G]: ChordType.Major,
        [ScaleNote.A]: ChordType.Minor,
        [ScaleNote.B]: ChordType.Diminished,
        [ScaleNote.Cs]: undefined,
        [ScaleNote.Db]: undefined,
        [ScaleNote.Ds]: undefined,
        [ScaleNote.Eb]: undefined,
        [ScaleNote.Fs]: undefined,
        [ScaleNote.Gb]: undefined,
        [ScaleNote.Gs]: undefined,
        [ScaleNote.Ab]: undefined,
        [ScaleNote.As]: undefined,
        [ScaleNote.Bb]: undefined
    };

    private static readonly AMinorScaleChords: Record<ScaleNote, ChordType | undefined> = {
        [ScaleNote.A]: ChordType.Minor,
        [ScaleNote.B]: ChordType.Diminished,
        [ScaleNote.C]: ChordType.Major,
        [ScaleNote.D]: ChordType.Minor,
        [ScaleNote.E]: ChordType.Minor,
        [ScaleNote.F]: ChordType.Major,
        [ScaleNote.G]: ChordType.Major,
        [ScaleNote.Cs]: undefined,
        [ScaleNote.Db]: undefined,
        [ScaleNote.Ds]: undefined,
        [ScaleNote.Eb]: undefined,
        [ScaleNote.Fs]: undefined,
        [ScaleNote.Gb]: undefined,
        [ScaleNote.Gs]: undefined,
        [ScaleNote.Ab]: undefined,
        [ScaleNote.As]: undefined,
        [ScaleNote.Bb]: undefined
    };

    private static readonly FMajorScaleChords: Record<ScaleNote, ChordType | undefined> = {
        [ScaleNote.F]: ChordType.Major,
        [ScaleNote.G]: ChordType.Minor,
        [ScaleNote.A]: ChordType.Minor,
        [ScaleNote.Bb]: ChordType.Major,
        [ScaleNote.C]: ChordType.Major,
        [ScaleNote.D]: ChordType.Minor,
        [ScaleNote.E]: ChordType.Diminished,
        [ScaleNote.Cs]: undefined,
        [ScaleNote.Db]: undefined,
        [ScaleNote.Ds]: undefined,
        [ScaleNote.Eb]: undefined,
        [ScaleNote.Fs]: undefined,
        [ScaleNote.Gb]: undefined,
        [ScaleNote.Gs]: undefined,
        [ScaleNote.Ab]: undefined,
        [ScaleNote.As]: undefined,
        [ScaleNote.B]: undefined
    };

    static readonly CHORD_NOTES: Record<ScaleNote, Record<ChordType, ScaleNote[]>> = {
        [ScaleNote.C]: {
            [ChordType.Major]: [ScaleNote.C, ScaleNote.E, ScaleNote.G],
            [ChordType.Minor]: [ScaleNote.C, ScaleNote.Eb, ScaleNote.G],
            [ChordType.Diminished]: [ScaleNote.C, ScaleNote.Eb, ScaleNote.Gb]
        },
        [ScaleNote.Cs]: {
            [ChordType.Major]: [ScaleNote.Cs, ScaleNote.F, ScaleNote.Gs],
            [ChordType.Minor]: [ScaleNote.Cs, ScaleNote.E, ScaleNote.Gs],
            [ChordType.Diminished]: [ScaleNote.Cs, ScaleNote.E, ScaleNote.G]
        },
        [ScaleNote.D]: {
            [ChordType.Major]: [ScaleNote.D, ScaleNote.Fs, ScaleNote.A],
            [ChordType.Minor]: [ScaleNote.D, ScaleNote.F, ScaleNote.A],
            [ChordType.Diminished]: [ScaleNote.D, ScaleNote.F, ScaleNote.Ab]
        },
        [ScaleNote.Eb]: {
            [ChordType.Major]: [ScaleNote.Eb, ScaleNote.G, ScaleNote.Bb],
            [ChordType.Minor]: [ScaleNote.Eb, ScaleNote.Gb, ScaleNote.Bb],
            [ChordType.Diminished]: [ScaleNote.Eb, ScaleNote.Gb, ScaleNote.A]
        },
        [ScaleNote.E]: {
            [ChordType.Major]: [ScaleNote.E, ScaleNote.Gs, ScaleNote.B],
            [ChordType.Minor]: [ScaleNote.E, ScaleNote.G, ScaleNote.B],
            [ChordType.Diminished]: [ScaleNote.E, ScaleNote.G, ScaleNote.Bb]
        },
        [ScaleNote.F]: {
            [ChordType.Major]: [ScaleNote.F, ScaleNote.A, ScaleNote.C],
            [ChordType.Minor]: [ScaleNote.F, ScaleNote.Ab, ScaleNote.C],
            [ChordType.Diminished]: [ScaleNote.F, ScaleNote.Ab, ScaleNote.B]
        },
        [ScaleNote.Fs]: {
            [ChordType.Major]: [ScaleNote.Fs, ScaleNote.As, ScaleNote.Cs],
            [ChordType.Minor]: [ScaleNote.Fs, ScaleNote.A, ScaleNote.Cs],
            [ChordType.Diminished]: [ScaleNote.Fs, ScaleNote.A, ScaleNote.C]
        },
        [ScaleNote.G]: {
            [ChordType.Major]: [ScaleNote.G, ScaleNote.B, ScaleNote.D],
            [ChordType.Minor]: [ScaleNote.G, ScaleNote.Bb, ScaleNote.D],
            [ChordType.Diminished]: [ScaleNote.G, ScaleNote.Bb, ScaleNote.Db]
        },
        [ScaleNote.Ab]: {
            [ChordType.Major]: [ScaleNote.Ab, ScaleNote.C, ScaleNote.Eb],
            [ChordType.Minor]: [ScaleNote.Ab, ScaleNote.B, ScaleNote.Eb],
            [ChordType.Diminished]: [ScaleNote.Ab, ScaleNote.B, ScaleNote.D]
        },
        [ScaleNote.A]: {
            [ChordType.Major]: [ScaleNote.A, ScaleNote.Cs, ScaleNote.E],
            [ChordType.Minor]: [ScaleNote.A, ScaleNote.C, ScaleNote.E],
            [ChordType.Diminished]: [ScaleNote.A, ScaleNote.C, ScaleNote.Eb]
        },
        [ScaleNote.Bb]: {
            [ChordType.Major]: [ScaleNote.Bb, ScaleNote.D, ScaleNote.F],
            [ChordType.Minor]: [ScaleNote.Bb, ScaleNote.Db, ScaleNote.F],
            [ChordType.Diminished]: [ScaleNote.Bb, ScaleNote.Db, ScaleNote.E]
        },
        [ScaleNote.B]: {
            [ChordType.Major]: [ScaleNote.B, ScaleNote.Ds, ScaleNote.Fs],
            [ChordType.Minor]: [ScaleNote.B, ScaleNote.D, ScaleNote.Fs],
            [ChordType.Diminished]: [ScaleNote.B, ScaleNote.D, ScaleNote.F]
        },
        [ScaleNote.Db]: {
            [ChordType.Major]: [ScaleNote.Db, ScaleNote.F, ScaleNote.Ab],
            [ChordType.Minor]: [ScaleNote.Db, ScaleNote.E, ScaleNote.Ab],
            [ChordType.Diminished]: [ScaleNote.Db, ScaleNote.E, ScaleNote.G]
        },
        [ScaleNote.Ds]: {
            [ChordType.Major]: [ScaleNote.Ds, ScaleNote.G, ScaleNote.As],
            [ChordType.Minor]: [ScaleNote.Ds, ScaleNote.Fs, ScaleNote.As],
            [ChordType.Diminished]: [ScaleNote.Ds, ScaleNote.Fs, ScaleNote.A]
        },
        [ScaleNote.Gb]: {
            [ChordType.Major]: [ScaleNote.Gb, ScaleNote.Bb, ScaleNote.Db],
            [ChordType.Minor]: [ScaleNote.Gb, ScaleNote.A, ScaleNote.Db],
            [ChordType.Diminished]: [ScaleNote.Gb, ScaleNote.A, ScaleNote.C]
        },
        [ScaleNote.Gs]: {
            [ChordType.Major]: [ScaleNote.Gs, ScaleNote.C, ScaleNote.Ds],
            [ChordType.Minor]: [ScaleNote.Gs, ScaleNote.B, ScaleNote.Ds],
            [ChordType.Diminished]: [ScaleNote.Gs, ScaleNote.B, ScaleNote.D]
        },
        [ScaleNote.As]: {
            [ChordType.Major]: [ScaleNote.As, ScaleNote.D, ScaleNote.F],
            [ChordType.Minor]: [ScaleNote.As, ScaleNote.Cs, ScaleNote.F],
            [ChordType.Diminished]: [ScaleNote.As, ScaleNote.Cs, ScaleNote.E]
        }
    };

    /**
     * Get all chords of a specific type within a given key
     * @returns Array of chords, where each chord is an array of notes that make up that chord
     */
    static getChordsOfType(key: Key, chordType: ChordType): ScaleNote[][] {
        const scaleChords = this.getScaleChordsForKey(key);
        return Object.entries(scaleChords)
            .filter(([_, type]) => type === chordType)
            .map(([note, _]) => this.CHORD_NOTES[note as ScaleNote][chordType]);
    }

    /**
     * Get all notes that belong to a given key
     */
    static getKeyNotes(key: Key): ScaleNote[] {
        const scaleChords = this.getScaleChordsForKey(key);
        return Object.entries(scaleChords)
            .filter(([_, type]) => type !== undefined)
            .map(([note, _]) => note as ScaleNote);
    }

    /**
     * Generate a simple melody within a given key
     */
    static generateMelody(key: Key, length: number): ScaleNote[] {
        const notes = this.getKeyNotes(key);
        if (length <= 0 || notes.length === 0) return [];

        const melody: ScaleNote[] = [notes[0]]; // Start with the tonic
        let currentPosition = 0;

        // Weighted intervals for more musical movement
        const intervals = [
            1, 1,  // Step up (weighted)
            -1, -1,  // Step down (weighted)
            2,  // Skip up
            -2,  // Skip down
            0   // Stay
        ];

        for (let i = 1; i < length; i++) {
            // As we get closer to the end, increase chance of moving toward tonic
            const nearEnd = i > length * 0.7;
            
            // Pick a random interval
            const interval = intervals[Math.floor(Math.random() * intervals.length)];
            
            // Calculate new position
            let newPosition = currentPosition + interval;
            
            // If we're near the end, try to move towards the tonic
            if (nearEnd && Math.random() > 0.5) {
                newPosition = currentPosition + (currentPosition > 0 ? -1 : 1);
            }

            // Keep within bounds
            newPosition = Math.max(0, Math.min(notes.length - 1, newPosition));
            
            melody.push(notes[newPosition]);
            currentPosition = newPosition;
        }

        return melody;
    }

    /**
     * Get a more detailed representation of a melody including octave suggestions
     */
    static getMelodyWithOctaves(melody: ScaleNote[]): Notes {
        if (melody.length === 0) return [];

        const result: Notes = [];
        let currentOctave = 4; // Start in middle octave

        for (let i = 0; i < melody.length; i++) {
            const currentNote = melody[i];
            
            if (i > 0) {
                const prevNote = melody[i - 1];
                const prevIndex = Object.values(ScaleNote).indexOf(prevNote);
                const currentIndex = Object.values(ScaleNote).indexOf(currentNote);
                
                // Adjust octave if we wrapped around the scale
                if (Math.abs(currentIndex - prevIndex) > 4) {
                    if (currentIndex < prevIndex) {
                        currentOctave++;
                    } else {
                        currentOctave--;
                    }
                }
            }

            result.push({ note: currentNote, octave: currentOctave });
        }

        return result;
    }

    /**
     * Get the chord structure for a given key
     */
    private static getScaleChordsForKey(key: Key): Record<ScaleNote, ChordType | undefined> {
        switch (key) {
            case Key.CMajor:
                return this.CMajorScaleChords;
            case Key.AMinor:
                return this.AMinorScaleChords;
            case Key.FMajor:
                return this.FMajorScaleChords;
        }
    }
}
