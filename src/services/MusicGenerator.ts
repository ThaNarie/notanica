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

export enum ScaleNote {
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
    A = 'A',
    B = 'B',
    Bb = 'Bb'  // Added for F major scale
}

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
        [ScaleNote.Bb]: undefined  // Not used in C major
    };

    private static readonly AMinorScaleChords: Record<ScaleNote, ChordType | undefined> = {
        [ScaleNote.A]: ChordType.Minor,
        [ScaleNote.B]: ChordType.Diminished,
        [ScaleNote.C]: ChordType.Major,
        [ScaleNote.D]: ChordType.Minor,
        [ScaleNote.E]: ChordType.Minor,
        [ScaleNote.F]: ChordType.Major,
        [ScaleNote.G]: ChordType.Major,
        [ScaleNote.Bb]: undefined  // Not used in A minor
    };

    private static readonly FMajorScaleChords: Record<ScaleNote, ChordType | undefined> = {
        [ScaleNote.F]: ChordType.Major,
        [ScaleNote.G]: ChordType.Minor,
        [ScaleNote.A]: ChordType.Minor,
        [ScaleNote.Bb]: ChordType.Major,
        [ScaleNote.C]: ChordType.Major,
        [ScaleNote.D]: ChordType.Minor,
        [ScaleNote.E]: ChordType.Diminished,
        [ScaleNote.B]: undefined  // Not used in F major
    };

    private static readonly CHORD_NOTES: Record<ScaleNote, Record<ChordType, ScaleNote[]>> = {
        [ScaleNote.C]: {
            [ChordType.Major]: [ScaleNote.C, ScaleNote.E, ScaleNote.G],
            [ChordType.Minor]: [ScaleNote.C, ScaleNote.E, ScaleNote.G], // Not used in our scales
            [ChordType.Diminished]: [ScaleNote.C, ScaleNote.E, ScaleNote.G], // Not used in our scales
        },
        [ScaleNote.D]: {
            [ChordType.Major]: [ScaleNote.D, ScaleNote.F, ScaleNote.A], // Not used in our scales
            [ChordType.Minor]: [ScaleNote.D, ScaleNote.F, ScaleNote.A],
            [ChordType.Diminished]: [ScaleNote.D, ScaleNote.F, ScaleNote.A], // Not used in our scales
        },
        [ScaleNote.E]: {
            [ChordType.Major]: [ScaleNote.E, ScaleNote.G, ScaleNote.B], // Not used in our scales
            [ChordType.Minor]: [ScaleNote.E, ScaleNote.G, ScaleNote.B],
            [ChordType.Diminished]: [ScaleNote.E, ScaleNote.G, ScaleNote.Bb], // In F major
        },
        [ScaleNote.F]: {
            [ChordType.Major]: [ScaleNote.F, ScaleNote.A, ScaleNote.C],
            [ChordType.Minor]: [ScaleNote.F, ScaleNote.A, ScaleNote.C], // Not used in our scales
            [ChordType.Diminished]: [ScaleNote.F, ScaleNote.A, ScaleNote.C], // Not used in our scales
        },
        [ScaleNote.G]: {
            [ChordType.Major]: [ScaleNote.G, ScaleNote.B, ScaleNote.D], // In C major
            [ChordType.Minor]: [ScaleNote.G, ScaleNote.Bb, ScaleNote.D], // In F major
            [ChordType.Diminished]: [ScaleNote.G, ScaleNote.Bb, ScaleNote.D], // Not used in our scales
        },
        [ScaleNote.A]: {
            [ChordType.Major]: [ScaleNote.A, ScaleNote.C, ScaleNote.E], // Not used in our scales
            [ChordType.Minor]: [ScaleNote.A, ScaleNote.C, ScaleNote.E],
            [ChordType.Diminished]: [ScaleNote.A, ScaleNote.C, ScaleNote.E], // Not used in our scales
        },
        [ScaleNote.B]: {
            [ChordType.Major]: [ScaleNote.B, ScaleNote.D, ScaleNote.F], // Not used in our scales
            [ChordType.Minor]: [ScaleNote.B, ScaleNote.D, ScaleNote.F], // Not used in our scales
            [ChordType.Diminished]: [ScaleNote.B, ScaleNote.D, ScaleNote.F],
        },
        [ScaleNote.Bb]: {
            [ChordType.Major]: [ScaleNote.Bb, ScaleNote.D, ScaleNote.F], // In F major
            [ChordType.Minor]: [ScaleNote.Bb, ScaleNote.D, ScaleNote.F], // Not used in our scales
            [ChordType.Diminished]: [ScaleNote.Bb, ScaleNote.D, ScaleNote.F], // Not used in our scales
        },
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
    static getMelodyWithOctaves(melody: ScaleNote[]): Array<{ note: ScaleNote; octave: number }> {
        if (melody.length === 0) return [];

        const result: Array<{ note: ScaleNote; octave: number }> = [];
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
