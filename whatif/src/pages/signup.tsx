import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import logo from '../pictures/Logo1.png';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error('Passwords do not match.');
      setErrorMessage('Passwords do not match.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    try {
      const response = await fetch('http://localhost:8008/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "Email": email, 
                               "Password": password }),
      });
      const data = await response.json();
      console.log(data.Success);
  
      if (data.Success) {
        router.push('/signin');
      } else {
        setErrorMessage('Unable to sign up, try again with a different email.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };
  


  return (
    <div className="bg-black fixed top-0 left-0 h-screen w-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <Link href="/">
          <h1 className="absolute top-3 left-3 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
            Back
          </h1>
        </Link>
        <div>
          <Image src={logo} alt="LOGO" width={249} height={107} />
        </div>
        <h1 className="text-2xl font-medium mb-4 text-purple-600">Sign Up for WhatIF</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="border border-gray-400 p-2 rounded-lg w-full"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="border border-gray-400 p-2 rounded-lg w-full"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="border border-gray-400 p-2 rounded-lg w-full"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="bg-indigo-500 text-white py-2 px-8 rounded-lg hover:bg-indigo-600"
            type="submit"
          >
            Sign Up
          </button>
          <Link href="/signin">
            <h1 className="block mt-4 text-center text-indigo-500">
              Already have an account? Log in
            </h1>
          </Link>
        </form>
      </div>
      {errorMessage && (
        <div className="absolute bottom-10 left-10 bg-red-500 text-white py-2 px-4 rounded-lg">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default SignUp;
