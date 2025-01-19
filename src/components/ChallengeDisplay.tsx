import { Challenge as ChallengeType } from '../stores/useChallengeStore';
import { AbcVisual } from './AbcVisual';

interface ChallengeProps extends ChallengeType {}

export function ChallengeDisplay({ id, notes, name, currentIndex }: ChallengeProps) {
  console.log(notes);
  return (
    <div className="challenge">
      <div className="challenge-header">
        <h3>{name || `Challenge ${id.slice(0, 4)}`}</h3>
      </div>
      <p>
        {currentIndex}/{notes.length}
      </p>
      <div className="challenge-staff">
        {/* TODO: use proper transformer */}
        <AbcVisual notes={notes.reduce((acc, note) => acc + note.note, '')} />
      </div>
    </div>
  );
}
