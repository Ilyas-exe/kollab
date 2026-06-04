import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartJS from './chartSetup';

const ChartSparkline = ({ data = [], color = '#ffffff', height = 64 }) => {
  const labels = data.map((_, i) => i + 1);
  const dataset = {
    labels,
    datasets: [
      {
        data,
        borderColor: color,
        backgroundColor: color + '33',
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    elements: {
      line: { capBezierPoints: true },
    },
  };

  return (
    <div style={{ width: 160, height }}>
      <Line data={dataset} options={options} width={160} height={height} />
    </div>
  );
};

export default ChartSparkline;
