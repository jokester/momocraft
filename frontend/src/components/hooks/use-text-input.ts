import { ChangeEvent, useCallback, useState } from 'react';

export function useTextInput(initial?: string) {
  const [text, setText] = useState(initial || '');

  const onChangeEvent = useCallback((ev: ChangeEvent<Element & { value: string }>) => {
    setText(ev.target.value);
  }, []);

  return [text, onChangeEvent] as const;
}
