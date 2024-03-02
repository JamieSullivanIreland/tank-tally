import React, { ChangeEvent } from 'react';

interface Props {
  name: string;
  type?: string;
  onChange: (e: ChangeEvent) => void;
}

const Input = ({ name, type = 'text', onChange }: Props) => {
  return (
    <input
      type={type}
      name={name}
      onChange={onChange}
    />
  );
};

export default Input;
