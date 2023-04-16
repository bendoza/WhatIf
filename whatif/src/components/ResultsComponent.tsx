import React from 'react';

interface ResultsComponentProps {
  bestSingleCrypto: { symbol: string; date: string; increase: number };
  bestMarketDay: { date: string; increase: number };
  worstDayToSell: { date: string; decrease: number };
  topOutperformers: { symbol: string; value: number; outperformed: string[] }[];
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({
  bestSingleCrypto,
  bestMarketDay,
  worstDayToSell,
  topOutperformers,
}) => {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg mb-2">Best Single Crypto Performance</h2>
        <p>
          <strong>Symbol:</strong> {bestSingleCrypto.symbol}
        </p>
        <p>
          <strong>Date:</strong> {bestSingleCrypto.date}
        </p>
        <p>
          <strong>Percentage Increase:</strong> {bestSingleCrypto.increase.toFixed(2)}%
        </p>
      </div>
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg mb-2">Best Market Day</h2>
        <p>
          <strong>Date:</strong> {bestMarketDay.date}
        </p>
        <p>
          <strong>Percentage Increase:</strong> {bestMarketDay.increase.toFixed(2)}%
        </p>
      </div>
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg mb-2">Worst Day to Sell</h2>
        <p>
          <strong>Date:</strong> {worstDayToSell.date}
        </p>
        <p>
          <strong>Percentage Decrease:</strong> {worstDayToSell.decrease.toFixed(2)}%
        </p>
      </div>
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg mb-2">Top 3 Outperformers</h2>
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b">
              <th className="w-1/4 px-4 py-2">Symbol</th>
              <th className="w-1/4 px-4 py-2">Value</th>
              <th className="w-1/2 px-4 py-2">Outperformed</th>
            </tr>
          </thead>
          <tbody>
            {topOutperformers.map((outperformer, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{outperformer.symbol}</td>
                <td className="px-4 py-2">${outperformer.value.toFixed(2)}</td>
                <td className="px-4 py-2">{outperformer.outperformed.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsComponent;
