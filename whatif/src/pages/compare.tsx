import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CryptoSelection from '../components/cryptoSelection';
import DateSelection from '../components/dateselection';
import withAuth from '../components/withAuth';
import PortfolioValueChart from '../components/PortfolioValueChart';
import ResultsComponent from '../components/ResultsComponent';

const ComparePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      setIsLoggedIn(sessionStorage.getItem('loggedIn') !== null);
    } else {
      console.warn('sessionStorage is not available.');
    }
  }, []);

  const [bestSingleCrypto, setBestSingleCrypto] = useState({
    Ticker: '',
    Date: '',
    PercentIncrease: 0,
  });
  const [bestMarketDay, setBestMarketDay] = useState({ Date: '', PercentIncrease: 0 });
  const [worstDayToSell, setWorstDayToSell] = useState({ date: '', decrease: 0 });
  const [topOutperformers, setTopOutperformers] = useState([]);

  const [showResults, setShowResults] = useState(false);

  const [buyDate, setBuyDate] = useState('');
  const [sellDate, setSellDate] = useState('');

  const [selectedCryptos, setSelectedCryptos] = useState<string[]>([]);

  var bestDayCryptoData;
  var bestMarketDayData;
  var betterCoinInvestmentsData;
  var graphPopulateData;
  var worstSellDayData;

  const handleSelectedCryptoStrings = (selectedCryptoStrings: string[]) => {
    setSelectedCryptos(selectedCryptoStrings);
  };

  const handleCalculateClick = () => {

    fetch('http://localhost:8008/bestDayCrypto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        TickerValues: selectedCryptos,
        BuyDate: buyDate,
        SellDate: sellDate,
      })
    })
    .then(response => response.json())
    .then(data => {
      setBestSingleCrypto(data)
    })
    .catch(error => {
      console.log(error)
    });

    fetch('http://localhost:8008/bestMarketDay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        TickerValues: selectedCryptos,
        BuyDate: buyDate,
        SellDate: sellDate,
      })
    })
    .then(response => response.json())
    .then(data => {
      setBestMarketDay(data)
    })
    .catch(error => {
      console.log(error)
    });

    fetch('http://localhost:8008/betterCoinInvestments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        TickerValues: selectedCryptos,
        BuyDate: buyDate,
        SellDate: sellDate,
      })
    })
    .then(response => response.json())
    .then(data => {
      setBestMarketDay(data)
    })
    .catch(error => {
      console.log(error)
    });

    fetch('http://localhost:8008/graphPopulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        TickerValues: selectedCryptos,
        BuyDate: buyDate,
        SellDate: sellDate,
      })
    })
    .then(response => response.json())
    .then(data => {
      setBestMarketDay(data)
    })
    .catch(error => {
      console.log(error)
    });

    fetch('http://localhost:8008/worseSellDay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        TickerValues: selectedCryptos,
        BuyDate: buyDate,
        SellDate: sellDate,
      })
    })
    .then(response => response.json())
    .then(data => {
      setBestMarketDay(data)
    })
    .catch(error => {
      console.log(error)
    });

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
            <CryptoSelection
            onSelectedCryptoStrings={handleSelectedCryptoStrings}
            />
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
              bestDayCrypto={bestSingleCrypto}
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