import { ChangeEvent, EventHandler, FormEventHandler, useCallback, useState } from 'react';

export function useTextInput(initial?: string) {
  const [text, setText] = useState(initial || '');

  const onChangeEvent: FormEventHandler<Element & { value: string }> = useCallback(
    (ev: ChangeEvent<Element & { value: string }>) => {
      setText(ev.target.value);
    },
    [],
  );

  return [text, onChangeEvent] as const;
}
