import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../pictures/Logo1.png';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8008/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "Email": email, 
                               "Password": password }),

      });
      const data = await response.json();
      // Within this if Statement, i'd like to route back to the homepage if true.
      // Not sure how to accomplish this in React.
      console.log(data);
      if (data.LoggedIn == true) {
        sessionStorage.setItem("loggedIn", data.Email)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="bg-black fixed top-0 left-0 h-screen w-screen flex items-center justify-center">
        <Link href="/">
          <h1 className="absolute top-3 left-3 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
            Back
          </h1>
        </Link>
      <div className="bg-white p-6 rounded-lg">
        <div>
        <Image src={logo} alt="LOGO" width={249} height={107} />
        </div>
        <h1 className="text-2xl font-medium mb-4 text-purple-600">Welcome to WhatIF</h1>

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
            />
          </div>
          {/* <Link href="/homepage"> */}
              <button
                className="bg-indigo-500 text-white py-2 px-8 rounded-lg hover:bg-indigo-600"
                type="submit"
              >
                Log in
              </button>
        
          {/* </Link> */}
          <Link href="/signup">
            
              <button className="block mt-4 text-center text-indigo-500">
                Don't have an account? Sign up
              </button>
            
          </Link>
          <Link href="/screens/GoogleSignIn">
            
              <button className="block mt-4 text-center text-indigo-500">
                Sign In with Google
              </button>
            
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
