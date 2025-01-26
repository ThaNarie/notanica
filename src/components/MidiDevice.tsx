import { useMidiStore } from '../stores/useMidiStore';

export function MidiDevice(): JSX.Element {
  const {
    hasAccess,
    devices,
    selectedDevice,
    connectDevice,
    disconnectDevice,
    isCollapsed,
    toggleCollapsed,
  } = useMidiStore();

  return (
    <div className="relative flex flex-col gap-6 bg-neutral-800/50 border border-[#333] rounded-lg p-5 transition-all duration-300 opacity-50 hover:opacity-100">
      <button
        onClick={toggleCollapsed}
        className="absolute z-10 top-5 right-5 text-zinc-400 hover:text-white transition-colors duration-300"
        aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
      >
        {isCollapsed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 17a1 1 0 01-1-1V5.414L5.707 8.707a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 11-1.414 1.414L11 5.414V16a1 1 0 01-1 1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      {isCollapsed && (
        <span className="ml-2 text-zinc-400">
          {!hasAccess
            ? 'MIDI Access denied'
            : devices.length === 0
              ? 'No MIDI devices found'
              : selectedDevice
                ? `MIDI Connected to ${selectedDevice.name}`
                : `${devices.length} MIDI device${devices.length > 1 ? 's' : ''} available`}
        </span>
      )}

      {!isCollapsed && (
        <div className="relative">
          <h2 className="text-xl font-semibold mb-2">MIDI Status</h2>
          <p>
            Access:{' '}
            <span className={hasAccess ? 'text-green-700' : 'text-red-800'}>
              {hasAccess ? 'Granted' : 'Not Granted'}
            </span>
          </p>
        </div>
      )}
      {!isCollapsed && (
        <div className={`space-y-6 overflow-hidden transition-all duration-300`}>
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
      )}
    </div>
  );
}
