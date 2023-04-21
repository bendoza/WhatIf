import React from 'react';

interface TopOutperformer {
  NewTicker: string;
  NewTickerPctDiff: number;
  OwnedTicker: string;
  OwnedTickerPctDiff: number;
}

interface ResultsComponentProps {
  bestDayCrypto: { Ticker: string; Date: string; PercentIncrease: number };
  bestMarketDay: { Date: string; PercentIncrease: number };
  worstDayToSell: { Date: string; PercentDifference: number };
  topOutperformers: TopOutperformer[];
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({
  bestDayCrypto,
  bestMarketDay,
  worstDayToSell,
  topOutperformers,
}) => {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg mb-2">Your Crypto With Best Single Day Performance</h2>
        <p>
          <strong>Symbol:</strong> {bestDayCrypto.Ticker}
        </p>
        <p>
          <strong>Date:</strong> {bestDayCrypto.Date}
        </p>
        <p>
          <strong>Day's Percent Increase:</strong> {bestDayCrypto.PercentIncrease.toFixed(2)}%
        </p>
      </div>
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg mb-2">Best Overall Day Amongst Our Crypto Dataset</h2>
        <p>
          <strong>Date:</strong> {bestMarketDay.Date}
        </p>
        <p>
          <strong>Day's Total Percent Increase:</strong> {bestMarketDay.PercentIncrease.toFixed(2)}%
        </p>
      </div>
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg mb-2">Worst Day to Sell</h2>
        <p>
          <strong>Date:</strong> {worstDayToSell.Date}
        </p>
        <p>
          <strong>Percent Change On This Date From Buy Date:</strong> {worstDayToSell.PercentDifference.toFixed(2)}%
        </p>
      </div>
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg mb-2">Top 3 Outperformers</h2>
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b">
              <th className="w-1/4 px-4 py-2">New Symbol</th>
              <th className="w-1/4 px-4 py-2">Percent Difference from Buy Date</th>
              <th className="w-1/4 px-4 py-2">Owned Symbol</th>
              <th className="w-1/4 px-4 py-2">Percent Difference from Buy Date</th>
            </tr>
          </thead>
          <tbody>
            {topOutperformers.map((outperformer, index) => (
              <tr key={index} className="border-b">
                <td className="px-14 py-2">{outperformer.NewTicker}</td>
                <td className="px-14 py-2">{outperformer.NewTickerPctDiff.toFixed(2)}%</td>
                <td className="px-14 py-2">{outperformer.OwnedTicker}</td>
                <td className="px-14 py-2">{outperformer.OwnedTickerPctDiff.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsComponent;
