import React, { useState } from 'react';

interface CryptoAmount {
  [key: string]: number;
}

const CryptoSelection: React.FC = () => {
  const [selectedCryptos, setSelectedCryptos] = useState<CryptoAmount>({});

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedCryptos({ ...selectedCryptos, [value]: 0 });
    } else {
      const updatedCryptos = { ...selectedCryptos };
      delete updatedCryptos[value];
      setSelectedCryptos(updatedCryptos);
    }
  };

  const handleAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    crypto: string
  ) => {
    const { value } = event.target;
    setSelectedCryptos({ ...selectedCryptos, [crypto]: parseFloat(value) });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg mb-2">Select Cryptos</h2>
      <div>
        {['BTC', 'ETH', 'ADA'].map((crypto) => (
          <div key={crypto} className="flex items-center mb-2">
            <label>
              <input
                type="checkbox"
                value={crypto}
                onChange={handleCheckboxChange}
                className="mr-1"
              />
              {crypto}
            </label>
            {selectedCryptos.hasOwnProperty(crypto) && (
              <input
                type="number"
                min="0"
                step="any"
                value={selectedCryptos[crypto]}
                onChange={(e) => handleAmountChange(e, crypto)}
                className="ml-4 w-20"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoSelection;
