import { useEffect, useRef } from 'react';
import ABCJS from 'abcjs';
import { useNoteStore } from '../stores/useNoteStore';

export const StaffVisualizer = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const { activeNotes } = useNoteStore();

  useEffect(() => {
    if (!divRef.current) return;

    // Convert MIDI notes to ABC notation
    const abcNotes = activeNotes
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
        } else if (octave < 4) {
          abcNote = abcNote + ','.repeat(4 - octave);
        }
        return abcNote;
      })
      .join(' ');

    const abcNotation = `
X: 1
M: 4/4
L: 1/4
K: C
${abcNotes || 'G,^C^E' || 'z4'}
`;

    ABCJS.renderAbc(divRef.current, abcNotation, {
      add_classes: true,
      selectTypes: [],
      staffwidth: 200,
      paddingbottom: 0,
    });
  }, [activeNotes]);

  return <div ref={divRef} className="staff-visualizer" />;
};
