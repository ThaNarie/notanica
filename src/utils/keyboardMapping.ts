type KeyMap = {
  [key: string]: number; // Maps keyboard key to MIDI note number
};

// Middle C (C4) is MIDI note 60
// Lower C (C3) is MIDI note 48

// Upper registry - starting from E key as middle C
export const upperKeyMap: KeyMap = {
  // White keys (QWERTY row)
  q: 57, // A3
  w: 59, // B3
  e: 60, // C4 (middle C)
  r: 62, // D4
  t: 64, // E4
  y: 65, // F4
  u: 67, // G4
  i: 69, // A4
  o: 71, // B4
  p: 72, // C5
  '[': 74, // D5
  ']': 76, // E5

  // Black keys (number row)
  '1': 56, // G#3
  '2': 58, // A#3
  '4': 61, // C#4
  '5': 63, // D#4
  '7': 66, // F#4
  '8': 68, // G#4
  '9': 70, // A#4
  '-': 73, // C#5
  '=': 75, // D#5
};

// Lower registry - starting from C key as C3
export const lowerKeyMap: KeyMap = {
  // White keys (ZXCV row)
  z: 45, // A2
  x: 47, // B2
  c: 48, // C3
  v: 50, // D3
  b: 52, // E3
  n: 53, // F3
  m: 55, // G3
  ',': 57, // A3
  '.': 59, // B3
  '/': 60, // C4

  // Black keys (ASDF row)
  a: 44, // A2
  s: 46, // B2
  f: 49, // C#3
  g: 51, // D#3
  j: 54, // F#3
  k: 56, // G#3
  l: 58, // A#3
  "'": 61, // C#4
};

export const isValidKey = (key: string): boolean => {
  return key.toLowerCase() in upperKeyMap || key.toLowerCase() in lowerKeyMap;
};

export const getMidiNote = (key: string): number | null => {
  const lowerKey = key.toLowerCase();
  return upperKeyMap[lowerKey] || lowerKeyMap[lowerKey] || null;
};
