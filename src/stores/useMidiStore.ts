import { create } from 'zustand';
import { useNoteStore } from './useNoteStore';

interface MIDIDevice {
  id: string;
  name: string;
  manufacturer: string;
  connection: 'open' | 'closed' | 'pending';
}

interface MIDIState {
  hasAccess: boolean;
  devices: MIDIDevice[];
  selectedDevice: MIDIDevice | null;
  midiAccess: MIDIAccess | null;
  requestAccess: () => Promise<void>;
  listDevices: () => void;
  connectDevice: (deviceId: string) => Promise<void>;
  disconnectDevice: (deviceId: string) => void;
  handleMIDIMessage: (message: MIDIMessageEvent) => void;
}

export const useMidiStore = create<MIDIState>((set, get) => ({
  hasAccess: false,
  devices: [],
  selectedDevice: null,
  midiAccess: null,

  requestAccess: async () => {
    try {
      const midiAccess = await navigator.requestMIDIAccess();
      set({ midiAccess, hasAccess: true });

      midiAccess.onstatechange = (event) => {
        const state = get();
        state.listDevices();
      };

      get().listDevices();
    } catch (error) {
      console.error('Failed to get MIDI access:', error);
      set({ hasAccess: false });
    }
  },

  listDevices: () => {
    const { midiAccess } = get();
    if (!midiAccess) return;

    const devices: MIDIDevice[] = [];
    midiAccess.inputs.forEach((input) => {
      devices.push({
        id: input.id,
        name: input.name || 'Unknown Device',
        manufacturer: input.manufacturer || 'Unknown Manufacturer',
        connection: input.connection,
      });
    });

    set({ devices });
  },

  connectDevice: async (deviceId: string) => {
    const { midiAccess, devices } = get();
    if (!midiAccess) return;

    const input = midiAccess.inputs.get(deviceId);
    if (!input) return;

    const device = devices.find((d) => d.id === deviceId);
    if (!device) return;

    input.onmidimessage = get().handleMIDIMessage;
    set({ selectedDevice: device });
  },

  disconnectDevice: (deviceId: string) => {
    const { midiAccess, selectedDevice } = get();
    if (!midiAccess || !selectedDevice || selectedDevice.id !== deviceId) return;

    const input = midiAccess.inputs.get(deviceId);
    if (input) {
      input.onmidimessage = null;
    }

    set({ selectedDevice: null });
  },

  handleMIDIMessage: (message: MIDIMessageEvent) => {
    if (!message.data) return;
    const [command, note, velocity] = message.data;

    // Get the note store's actions
    const { pressNote, releaseNote } = useNoteStore.getState();

    console.log('MIDI Message:', { command, note, velocity }); // Debug log

    // Note On message
    if (command === 144 && velocity > 0) {
      console.log('Adding note:', note); // Debug log
      pressNote({
        pitch: note,
        velocity,
        source: 'midi',
      });
    }
    // Note Off message
    else if (command === 128 || (command === 144 && velocity === 0)) {
      console.log('Removing note:', note); // Debug log
      releaseNote(note);
    }
  },
}));
