import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import logo from '../pictures/logo4.png';

type HeaderProps = {
  isLoggedIn: boolean;
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    if (sessionStorage.getItem("loggedIn") != null) {
      sessionStorage.removeItem("loggedIn");
      window.location.reload();
    }
    else {
      console.log('user has not signed in.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const Header = ({ isLoggedIn }: HeaderProps) => {
  return (
    <div className="bg-black bg-opacity-60 backdrop-blur-md">
      {isLoggedIn ? (
        <SignoutHeader />
      ) : (
        <SigninHeader />
      )}
    </div>
  );
};

const SigninHeader = () => {
  return (
    <header className='flex justify-between p-2 max-w-7xl mx-auto'>
      <div className='flex items-center space-x-5'>
        <Link href="/">
          <div className="w-44 cursor-pointer">
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
      <nav className='hidden md:inline-flex items-center space-x-5'>
        <Link href="/">
          <h3 className='text-lg text-white cursor-pointer'>Home</h3>
        </Link>
        <Link href="/features">
          <h3 className='text-lg text-white cursor-pointer'>Features</h3>
        </Link>
        <Link href="/about">
          <h3 className='text-lg text-white cursor-pointer'>About</h3>
        </Link>
        <Link href="/follow">
          <h3 className='text-lg text-white cursor-pointer'>Follow</h3>
        </Link>
      </nav>
    
      <div className='flex items-center space-x-5'> 
        <Link href="/signin">
          <h3 className='text-white cursor-pointer'>Sign in</h3>
        </Link>
        <Link href="/signup">
          <h3 className='text-white bg-green-600 px-4 py-3 rounded-full cursor-pointer hover:bg-green-700 transition-colors duration-200'>Get started</h3>
        </Link>
      </div>
    </header>
  );
}

const SignoutHeader = () => {
  return (
    <header className='flex justify-between p-2 max-w-7xl mx-auto'>
      <div className='flex items-center space-x-5'>
        <Link href="/">
          <div className="w-44 cursor-pointer">
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
      <nav className='hidden md:inline-flex items-center space-x-5'>
        <Link href="/">
          <h3 className='text-lg text-white cursor-pointer'>Home</h3>
        </Link>
        <Link href="/features">
          <h3 className='text-lg text-white cursor-pointer'>Features</h3>
        </Link>
        <Link href="/about">
          <h3 className='text-lg text-white cursor-pointer'>About</h3>
        </Link>
        <Link href="/follow">
<h3 className='text-lg text-white cursor-pointer'>Follow</h3>
</Link>
</nav>
<div className='flex items-center space-x-5'> 
    <form onSubmit={handleSubmit}>
      <button 
        className='text-white bg-green-600 px-4 py-3 rounded-full cursor-pointer hover:bg-green-700 transition-colors duration-200'
        type='submit'
      >
        Sign out
      </button>
    </form>
  </div>
</header>
);
}

export default Header;
