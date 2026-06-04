import React from 'react';

const BarSpark = ({ data = [], color = '#ff7ab6', width = 160, height = 40 }) => {
  if (!data || data.length === 0) return <svg width={width} height={height} />;
  const max = Math.max(...data);
  const barWidth = Math.max(2, (width - (data.length - 1) * 2) / data.length);

  return (
    <svg width={width} height={height} className="inline-block">
      {data.map((d, i) => {
        const h = (d / (max || 1)) * (height - 6);
        const x = i * (barWidth + 2);
        const y = height - h - 2;
        return <rect key={i} x={x} y={y} width={barWidth} height={h} rx={2} fill={color} />;
      })}
    </svg>
  );
};

export default BarSpark;
