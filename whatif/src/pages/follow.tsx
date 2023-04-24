// pages/follow.tsx
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import Header from '../components/Header';

function Follow() {
  const developers = [
    {
      name: 'Sergio Arcila',
      position: 'Frontend Developer',
      bio: 'Sergio is a software engineer with over 10 years of experience. He is responsible for leading the front end team and ensuring the project stays on track.',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Benjamin Mendoza',
      position: 'Backend Developer',
      bio: 'Ben is a skilled backend developer who specializes in creating efficient and scalable APIs. He has a strong background in Golang and is responsible for leading the back end team.',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Eldhose Salby',
      position: 'Backend Developer',
      bio: 'Bob is a dedicated DevOps engineer with a deep understanding of cloud infrastructure and automation. He ensures the smooth deployment and maintenance of the project.',
      image: 'https://via.placeholder.com/150',
    },
  ];

  let isLoggedIn: boolean = false;

  if (typeof window !== 'undefined' && window.sessionStorage) {
    isLoggedIn = sessionStorage.getItem('loggedIn') != null;
  } else {
    console.warn('sessionStorage is not available.');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Follow - WhatIF</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header isLoggedIn={isLoggedIn} />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h1 className="text-4xl font-bold mb-10 text-center">Our Developers</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {developers.map((developer, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <img
                  className="mx-auto w-24 h-24 rounded-full mb-4"
                  src={developer.image}
                  alt={developer.name}
                />
                <h2 className="text-2xl font-medium mb-2 text-center">{developer.name}</h2>
                <h3 className="text-lg text-gray-500 mb-4 text-center">{developer.position}</h3>
                <p className="text-lg">{developer.bio}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/">
              <h1 className="text-blue-600 hover:underline">Back to Home</h1>
            </Link>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default Follow;