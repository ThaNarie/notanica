import { Chord } from 'tonal';
import { cn } from '../lib/utils';
import { useNoteStore } from '../stores/useNoteStore';
import { StaffVisualizer } from './StaffVisualizer';

export function NoteDisplay(): JSX.Element {
  const { activeNotes, getActiveChord } = useNoteStore();

  return (
    <div
      className={cn(
        'flex flex-col gap-6 bg-neutral-800/50 border border-[#333] rounded-lg p-5 transition-opacity duration-300',
        activeNotes.length > 0 ? 'opacity-100' : 'opacity-50 hover:opacity-100',
      )}
    >
      <div>
        <h2 className="text-xl font-semibold mb-2">Active Notes</h2>
        <StaffVisualizer />
      </div>

      <div>
        <div className="h-px bg-zinc-900" />
        <div className="h-px bg-zinc-800" />
      </div>

      <div>
        <div className="text-sm text-zinc-400 mb-4">Active Notes Count: {activeNotes.length}</div>

        {activeNotes.length === 0 ? (
          <p className="text-zinc-500">No keys pressed</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {activeNotes.map((note) => (
              <div
                key={note.pitch}
                className="flex flex-col gap-1 bg-neutral-900/50 rounded p-3 border border-zinc-800"
              >
                <div className="text-lg font-medium">{note.fullNoteName}</div>
                <div className="text-sm text-zinc-400">Vel: {note.velocity}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {getActiveChord().map((chord) => (
          <div
            key={chord}
            className="flex flex-col gap-1 bg-neutral-900/50 rounded p-3 border border-zinc-800"
          >
            <div className="text-lg font-medium">{chord}</div>
            <div className="text-sm text-zinc-400">{Chord.get(chord).name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
