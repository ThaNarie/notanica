import { useEffect, useRef } from 'react';
import ABCJS from 'abcjs';
import { useNoteStore } from '../stores/useNoteStore';

export const StaffVisualizer = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const { activeNotes } = useNoteStore();

  useEffect(() => {
    if (!divRef.current) return;

    // Convert MIDI notes to ABC notation, split by octave
    const highNotes = activeNotes
      .filter((note) => parseInt(note.fullNoteName.slice(-1)) >= 4)
      .map((note) => {
        // Convert note name to ABC notation
        const [pitch, octave] = [
          note.fullNoteName.slice(0, -1),
          parseInt(note.fullNoteName.slice(-1)),
        ];
        // Convert sharp notation from # to ^ for ABC
        const abcPitch = pitch.replace('#', '');
        const hasSharp = pitch.includes('#');

        // In ABC notation, lowercase letters are one octave higher
        let abcNote = octave >= 5 ? abcPitch.toLowerCase() : abcPitch;
        // Add sharp if needed
        if (hasSharp) {
          abcNote = '^' + abcNote;
        }
        // Add octave markers
        if (octave > 5) {
          abcNote = abcNote + "'".repeat(octave - 5);
        }
        return abcNote;
      });

    const lowNotes = activeNotes
      .filter((note) => parseInt(note.fullNoteName.slice(-1)) < 4)
      .map((note) => {
        const [pitch, octave] = [
          note.fullNoteName.slice(0, -1),
          parseInt(note.fullNoteName.slice(-1)),
        ];
        const abcPitch = pitch.replace('#', '');
        const hasSharp = pitch.includes('#');

        let abcNote = abcPitch;
        if (hasSharp) {
          abcNote = '^' + abcNote;
        }
        if (octave < 4) {
          abcNote = abcNote + ','.repeat(4 - octave);
        }
        return abcNote;
      });

    // Determine which clefs to show based on note octaves
    const hasHighNotes = highNotes.length > 0;
    const hasLowNotes = lowNotes.length > 0;

    // Create voices and notes based on which clefs we need
    let voicesAndNotes = '';
    if (hasHighNotes && !hasLowNotes) {
      voicesAndNotes = `V:1 clef=treble\n[${highNotes.join(' ')}]\n`;
    } else if (!hasHighNotes && hasLowNotes) {
      voicesAndNotes = `V:1 clef=bass\n[${lowNotes.join(' ')}]\n`;
    } else if (hasHighNotes || hasLowNotes) {
      voicesAndNotes = `V:1 clef=treble\n[${highNotes.join(' ')}]\nV:2 clef=bass\n[${lowNotes.join(' ')}]\n`;
    } else {
      voicesAndNotes = `V:1 clef=treble\nz4\n`;
    }

    const abcNotation = `
X: 1
M: 4/4
L: 1/4
K: C
${voicesAndNotes}`;

    ABCJS.renderAbc(divRef.current, abcNotation, {
      add_classes: true,
      selectTypes: [],
      staffwidth: 200,
      paddingbottom: 0,
      scale: 1.5,
    });
  }, [activeNotes]);

  return <div ref={divRef} className="staff-visualizer" />;
};
