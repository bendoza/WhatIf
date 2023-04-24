import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      setIsLoggedIn(sessionStorage.getItem('loggedIn') != null);
    } else {
      console.warn('sessionStorage is not available.');
    }
  }, []);

  return (
    <div className="mx-auto">
      <Head>
        <title>WHAT IF</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header isLoggedIn={isLoggedIn} />

      <div
        className="text-center py-80"
        style={{
          backgroundImage: "url('pictures/regret.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="bg-black bg-opacity-70 p-12 rounded-lg max-w-3xl mx-auto shadow-2xl">
          <h1 className="text-7xl font-serif text-white mb-4">Welcome to WhatIF</h1>
          <h2 className="text-2xl text-gray-200 mb-12 font-semibold">
            How much money would you have made?
          </h2>

          {isLoggedIn ? (
            <Link href="/compare">
              <span className="text-2xl text-white bg-green-600 px-10 py-4 rounded-lg shadow-lg font-semibold hover:bg-green-700 transition-colors duration-200">
                Compare Now!
              </span>
            </Link>
          ) : (
            <Link href="/signup">
              <span className="text-2xl text-white bg-green-600 px-10 py-4 rounded-lg shadow-lg font-semibold hover:bg-green-700 transition-colors duration-200">
                Get started
              </span>
            </Link>
          )}
        </div>
      </div>
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}
