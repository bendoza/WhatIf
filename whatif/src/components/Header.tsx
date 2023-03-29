import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import logo from '../pictures/Logo1.png';

function Header() {
  return (
    <header className='flex justify-between p-2 max-w-7xl mx-auto'>
      <div className='flex items-center space-x-5'>
        <Link href="/">
          <div className="w-44">
            <Image
              className="object-contain"
              src={logo.src}
              alt="Logo"
              width={200}
              height={50}
              layout="responsive"
            />
          </div>
        </Link>
      </div>
      <div className='hidden md:inline-flex items-center space-x-5'>
      <Link href="/">
            <h3 className='text-lg'>Home</h3>
            </Link>
        <Link href="/features">
            <h3 className='text-lg'>Features</h3>
            </Link>
            <Link href="/about">
            <h3 className='text-lg'>About</h3>
            </Link>
            <Link href="/follow">
            <h3 className='text-lg'>Follow</h3>
            </Link>
        </div>
    
      <div className='flex items-center space-x-5 text-green-600'> 
      <Link href="/signin">
        <h3>Sign in</h3>
        </Link>
        <Link href="/signup">
        <h3 className='text-white bg-blue-600 px-4 py-3 rounded-full'>Get started</h3>
        </Link>
      </div>
    </header>
  );
}

export default Header;
