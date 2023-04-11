// pages/about.tsx
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

function About() {

  let isLoggedIn: boolean = false;

  if (typeof window !== 'undefined' && window.sessionStorage) {
    isLoggedIn = sessionStorage.getItem('loggedIn') != null;
  } else {
    console.warn('sessionStorage is not available.');
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>About Us - WhatIF</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='bg-blue-100'>
        <Header isLoggedIn={isLoggedIn}/>
      </div>

      <div className="p-10">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg mb-4">
          WhatIF is a platform that helps users analyze historical financial data and make informed decisions. Our mission is to empower individuals to make better financial choices by providing them with the tools and insights they need.
        </p>
        <p className="text-lg mb-4">
          Our team consists of financial experts, data scientists, and software engineers who are passionate about helping others succeed in their financial journeys. We are constantly working to improve our platform and provide users with the most accurate and up-to-date information possible.
        </p>
        <p className="text-lg mb-4">
          We believe that everyone should have access to the knowledge and resources needed to make informed financial decisions. By providing our users with easy-to-understand insights, we hope to break down the barriers that often prevent people from investing in their future.
        </p>
        <p className="text-lg mb-4">
          Thank you for choosing WhatIF, and we look forward to helping you achieve your financial goals.
        </p>
        <Link href="/">
          <h1 className="text-blue-600 hover:underline">Back to Home</h1>
        </Link>
      </div>
    </div>
  );
}

export default About;
