import { Challenge as ChallengeType } from '../stores/useChallengeStore';
import { AbcVisual } from './AbcVisual';

interface ChallengeProps extends ChallengeType {}

export function Challenge({ id, notes, name }: ChallengeProps) {
  console.log(notes);
  return (
    <div className="challenge">
      <div className="challenge-header">
        <h3>{name || `Challenge ${id.slice(0, 4)}`}</h3>
      </div>
      <div className="challenge-staff">
        {/* TODO: use proper transformer */}
        <AbcVisual notes={notes.reduce((acc, note) => acc + note.note, '')} />
      </div>
    </div>
  );
}
