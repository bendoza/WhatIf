import React, { useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCryptos, setSelectedCryptos] = useState<CryptoAmount>({});
  const [cryptoList, setCryptoList] = useState<Crypto[]>([]);

  const [selectedCryptoStrings, setSelectedCryptoStrings] = useState<string[]>([]);

  useEffect(() => {
    fetch('/cryptoTickersOnly.txt')
      .then((response) => response.text())
      .then((data) => {
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
      const updatedCryptoList = [
        { ticker: value },
        ...cryptoList.filter((crypto) => crypto.ticker !== value),
      ];
      setCryptoList(updatedCryptoList);
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

  const filteredCryptoList = cryptoList.filter((crypto) =>
    crypto.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-lg text-center mb-2">Select Your Theoretical Portfolio (with values)</h2>
      <div className="p-4 h-64 overflow-y-scroll">
        <div className="flex items-center mb-4">
          <BsSearch className="mr-1" />
          <input
            type="text"
            placeholder="Search for a coin"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div>
          {filteredCryptoList.map((crypto) => (
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
                <div className="ml-4 flex items-center">
                  <span className="mr-1">Amount:</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={selectedCryptos[crypto.ticker]}
                    onChange={(e) => handleAmountChange(e, crypto.ticker)}
                    className="w-20"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CryptoSelection;

