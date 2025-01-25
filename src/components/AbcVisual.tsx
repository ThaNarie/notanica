import { useEffect, useRef } from 'react';
import ABCJS from 'abcjs';
import type { Sequence } from '../types/Sequence';
import { sequenceToAbcNotation } from '../utils/tonal-abc';

type AbcVisualProps = {
  sequence: Sequence;
};

// TODO: make more generic, and use this inside StaffVisualizer
export function AbcVisual({ sequence }: AbcVisualProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const abcNotation = sequenceToAbcNotation(sequence);

    ABCJS.renderAbc(divRef.current, abcNotation, {
      add_classes: true,
      selectTypes: [],
      staffwidth: 200,
      // paddingbottom: 0,
      scale: 1.5,
      timeBasedLayout: { minWidth: 200, minPadding: 25, align: 'left'}
    });
  }, []);

  return <div ref={divRef} className="w-full flex justify-center items-center" />;
}
