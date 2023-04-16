import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CryptoSelection from '../components/cryptoSelection';
import DateSelection from '../components/dateselection';
import withAuth from '../components/withAuth';

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

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} />
      <div className="grid grid-cols-2 gap-4">
        <CryptoSelection onSelectedCryptoStrings={handleSelectedCryptoStrings} />
        <DateSelection onSelectDate={handleDateSelection}/>
      </div>
    </div>
  );
};

export default withAuth(ComparePage);
