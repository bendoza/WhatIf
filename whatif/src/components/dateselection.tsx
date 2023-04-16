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
      <h2 className="text-lg mb-2">Buy & Sell Dates</h2>
      <div className="flex flex-col">
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
      </div>
      <button
        onClick={onCalculate}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
      >
        Calculate
      </button>
    </div>
  );
};

export default DateSelection;
