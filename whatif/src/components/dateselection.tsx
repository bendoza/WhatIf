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
  const minDate = "2014-09-17";
  const maxDate = "2022-02-14";

  return (
    <div className="p-4">
      <h2 className="text-lg text-center mb-2">Buy & Sell Dates</h2>
      <h2 className="text-sm text-center mb-1">Available Dates: 09/17/2014 - 02/14/2022</h2>
      <h2 className="text-xs text-center text-red-700 mb-4">Keep in mind: Not all cryptocurrencies have data that spans the entire date range.</h2>
      <div className="flex flex-col text-center">
        <div className="mb-4">
          <label className="mr-2 font-medium">
            Buy Date:
          </label>
          <input
            type="date"
            value={buyDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => onBuyDateChange(e.target.value)}
            className="border border-gray-300 rounded py-1 px-2"
          />
        </div>
        <div className="mb-4">
          <label className="mr-2 font-medium">
            Sell Date:
          </label>
          <input
            type="date"
            value={sellDate}
            min={buyDate || minDate}
            max={maxDate}
            onChange={(e) => onSellDateChange(e.target.value)}
            className="border border-gray-300 rounded py-1 px-2"
          />
        </div>
        <button
          onClick={onCalculate}
          className="bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Calculate
        </button>
      </div>
    </div>
  );
};

export default DateSelection;
