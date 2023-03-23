import React from 'react';
import logo from '../images/Logo1.png';
import styles from './Header.module.css';

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <img src={logo} alt="Logo" style={{ height: '100px', width: '100px' }} />

        <div className={styles.links}>
          <a href="/" className="text-gray-600 hover:text-blue-500">
            Home
          </a>
          <a href="/features" className="text-gray-600 hover:text-blue-500">
            Features
          </a>
          <a href="/about" className="text-gray-600 hover:text-blue-500">
            About
          </a>
        </div>

        <button className={`bg-blue-500 text-white font-bold ${styles.button}`}>
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Header;
