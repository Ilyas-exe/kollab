import React from 'react';

const DonutChart = ({ value = 0, size = 56, stroke = 8, color = '#16a34a', bg = '#e6e9ef' }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const offset = c - (pct / 100) * c;

  return (
    <svg width={size} height={size}>
      <g transform={`translate(${size / 2},${size / 2})`}>
        <circle r={r} fill="transparent" stroke={bg} strokeWidth={stroke} />
        <circle
          r={r}
          fill="transparent"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90)"
        />
        <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#0b1726" fontWeight="600">
          {pct}%
        </text>
      </g>
    </svg>
  );
};

export default DonutChart;
