import './App.css';
import { useEffect } from 'react';
import { useMidiStore } from './stores/useMidiStore';
import { StaffVisualizer } from './components/StaffVisualizer';
import { KeyboardInput } from './components/KeyboardInput';
import { NoteDisplay } from './components/NoteDisplay';
import PianoKeyboard from './components/PianoKeyboard';
import { Field } from './components/Field';

function App(): JSX.Element {
  const { hasAccess, devices, selectedDevice, requestAccess, connectDevice, disconnectDevice } =
    useMidiStore();

  useEffect(() => {
    requestAccess();
  }, []);

  return (
    <div className="app">
      <div className="left-container">
        <h1>Notanica</h1>

        <div className="midi-status">
          <h2>MIDI Status</h2>
          <p>Access: {hasAccess ? 'Granted' : 'Not Granted'}</p>
        </div>

        <div className="device-list">
          <h2>Available Devices</h2>
          {devices.length === 0 ? (
            <p>No MIDI devices found</p>
          ) : (
            <ul>
              {devices.map((device) => (
                <li key={device.id}>
                  {device.name} ({device.manufacturer})
                  {selectedDevice?.id === device.id ? (
                    <button onClick={() => disconnectDevice(device.id)}>Disconnect</button>
                  ) : (
                    <button onClick={() => connectDevice(device.id)}>Connect</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedDevice && (
          <div className="active-device">
            <h2>Connected Device</h2>
            <p>{selectedDevice.name}</p>
          </div>
        )}

        <KeyboardInput />

        <NoteDisplay />
      </div>

      <Field />

      <PianoKeyboard />
    </div>
  );
}

export default App;
