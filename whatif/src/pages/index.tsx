import Head from 'next/head'
import Link from 'next/link';
import Header from '../components/Header'
import TestComponent from '../components/TestComponent';


export default function Home() {

  let isLoggedIn: boolean = false;

  if (typeof window !== 'undefined' && window.sessionStorage) {
    isLoggedIn = sessionStorage.getItem('loggedIn') != null;
  } else {
    console.warn('sessionStorage is not available.');
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>WHAT IF</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header isLoggedIn={isLoggedIn}/>

    <div className=' flex justify-between items-center bg-blue-400 border-y border-black py-40'> 
      <div className='px-10 space-y-2'>
        <h1 className="text-6xl max-w-xl font-serif">
          Welcome to WhatIF
        </h1>
        <h2 className="text-xl">How much money would you have made?</h2>

        <div className="max-w-xs py-10">
        <Link href="/signup">
        <h1 className='text-3xl text-white bg-green-600 px-4 py-3 rounded text-center'>Get started</h1>
        </Link>
        </div>
      </div>
    </div>
  </div>

    
    
  )
}
