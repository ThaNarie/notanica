import { useEffect } from 'react';
import { useMidiStore } from './stores/useMidiStore';
import './App.css';
import { StaffVisualizer } from './components/StaffVisualizer';

function App(): JSX.Element {
  const {
    hasAccess,
    devices,
    selectedDevice,
    activeNotes,
    requestAccess,
    connectDevice,
    disconnectDevice,
    getNoteNameWithOctave,
  } = useMidiStore();

  useEffect(() => {
    requestAccess();
  }, []);

  return (
    <div className="app">
      <h1>MIDI Piano Controller</h1>

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

      <div className="staff-container">
        <h2>Musical Staff</h2>
        <StaffVisualizer />
      </div>

      <div className="note-display">
        <h2>Active Notes</h2>
        <div className="debug">Active Notes Count: {activeNotes.length}</div>
        {activeNotes.length === 0 ? (
          <p className="no-notes">No keys pressed</p>
        ) : (
          <div className="notes-grid">
            {activeNotes.map((note) => (
              <div key={note.note} className="note-card">
                <div className="note-name">{getNoteNameWithOctave(note.note)}</div>
                <div className="velocity">Velocity: {note.velocity}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
