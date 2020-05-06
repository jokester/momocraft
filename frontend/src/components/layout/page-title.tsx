import React from 'react';

export const PageTitle: React.FC<{ text: string }> = ({ text }) => (
  <h2 className="text-xl font-semibold mt-4 px-4">{text}</h2>
);
