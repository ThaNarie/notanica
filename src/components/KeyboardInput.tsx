import { useEffect } from 'react';
import { useNoteStore } from '../stores/useNoteStore';
import { getMidiNote } from '../utils/keyboardMapping';

const DEFAULT_VELOCITY = 100;

export function KeyboardInput() {
  const { pressNote, releaseNote } = useNoteStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if it's a repeated keypress or if modifier keys are pressed
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      const midiNote = getMidiNote(event.key);
      if (midiNote !== null) {
        event.preventDefault();
        pressNote({
          pitch: midiNote,
          velocity: DEFAULT_VELOCITY,
          source: 'keyboard',
        });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const midiNote = getMidiNote(event.key);
      if (midiNote !== null) {
        event.preventDefault();
        releaseNote(midiNote);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressNote, releaseNote]);

  // This component doesn't render anything visible
  return null;
}
