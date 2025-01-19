import { useEffect, useRef } from 'react';
import ABCJS from 'abcjs';

type AbcVisualProps = {
  notes: string;
};

// TODO: make more generic, and use this inside StaffVisualizer
export function AbcVisual({ notes }: AbcVisualProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const abcNotation = `
X: 1
M: 4/4
L: 1/4
K: C
V:1 clef=treble
${notes}`;

    ABCJS.renderAbc(divRef.current, abcNotation, {
      add_classes: true,
      selectTypes: [],
      staffwidth: 200,
      paddingbottom: 0,
      scale: 1.5,
    });
  }, []);

  return <div ref={divRef} className="staff-visualizer" />;
}
