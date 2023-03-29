// pages/features.tsx
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

function Features() {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Features - WhatIF</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className="p-10">
        <h1 className="text-4xl font-bold mb-10">Our Best Features</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-medium mb-4">Historical Data Analysis</h2>
            <p className="text-lg mb-4">
              Analyze historical financial data with ease. Our platform provides access to a wealth of historical data, allowing you to make informed decisions based on past performance.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-medium mb-4">Interactive Charts</h2>
            <p className="text-lg mb-4">
              Visualize trends and patterns with our interactive charts. Easily compare different stocks, indices, and timeframes to get a comprehensive understanding of market movements.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-medium mb-4">Customizable Alerts</h2>
            <p className="text-lg mb-4">
              Stay up-to-date with the latest market developments with customizable alerts. Set your preferences and receive notifications when stocks, indices, or other financial instruments reach specified levels.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <Link href="/">
            <h1 className="text-blue-600 hover:underline">Back to Home</h1>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Features;
