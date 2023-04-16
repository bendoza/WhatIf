import React, { useState } from 'react';
import Link from 'next/link';

interface DateSelectionProps {
  onSelectDate: (buyDate: string, sellDate: string) => void;
}

const dateselection: React.FC<DateSelectionProps> = ({ onSelectDate }) => {
  const [buyDate, setBuyDate] = useState('');
  const [sellDate, setSellDate] = useState('');

  const handleClick = () => {
    onSelectDate(buyDate, sellDate);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg mb-2">Buy & Sell Dates</h2>
      <h2 className="text-base">Available Date Range: Sept. 17th, 2017 - Feb. 14th, 2022 </h2>
      <h2 className="text-xs mb-2">Keep in mind, not all cryptos span the entire possible date range. </h2>
      <div className="flex flex-col">
        <div>
          <label className="mr-2">
            Buy Date:
            <input
              type="date"
              value={buyDate}
              onChange={(e) => setBuyDate(e.target.value)}
              className="ml-1"
            />
          </label>
        </div>
        <div>
          <label className="mr-2">
            Sell Date:
            <input
              type="date"
              value={sellDate}
              onChange={(e) => setSellDate(e.target.value)}
              className="ml-1"
            />
          </label>
        </div>
      </div>
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
      >
        Calculate
      </button>
    </div>
  );
};

export default dateselection;
