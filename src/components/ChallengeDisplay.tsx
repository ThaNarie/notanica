import { Challenge as ChallengeType } from '../stores/useChallengeStore';
import type { Sequence, SequenceUnit } from '../types/Sequence';
import { getNote } from '../utils/tonal-helpers';
import { AbcVisual } from './AbcVisual';

interface ChallengeProps extends ChallengeType {}

export function ChallengeDisplay({ id, notes, name, currentIndex }: ChallengeProps) {
  // temp conversion
  const noteSequence: Array<SequenceUnit> = notes.map((note) => {
    return {
      notes: [getNote(note.note + note.octave)],
      meta: {},
    };
  });

  const sequence: Sequence = {
    hands: {
      treble: noteSequence,
    },
  };

  const styles = {
    '--note-color-0': currentIndex > 0 ? 'red' : 'inherit',
    '--note-color-1': currentIndex > 1 ? 'red' : 'inherit',
    '--note-color-2': currentIndex > 2 ? 'red' : 'inherit',
    '--note-color-3': currentIndex > 3 ? 'red' : 'inherit',
    '--note-color-4': currentIndex > 4 ? 'red' : 'inherit',
  } as any;

  return (
    <div className="bg-white/5 border border-[#333] rounded-lg p-4 m-4">
      <div className="mb-4">
        <h3 className="m-0 text-white text-lg">{name || `Challenge ${id.slice(0, 4)}`}</h3>
      </div>
      <div className="bg-black/20 rounded p-4" style={styles}>
        <style>
          {`
            .abcjs-n0 { fill: var(--note-color-0); }
            .abcjs-n1 { fill: var(--note-color-1); }
            .abcjs-n2 { fill: var(--note-color-2); }
            .abcjs-n3 { fill: var(--note-color-3); }
            .abcjs-n4 { fill: var(--note-color-4); }
          `}
        </style>
        <AbcVisual sequence={sequence} />
      </div>
    </div>
  );
}
