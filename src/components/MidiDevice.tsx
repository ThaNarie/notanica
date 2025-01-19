import { useMidiStore } from '../stores/useMidiStore';

export function MidiDevice(): JSX.Element {
  const { hasAccess, devices, selectedDevice, connectDevice, disconnectDevice } = useMidiStore();

  return (
    <div className="flex flex-col gap-6 bg-neutral-800/50 border border-[#333] rounded-lg p-5 transition-opacity duration-300 opacity-50 hover:opacity-100">
      <div>
        <h2 className="text-xl font-semibold mb-2">MIDI Status</h2>
        <p>
          Access:{' '}
          <span className={hasAccess ? 'text-green-700' : 'text-red-800'}>
            {hasAccess ? 'Granted' : 'Not Granted'}
          </span>
        </p>
      </div>

      <div>
        <div className="h-px bg-zinc-900" />
        <div className="h-px bg-zinc-800" />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Available Devices</h2>
        {devices.length === 0 ? (
          <p>No MIDI devices found</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {devices.map((device) => (
              <li key={device.id} className="flex items-center justify-between">
                <span>
                  {device.name} ({device.manufacturer})
                </span>
                {selectedDevice?.id === device.id ? (
                  <button
                    onClick={() => disconnectDevice(device.id)}
                    className="px-3 py-1 bg-zinc-700 hover:bg-red-700 transition-colors duration-300 rounded text-sm"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => connectDevice(device.id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 duration-300 rounded text-sm transition-colors"
                  >
                    Connect
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedDevice && (
        <>
          <div>
            <div className="h-px bg-zinc-900" />
            <div className="h-px bg-zinc-800" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Connected Device</h2>
            <p>{selectedDevice.name}</p>
          </div>
        </>
      )}
    </div>
  );
}
