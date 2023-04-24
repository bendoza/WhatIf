import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface PortfolioValueChartProps {
  labels: string[];
  data: number[];
}

const PortfolioValueChart: React.FC<PortfolioValueChartProps> = ({
  labels,
  data,
}) => {
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (!canvasRef.current) {
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Average Weekly Portfolio Value',
              data: data,
              borderColor: 'rgba(255, 99, 132, 1)', // Change this to the desired color
              backgroundColor: 'rgba(255, 99, 132, 0.2)', // Add this to set the fill color under the line
              borderWidth: 2,
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'category',
            },
            y: {
              type: 'linear',
            },
          },
        },
      });
    }
  }, [labels, data]);

  return <canvas ref={canvasRef} />;
};

export default PortfolioValueChart;
