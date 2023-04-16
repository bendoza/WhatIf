import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CryptoSelection from '../components/cryptoSelection';
import DateSelection from '../components/dateselection';
import withAuth from '../components/withAuth';
import PortfolioValueChart from '../components/PortfolioValueChart';
import ResultsComponent from '../components/ResultsComponent';

const ComparePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState ({
    buyDate: '',
    sellDate: '',
  });

  const handleSelectedCryptoStrings = (selectedCryptoStrings: string[]) => {
    setSelectedCryptos(selectedCryptoStrings);
  };

  const handleDateSelection = (buyDate: string, sellDate: string) => {
    const buyParts = buyDate.split('-');
    const formattedBuyDate = `${buyParts[1]}/${buyParts[2]}/${buyParts[0]}`;

    const sellParts = sellDate.split('-');
    const formattedSellDate = `${sellParts[1]}/${sellParts[2]}/${sellParts[0]}`;

    setSelectedDates({ buyDate: formattedBuyDate, sellDate: formattedSellDate });
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      setIsLoggedIn(sessionStorage.getItem('loggedIn') !== null);
    } else {
      console.warn('sessionStorage is not available.');
    }
  }, []);

  const [bestSingleCrypto, setBestSingleCrypto] = useState({
    symbol: '',
    date: '',
    increase: 0,
  });
  const [bestMarketDay, setBestMarketDay] = useState({ date: '', increase: 0 });
  const [worstDayToSell, setWorstDayToSell] = useState({ date: '', decrease: 0 });
  const [topOutperformers, setTopOutperformers] = useState([]);

  const [showResults, setShowResults] = useState(false);

  const [buyDate, setBuyDate] = useState('');
  const [sellDate, setSellDate] = useState('');

  const handleCalculateClick = () => {
    console.log('Buy Date:', buyDate);
    console.log('Sell Date:', sellDate);

    // Add your calculation logic here
    // and update the results state variables

    setShowResults(true);
  };

  const [labels, setLabels] = useState(['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04']);
  const [data, setData] = useState([12000, 15000, 18000, 21000]);

  return (
    
    <div>
      
      <Header isLoggedIn={isLoggedIn} />
      

        <div className="w-full text-center mb-0 bg-gradient-to-r from-gray-500 to-indigo-500 py-6">
          <h1 className="text-4xl font-semibold text-white">Crypto Performance Comparison</h1>
        </div>

        <div className="bg-gray-200 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded shadow-md">
            <CryptoSelection />
            <DateSelection
              buyDate={buyDate}
              sellDate={sellDate}
              onBuyDateChange={setBuyDate}
              onSellDateChange={setSellDate}
              onCalculate={handleCalculateClick}
            />
          </div>
        </div>
      </div>
      {showResults && (
        <div className="container mx-auto my-8">
          <div className="w-full text-center mb-6">
            <h1 className="text-4xl font-semibold">Results</h1>
          </div>

          <div className="mt-8">
            <PortfolioValueChart key={JSON.stringify(labels)} labels={labels} data={data} />
            <ResultsComponent
              bestSingleCrypto={bestSingleCrypto}
              bestMarketDay={bestMarketDay}
              worstDayToSell={worstDayToSell}
              topOutperformers={topOutperformers}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(ComparePage);