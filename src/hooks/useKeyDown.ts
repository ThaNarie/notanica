import { useEventListener } from "@mediamonks/react-kit";
import { useState } from "react";

export function useKeyDown(key: string) {
  const [isPressed, setIsPressed] = useState(false);

  useEventListener(globalThis.window, "keydown", (event) => {
    if ((event as KeyboardEvent).key === key) {
      setIsPressed(true);
    }
  });

  useEventListener(globalThis.window, "keyup", (event) => {
    if ((event as KeyboardEvent).key === key) {
      setIsPressed(false);
    }
  });

  return isPressed;
}
