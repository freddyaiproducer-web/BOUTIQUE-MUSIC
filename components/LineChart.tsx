
import React from 'react';

interface ChartData {
  time: number;
  value: number;
}

interface LineChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, width = 100, height = 40, color = '#1DB954' }) => {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="flex items-center justify-center text-xs text-brand-text-secondary">Not enough data</div>;
  }

  const values = data.map(p => p.value);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const range = maxY - minY === 0 ? 1 : maxY - minY;

  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((point.value - minY) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
};

export default LineChart;
