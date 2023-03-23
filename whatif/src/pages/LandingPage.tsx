import React from 'react';
import Header from '../components/Header';
import homeImage from '../images/home.jpg';

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <Header></Header>
      <div className="flex space-x-4"></div>

      {/* Updated section with background image and content */}
      <section
        className="relative flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${homeImage})`,
          width: '100%',
          minHeight: '80vh', // Adjust the value to set a minimum height for the section
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute left-1/4">
          <h2 className="text-7xl md:text-9xl font-bold text-white mb-6 tracking-wide">Welcome to WHATIF</h2>
          <p className="text-3xl md:text-4xl text-white mb-8 tracking-wide">Find out how much you would have had if you just HODL</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
