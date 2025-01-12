import React from 'react';
import styled from '@emotion/styled';
import { useNoteStore } from '../stores/useNoteStore';
import { upperKeyMap, lowerKeyMap } from '../utils/keyboardMapping';

const whiteKeyWidth = 50;
const blackKeyWidth = 28;
const pianoHeight = 140;

const KeyboardContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: flex-start;
`;

const KeyLabel = styled.span<{
  isBlack?: boolean;
  position: 'top' | 'bottom';
  labelPosition?: 'left' | 'center' | 'right';
}>`
  position: absolute;
  ${(props) => (props.position === 'top' ? 'top: 8px;' : 'bottom: 8px;')}
  ${(props) => {
    if (props.position === 'top' && props.labelPosition) {
      switch (props.labelPosition) {
        case 'left':
          return 'left: 66%;';
        case 'right':
          return 'left: 33%;';
        default:
          return 'left: 50%;';
      }
    }
    return 'left: 50%;';
  }}
  transform: translateX(-50%);
  font-size: ${(props) => (props.position === 'top' ? '12px' : '14px')};
  font-family: monospace;
  color: ${(props) => (props.isBlack ? '#fff' : '#666')};
  text-transform: ${(props) => (props.position === 'top' ? 'none' : 'uppercase')};
  pointer-events: none;
`;

const WhiteKey = styled.div<{ isPressed: boolean }>`
  width: ${whiteKeyWidth}px;
  height: ${pianoHeight}px;
  background: ${(props) => (props.isPressed ? '#c8e6c9' : 'white')};
  border: 1px solid #ccc;
  border-radius: 0 0 4px 4px;
  position: relative;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.isPressed ? '#c8e6c9' : '#f0f0f0')};
  }

  &:active {
    background: #c8e6c9;
  }
`;

const BlackKey = styled.div<{ isPressed: boolean }>`
  width: ${blackKeyWidth}px;
  height: ${pianoHeight - 45}px;
  background: ${(props) => (props.isPressed ? '#81c784' : '#333')};
  position: absolute;
  right: -${blackKeyWidth / 2}px;
  top: 0;
  z-index: 1;
  cursor: pointer;
  border-radius: 0 0 4px 4px;

  &:hover {
    background: ${(props) => (props.isPressed ? '#81c784' : '#444')};
  }

  &:active {
    background: #81c784;
  }
`;

const KeyWrapper = styled.div<{ hasBlackKey: boolean }>`
  position: relative;
  width: ${whiteKeyWidth}px;
  height: ${pianoHeight}px;
`;

// Helper function to find key by MIDI note
const findKeyByNote = (note: number): string => {
  const octave = getOctave(note);

  if (octave === 3) {
    // For octave 3, prefer lowerKeyMap
    const key = Object.entries(lowerKeyMap).find(([_, midiNote]) => midiNote === note)?.[0];
    if (key) return key;
  } else if (octave === 4) {
    // For octave 4, prefer upperKeyMap
    const key = Object.entries(upperKeyMap).find(([_, midiNote]) => midiNote === note)?.[0];
    if (key) return key;
  }

  // For other octaves or if preferred map doesn't have the note, check both maps
  const allMappings = { ...upperKeyMap, ...lowerKeyMap };
  return Object.entries(allMappings).find(([_, midiNote]) => midiNote === note)?.[0] || '';
};

// Helper function to get octave from MIDI note
const getOctave = (midiNote: number): number => {
  return Math.floor(midiNote / 12) - 1;
};

interface PianoKeyboardProps {}

const PianoKeyboard: React.FC<PianoKeyboardProps> = () => {
  const { pressNote, releaseNote, isNotePressed } = useNoteStore();

  const createOctave = (startNote: number) => [
    { note: 'C', hasBlack: true, prevHasBlack: false, midiNote: startNote },
    { note: 'D', hasBlack: true, prevHasBlack: true, midiNote: startNote + 2 },
    { note: 'E', hasBlack: false, prevHasBlack: true, midiNote: startNote + 4 },
    { note: 'F', hasBlack: true, prevHasBlack: false, midiNote: startNote + 5 },
    { note: 'G', hasBlack: true, prevHasBlack: true, midiNote: startNote + 7 },
    { note: 'A', hasBlack: true, prevHasBlack: true, midiNote: startNote + 9 },
    { note: 'B', hasBlack: false, prevHasBlack: true, midiNote: startNote + 11 },
  ];

  const keys = [
    ...createOctave(36), // C2
    ...createOctave(48), // C3
    ...createOctave(60), // C4 (middle C)
    ...createOctave(72), // C5
  ];

  const handleNotePress = (midiNote: number) => {
    pressNote({
      pitch: midiNote,
      velocity: 100,
      source: 'keyboard',
    });
  };

  const handleNoteRelease = (midiNote: number) => {
    releaseNote(midiNote);
  };

  return (
    <KeyboardContainer>
      {keys.map((key, index) => (
        <KeyWrapper key={index} hasBlackKey={key.hasBlack}>
          <WhiteKey
            isPressed={isNotePressed(key.midiNote)}
            onMouseDown={() => handleNotePress(key.midiNote)}
            onMouseUp={() => handleNoteRelease(key.midiNote)}
            onMouseLeave={() => handleNoteRelease(key.midiNote)}
          >
            <KeyLabel
              position="top"
              labelPosition={
                key.hasBlack && key.prevHasBlack
                  ? 'center'
                  : key.hasBlack
                    ? 'right'
                    : key.prevHasBlack
                      ? 'left'
                      : 'center'
              }
            >
              {key.note}
              {key.note === 'C' ? getOctave(key.midiNote) : ''}
            </KeyLabel>
            <KeyLabel position="bottom">{findKeyByNote(key.midiNote)}</KeyLabel>
          </WhiteKey>
          {key.hasBlack && (
            <BlackKey
              isPressed={isNotePressed(key.midiNote + 1)}
              onMouseDown={() => handleNotePress(key.midiNote + 1)}
              onMouseUp={() => handleNoteRelease(key.midiNote + 1)}
              onMouseLeave={() => handleNoteRelease(key.midiNote + 1)}
            >
              <KeyLabel isBlack position="top">
                {key.note}#
              </KeyLabel>
              <KeyLabel isBlack position="bottom">
                {findKeyByNote(key.midiNote + 1)}
              </KeyLabel>
            </BlackKey>
          )}
        </KeyWrapper>
      ))}
    </KeyboardContainer>
  );
};

export default PianoKeyboard;
