import React, { useEffect, useState } from 'react';

interface CryptoSelectionProps {
  onSelectedCryptoStrings: (selectedCryptoStrings: string[]) => void;
}

interface Crypto {
  ticker: string;
}

interface CryptoAmount {
  [key: string]: number;
}

const CryptoSelection: React.FC<CryptoSelectionProps> = ({ onSelectedCryptoStrings }) => {
  const [selectedCryptos, setSelectedCryptos] = useState<CryptoAmount>({});
  const [cryptoList, setCryptoList] = useState<Crypto[]>([]);

  const [selectedCryptoStrings, setSelectedCryptoStrings] = useState<string[]>([]);

  useEffect(() => {
    // Load the text file using fetch
    fetch('/cryptoTickersOnly.txt')
      .then((response) => response.text())
      .then((data) => {
        // Parse the text data into an array of Crypto objects
        const cryptoData = data.split('\n').map((line) => ({
          ticker: line.trim(),
        }));
        setCryptoList(cryptoData);
      })
      .catch((err) => {
        console.error('Failed to load crypto list:', err);
      });
  }, []);

  useEffect(() => {
    // Save the selected tickers and their values as strings in an array
    const selectedCryptoStringsArray = Object.entries(selectedCryptos)
      .map(([crypto, value]) => `${crypto}-${value}`);
    
      if (JSON.stringify(selectedCryptoStringsArray) !== JSON.stringify(selectedCryptoStrings)) {
        setSelectedCryptoStrings(selectedCryptoStringsArray);
        onSelectedCryptoStrings(selectedCryptoStringsArray);
      }
    }, [selectedCryptos, onSelectedCryptoStrings, selectedCryptoStrings]);

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
    <div className="p-4 h-64 overflow-y-scroll">
      <h2 className="text-lg mb-2">Select Your Theoretical Portfolio (with values)</h2>
      <div>
        {cryptoList.map((crypto) => (
          <div key={crypto.ticker} className="flex items-center mb-2">
            <label>
              <input
                type="checkbox"
                value={crypto.ticker}
                onChange={handleCheckboxChange}
                className="mr-1"
              />
              {crypto.ticker}
            </label>
            {selectedCryptos.hasOwnProperty(crypto.ticker) && (
              <input
                type="number"
                min="0"
                step="any"
                value={selectedCryptos[crypto.ticker]}
                onChange={(e) => handleAmountChange(e, crypto.ticker)}
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
