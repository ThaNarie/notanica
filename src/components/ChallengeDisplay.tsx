import { Challenge as ChallengeType } from '../stores/useChallengeStore';
import { AbcVisual } from './AbcVisual';

interface ChallengeProps extends ChallengeType {}

export function ChallengeDisplay({ id, notes, name, currentIndex }: ChallengeProps) {
  console.log(notes);
  return (
    <div className="bg-white/5 border border-[#333] rounded-lg p-4 m-4">
      <div className="mb-4">
        <h3 className="m-0 text-white text-lg">{name || `Challenge ${id.slice(0, 4)}`}</h3>
      </div>
      <div
        className="bg-black/20 rounded p-4"
        style={{
          '--note-color-0': currentIndex > 0 ? 'red' : 'inherit',
          '--note-color-1': currentIndex > 1 ? 'red' : 'inherit',
          '--note-color-2': currentIndex > 2 ? 'red' : 'inherit',
          '--note-color-3': currentIndex > 3 ? 'red' : 'inherit',
          '--note-color-4': currentIndex > 4 ? 'red' : 'inherit',
        }}
      >
        <style>
          {`
            .abcjs-n0 { fill: var(--note-color-0); }
            .abcjs-n1 { fill: var(--note-color-1); }
            .abcjs-n2 { fill: var(--note-color-2); }
            .abcjs-n3 { fill: var(--note-color-3); }
            .abcjs-n4 { fill: var(--note-color-4); }
          `}
        </style>
        <AbcVisual notes={notes.reduce((acc, note) => acc + note.note, '')} />
      </div>
    </div>
  );
}
