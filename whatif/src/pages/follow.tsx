// pages/follow.tsx
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

function Follow() {
  const developers = [
    {
      name: 'Sergio Arcila',
      position: 'Frontend Developer',
      bio: 'Sergio is a software engineer with over 10 years of experience. He is responsible for leading the team and ensuring the project stays on track.',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Benjamin Mendoza',
      position: 'Backend Developer',
      bio: 'Jane is a skilled backend developer who specializes in creating efficient and scalable APIs. She has a strong background in Node.js and database design.',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Phillip Hurm',
      position: 'Frontend Developer',
      bio: 'Alice is a talented frontend developer with a keen eye for design. She is an expert in React and CSS, and she helps create intuitive user interfaces.',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Eldhose Salby',
      position: 'Backend Developer',
      bio: 'Bob is a dedicated DevOps engineer with a deep understanding of cloud infrastructure and automation. He ensures the smooth deployment and maintenance of the project.',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Follow - WhatIF</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className="p-10">
        <h1 className="text-4xl font-bold mb-10">Our Developers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {developers.map((developer, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <img
                className="mx-auto w-24 h-24 rounded-full mb-4"
                src={developer.image}
                alt={developer.name}
              />
              <h2 className="text-2xl font-medium mb-2">{developer.name}</h2>
              <h3 className="text-lg text-gray-500 mb-4">{developer.position}</h3>
              <p className="text-lg">{developer.bio}</p>
            </div>
          ))}
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

export default Follow;
