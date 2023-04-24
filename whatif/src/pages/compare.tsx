import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CryptoSelection from '../components/cryptoSelection';
import DateSelection from '../components/dateselection';
import withAuth from '../components/withAuth';
import PortfolioValueChart from '../components/PortfolioValueChart';
import ResultsComponent from '../components/ResultsComponent';
import { it } from 'node:test';

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
  const [bestMarketDay, setBestMarketDay] = useState({ 
    Date: '', 
    PercentIncrease: 0 
  });
  const [worstDayToSell, setWorstDayToSell] = useState({ 
    Date: '', 
    PercentDifference: 0 
  });
  const [outPerformingStringArray, setOutPerformingStringArray] = useState<string[]>([]);

  interface TopOutperformer {
    NewTicker: string;
    NewTickerPctDiff: number;
    OwnedTicker: string;
    OwnedTickerPctDiff: number;
  }

  let updatedTopOutperformers: TopOutperformer[] = [];
  let orderedKeys: string[] = [];
  let orderedValues: number[] = [];

  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);

  const [topOutperformers, setTopOutperformers] = useState<TopOutperformer[]>([]);

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
      setOutPerformingStringArray(data)
      for (let i = 0; i < outPerformingStringArray.length; i++) {
        var split = outPerformingStringArray[i].split("-", 2);
        var newTicker = split[0].split(":", 2);
        var ownedTicker = split[1].split(":", 2);
        updatedTopOutperformers.push({
          NewTicker: newTicker[0],
          NewTickerPctDiff: +newTicker[1],
          OwnedTicker: ownedTicker[0],
          OwnedTickerPctDiff: +ownedTicker[1]
        });
        setTopOutperformers(updatedTopOutperformers);
      }
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
    .then(result => {
      Object.keys(result).sort().forEach((key) => {
        orderedKeys.push(key);
        orderedValues.push(result[key]);
      });
      setLabels(orderedKeys);
      setData(orderedValues);
    })
    .catch(error => {
      console.log(error)
    });

    fetch('http://localhost:8008/worstSellDay', {
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
      setWorstDayToSell(data)
    })
    .catch(error => {
      console.log(error)
    });

    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100">
      <Header isLoggedIn={isLoggedIn} />
      <div className="container mx-auto">
        <div className="w-full text-center my-8">
          <h1 className="text-4xl font-semibold text-gray-800">Crypto Performance Comparison</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="w-full text-center mb-8">
            <h1 className="text-4xl font-semibold text-gray-800">Your Search Results</h1>
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