import React from 'react';

type Props = {
  text: string;
  indices?: readonly [number, number][];
};
export const HighlightedText: React.FC<Props> = ({ text, indices }) => {
  if (!indices || indices.length === 0) return <>{text}</>;

  let lastIndex = 0;
  const parts: React.ReactNode[] = [];

  indices.forEach(([start, end], i) => {
    if (start > lastIndex) {
      parts.push(<span key={`text-${i}`}>{text.slice(lastIndex, start)}</span>);
    }

    parts.push(
      <span key={`highlight-${i}`} className='font-bold text-green-500'>
        {text.slice(start, end + 1)}
      </span>
    );

    lastIndex = end + 1;
  });

  if (lastIndex < text.length) {
    parts.push(<span key='end'>{text.slice(lastIndex)}</span>);
  }

  return <div>{parts}</div>;
};
