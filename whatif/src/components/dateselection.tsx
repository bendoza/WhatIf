import React from 'react';

interface DateSelectionProps {
  buyDate: string;
  sellDate: string;
  onBuyDateChange: (date: string) => void;
  onSellDateChange: (date: string) => void;
  onCalculate: () => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({
  buyDate,
  sellDate,
  onBuyDateChange,
  onSellDateChange,
  onCalculate,
}) => {
  return (
    <div className="p-4">
      <h2 className="text-lg text-center">Buy & Sell Dates</h2>
      <h2 className="text-sm text-center">Available Dates: 09/17/2014 - 02/14/2022</h2>
      <h2 className="text-xs text-center text-red-700 mb-2">Keep in mind: Not all cryptocurrencies have data that spans the entire date range.</h2>
      <div className="flex flex-col text-center">
        <div>
          <label className="mr-2">
            Buy Date:
            <input
              type="date"
              value={buyDate}
              onChange={(e) => onBuyDateChange(e.target.value)}
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
              onChange={(e) => onSellDateChange(e.target.value)}
              className="ml-1"
            />
          </label>
        </div>
        <button
        onClick={onCalculate}
        className="bg-blue-600 text-white py-2 mt-4 rounded"
      >
        Calculate
      </button>
      </div>
    </div>
  );
};

export default DateSelection;
