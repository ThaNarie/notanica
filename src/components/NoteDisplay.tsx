import { useNoteStore } from '../stores/useNoteStore';
import { StaffVisualizer } from './StaffVisualizer';

export function NoteDisplay(): JSX.Element {
  const { activeNotes } = useNoteStore();

  return (
    <div className="note-display">
      <h2>Active Notes</h2>
      <StaffVisualizer />
      <div className="debug" style={{ marginTop: '2rem' }}>
        Active Notes Count: {activeNotes.length}
      </div>
      {activeNotes.length === 0 ? (
        <p className="no-notes">No keys pressed</p>
      ) : (
        <div className="notes-grid">
          {activeNotes.map((note) => (
            <div key={note.pitch} className="note-card">
              <div className="note-name">{note.fullNoteName}</div>
              <div className="velocity">Vel: {note.velocity}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
