import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartJS from './chartSetup';

const ChartDonut = ({ value = 0, size = 72, color = '#16a34a' }) => {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const data = {
    labels: ['value', 'rest'],
    datasets: [
      {
        data: [pct, 100 - pct],
        backgroundColor: [color, '#e6e9ef'],
        borderWidth: 0,
      },
    ],
  };

  const centerText = {
    id: 'centerText',
    beforeDraw: (chart) => {
      const { ctx, width, height } = chart;
      ctx.restore();
      const fontSize = (height / 72) * 14;
      ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = '#0b1726';
      ctx.textBaseline = 'middle';
      const text = `${pct}%`;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;
      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
  };

  return (
    <div style={{ width: size, height: size }}>
      <Doughnut data={data} options={options} plugins={[centerText]} />
    </div>
  );
};

export default ChartDonut;
