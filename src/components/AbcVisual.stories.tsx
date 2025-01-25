import type { Meta, StoryObj } from '@storybook/react';

import { AbcVisual } from './AbcVisual';
import { Key } from 'tonal';
import { getNote } from '../utils/tonal-helpers';

const meta = {
  component: AbcVisual,
} satisfies Meta<typeof AbcVisual>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sequence: {
      hands: {
        treble: [
          {
            notes: [getNote('C4')],
            meta: {},
          },
        ],
      },
    },
  },
};

export const Complex: Story = {
  args: {
    sequence: {
      hands: {
        treble: [
          {
            notes: [getNote('C4')],
            meta: {},
          },
          {
            notes: [getNote('E4')],
            meta: {},
          },
          {
            notes: [getNote('F4')],
            meta: {},
          },
          {
            notes: [getNote('A4')],
            meta: {},
          },
        ],
        bass: [
          {
            notes: [getNote('C3', 'h'), getNote('E3', 'h'), getNote('G3', 'h')],
            meta: {},
          },
          {
            notes: [getNote('F3', 'h'), getNote('A3', 'h'), getNote('C4', 'h')],
            meta: {},
          },
        ],
      },
      timeSignature: [4, 4],
      key: Key.minorKey('C#'),
    },
  },
};
