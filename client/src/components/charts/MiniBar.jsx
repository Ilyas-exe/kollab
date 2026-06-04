import React from 'react';

const MiniBar = ({ items = [] , width = 220, barColor = '#7c3aed'}) => {
  if (!items || items.length === 0) return <div />;
  const max = Math.max(...items.map(i => i.value));

  return (
    <div className="space-y-2">
      {items.map((it, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className="text-xs text-muted w-24 truncate">{it.label}</div>
          <div className="flex-1 bg-paper rounded-full h-3 overflow-hidden">
            <div style={{ width: `${(it.value / (max || 1)) * 100}%` }} className="h-3 rounded-full" />
          </div>
          <div className="text-xs font-semibold text-ink w-16 text-right">${it.value.toFixed(0)}</div>
        </div>
      ))}
    </div>
  );
};

export default MiniBar;
