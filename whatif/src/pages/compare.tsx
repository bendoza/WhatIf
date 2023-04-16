import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CryptoSelection from '../components/cryptoSelection';
import DateSelection from '../components/dateselection';
import withAuth from '../components/withAuth';

const ComparePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        <CryptoSelection />
        <DateSelection />
      </div>
    </div>
  );
};

export default withAuth(ComparePage);
