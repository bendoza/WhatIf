import React from 'react';
import Link from 'next/link';

type FooterProps = {
  isLoggedIn: boolean;
};

const Footer: React.FC<FooterProps> = ({ isLoggedIn }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-3 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-xl mb-4">WhatIf</h3>
          <p>
            WhatIf is a web-based platform providing investors with valuable insights into potential returns of their hypothetical cryptocurrency investments. Our mission is to help users make informed investment decisions based on historical market trends and patterns.
          </p>
        </div>
        <div className="justify-center mx-auto">
          <h3 className="font-bold text-xl mb-4">Quick Links</h3>
          <ul>
            <li className="mb-2">
              <Link href="/">
                <h3 className="hover:text-blue-400">Home</h3>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/features">
                <h3 className="hover:text-blue-400">Features</h3>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/about">
                <h3 className="hover:text-blue-400">About</h3>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/follow">
                <h3 className="hover:text-blue-400">Follow</h3>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-xl mb-4">Quick Contact</h3>
          <form>
            <input
              type="text"
              className="w-full bg-white text-black px-3 py-2 mb-4 rounded"
              placeholder="Name"
            />
            <input
              type="email"
              className="w-full bg-white text-black px-3 py-2 mb-4 rounded"
              placeholder="Email address"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8 border-t-2 border-gray-700">
        <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
          <p className="text-sm">© {currentYear} WhatIf. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/privacy">
              <h3 className="text-sm hover:text-blue-400 cursor-pointer">Privacy Policy</h3>
            </Link>
            <Link href="/terms">
              <h3 className="text-sm hover:text-blue-400 cursor-pointer">Terms of Service</h3>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
