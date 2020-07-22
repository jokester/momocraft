import React from 'react';
import { useTextInput } from '../components/hooks/use-text-input';

export default {
  title: 'Form',
};

const FormWithTestInput: React.FC = () => {
  const [name, onNameChange] = useTextInput('initial');

  return (
    <form>
      <label htmlFor="name">name:</label>
      <input name="name" value={name} onInput={onNameChange} />{' '}
    </form>
  );
};

export const FormDemo = () => <FormWithTestInput />;
