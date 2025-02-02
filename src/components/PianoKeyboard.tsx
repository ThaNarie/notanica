import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useNoteStore } from '../stores/useNoteStore';
import { upperKeyMap, lowerKeyMap } from '../utils/keyboardMapping';
import { useKeyDown } from '../hooks/useKeyDown';

const whiteKeyWidth = 44;
const blackKeyWidth = 26;
const pianoHeight = 150;

const KeyboardContainer = styled.div`
  user-select: none;
  position: fixed;
  max-width: 100vw;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const InnerShadow = styled.div`
  position: absolute;
  box-shadow: inset 0px 8px 10px 0px rgba(0, 0, 0, 0.2);
  inset: 10px;
  pointer-events: none;
  z-index: 2;
  border-radius: 0 0 4px 4px;
`;

const KeysWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  border-radius: 0 0 4px 4px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  width: 100%;
  overflow-x: auto;
`;

const KeyLabel = styled.span<{
  isBlack?: boolean;
  position: 'top' | 'bottom';
  labelPosition?: '<<' | '<' | '' | '>' | '>>';
  isC?: boolean;
}>`
  position: absolute;
  ${(props) => (props.position === 'top' ? 'top: 8px;' : 'bottom: 8px;')}
  ${(props) => {
    if (props.position === 'top' && props.labelPosition) {
      switch (props.labelPosition) {
        case '<<':
          return 'left: 33%;';
        case '<':
          return 'left: 45%;';
        default:
          return 'left: 50%;';
        case '>':
          return 'left: 55%;';
        case '>>':
          return 'left: 67%;';
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
  font-weight: ${(props) => (props.isC && props.position === 'top' ? 'bold' : 'normal')};
`;

const WhiteKey = styled.div<{ isPressed: boolean }>`
  width: ${whiteKeyWidth + 1}px;
  height: ${pianoHeight + 1}px;
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

const BlackKey = styled.div<{ isPressed: boolean; offset?: number }>`
  width: ${blackKeyWidth}px;
  height: ${pianoHeight - 50}px;
  background: ${(props) =>
    props.isPressed ? '#81c784' : 'linear-gradient(to bottom, #666, #111)'};
  box-shadow: 1px 2px 4px 0px rgba(0, 0, 0, 0.5);
  position: absolute;
  right: -${(props) => blackKeyWidth / 2 + (props.offset ?? 0)}px;
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

type PianoKey = {
  note: string;
  hasBlack: boolean;
  labelOffset?: '<<' | '<' | '' | '>' | '>>';
  blackOffset?: 'left' | 'right' | 'none';
  midiNote: number;
};

function createOctave(startNote: number): Array<PianoKey> {
  return [
    {
      note: 'C',
      hasBlack: true,
      labelOffset: '<<',
      blackOffset: 'left',
      midiNote: startNote,
    },
    {
      note: 'D',
      hasBlack: true,
      labelOffset: '',
      blackOffset: 'right',
      midiNote: startNote + 2,
    },
    {
      note: 'E',
      hasBlack: false,
      labelOffset: '>>',
      blackOffset: 'none',
      midiNote: startNote + 4,
    },
    {
      note: 'F',
      hasBlack: true,
      labelOffset: '<<',
      blackOffset: 'left',
      midiNote: startNote + 5,
    },
    {
      note: 'G',
      hasBlack: true,
      labelOffset: '<',
      blackOffset: 'none',
      midiNote: startNote + 7,
    },
    {
      note: 'A',
      hasBlack: true,
      labelOffset: '>',
      blackOffset: 'right',
      midiNote: startNote + 9,
    },
    {
      note: 'B',
      hasBlack: false,
      labelOffset: '>>',
      blackOffset: 'none',
      midiNote: startNote + 11,
    },
  ];
}

const keys = [
  ...createOctave(0).slice(-2), // C0
  ...createOctave(24), // C1
  ...createOctave(36), // C2
  ...createOctave(48), // C3
  ...createOctave(60), // C4 (middle C)
  ...createOctave(72), // C5
  ...createOctave(84), // C6
  ...createOctave(96), // C7
  {
    ...createOctave(108).at(0),
    hasBlack: false,
    labelOffset: '',
  } as PianoKey,
] satisfies Array<PianoKey>;

interface PianoKeyboardProps {}

const PianoKeyboard: React.FC<PianoKeyboardProps> = () => {
  const { pressNote, releaseNote, isNotePressed, releaseAllNotes } = useNoteStore();
  const keysWrapperRef = useRef<HTMLDivElement>(null);
  const isShiftDown = useKeyDown('Shift');

  useEffect(() => {
    if (keysWrapperRef.current) {
      const totalWidth = keysWrapperRef.current.scrollWidth;
      const viewportWidth = keysWrapperRef.current.clientWidth;
      // Scroll to middle C (approximately middle of the piano)
      keysWrapperRef.current.scrollLeft = (totalWidth - viewportWidth) / 2 - 60;
    }
  }, []);

  const handleNotePress = (midiNote: number) => {
    if (isNotePressed(midiNote)) {
      releaseNote(midiNote);
    } else {
      pressNote({
        pitch: midiNote,
        velocity: 100,
        source: 'keyboard',
      });
    }
  };

  const handleNoteRelease = (midiNote: number) => {
    if (!isShiftDown) {
      releaseNote(midiNote);
    }
  };

  useEffect(() => {
    if (!isShiftDown) {
      releaseAllNotes();
    }
  }, [isShiftDown]);

  return (
    <KeyboardContainer>
      <KeysWrapper ref={keysWrapperRef}>
        {keys.map((key, index) => (
          <KeyWrapper key={index} hasBlackKey={key.hasBlack}>
            <WhiteKey
              isPressed={isNotePressed(key.midiNote)}
              onMouseDown={() => handleNotePress(key.midiNote)}
              onMouseUp={() => handleNoteRelease(key.midiNote)}
              onMouseLeave={() => handleNoteRelease(key.midiNote)}
            >
              <KeyLabel position="top" labelPosition={key.labelOffset} isC={key.note === 'C'}>
                {key.note}
                {key.note === 'C' ? getOctave(key.midiNote) : ''}
              </KeyLabel>
              <KeyLabel position="bottom">{findKeyByNote(key.midiNote)}</KeyLabel>
            </WhiteKey>
            {key.hasBlack && (
              <BlackKey
                offset={key.blackOffset === 'left' ? -4 : key.blackOffset === 'right' ? 4 : 0}
                isPressed={isNotePressed(key.midiNote + 1)}
                onMouseDown={() => handleNotePress(key.midiNote + 1)}
                onMouseUp={() => handleNoteRelease(key.midiNote + 1)}
                onMouseLeave={() => handleNoteRelease(key.midiNote + 1)}
              >
                {/*<KeyLabel isBlack position="top">
                  {key.note}#
                </KeyLabel>*/}
                <KeyLabel isBlack position="bottom">
                  {findKeyByNote(key.midiNote + 1)}
                </KeyLabel>
              </BlackKey>
            )}
          </KeyWrapper>
        ))}
      </KeysWrapper>
      <InnerShadow />
    </KeyboardContainer>
  );
};

export default PianoKeyboard;
