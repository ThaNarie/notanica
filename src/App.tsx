import './App.css';
import { useEffect } from 'react';
import { useMidiStore } from './stores/useMidiStore';
import { KeyboardInput } from './components/KeyboardInput';
import { NoteDisplay } from './components/NoteDisplay';
import PianoKeyboard from './components/PianoKeyboard';
import { Field } from './components/Field';
import { MidiDevice } from './components/MidiDevice';

function App(): JSX.Element {
  const { requestAccess } = useMidiStore();

  useEffect(() => {
    requestAccess();
  }, []);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#1a1a1a] text-white">
      <div className="w-[400px] h-screen flex flex-col gap-4 overflow-y-auto p-5 pb-[200px]">
        <h1 className="text-4xl text-zinc-400 text-left">🎹 Notanica</h1>

        <MidiDevice />

        <KeyboardInput />

        <NoteDisplay />
      </div>

      <Field />

      <PianoKeyboard />
    </div>
  );
}

export default App;
