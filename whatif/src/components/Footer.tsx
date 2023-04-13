import React from 'react';
import Link from 'next/link';

type FooterProps = {
  isLoggedIn: boolean;
};

const Footer: React.FC<FooterProps> = ({ isLoggedIn }) => {
  return (
    <div>
      {isLoggedIn ? (
        <LoggedInFooter />
      ) : (
        <LoggedOutFooter />
      )}
    </div>
  );
};

const LoggedInFooter: React.FC = () => {
  return (
    <footer className="text-base py-12">
      <div className="container mx-auto px-4 flex flex-wrap justify-between">
        {/* Add any custom links or information specific to the logged-in state here */}
        <div className="links flexrow flex-wrap justify-center mt-4">
          {/* ... */}
        </div>
        {/* ... */}
      </div>
    </footer>
  );
};

const LoggedOutFooter: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
    <div className="container mx-auto px-4 flex flex-wrap justify-between">
      <div className="w-full md:w-1/4 mb-8 md:mb-0">
        <h3 className="font-bold text-xl mb-4">About Us</h3>
        <p>
          We are h3company dedicated to providing the best services and products to our customers. Our mission is to make the world h3better place through innovative solutions and exceptional customer service.
        </p>
      </div>
      <div className="w-full md:w-1/4 mb-8 md:mb-0">
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
      <div className="w-full md:w-1/4 mb-8 md:mb-0">
        <h3 className="font-bold text-xl mb-4">Contact</h3>
        <ul>
          <li className="mb-2 flex items-center">
            <i className="fas fa-phone mr-2"></i>+1 (555) 123-4567
          </li>
          <li className="mb-2 flex items-center">
            <i className="fas fa-envelope mr-2"></i>info@example.com
          </li>
          <li className="mb-2 flex items-center">
            <i className="fas fa-map-marker-alt mr-2"></i>123 Main St, City, Country
          </li>
        </ul>
      </div>
      <div className="w-full md:w-1/4">
        <h3 className="font-bold text-xl mb-4">Follow Us</h3>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-400">
            <i className="fab fa-facebook-f text-xl"></i>
          </a>
          <a href="#" className="hover:text-blue-400">
            <i className="fab fa-twitter text-xl"></i>
          </a>
          <a href="#" className="hover:text-blue-400">
            <i className="fab fa-linkedin-in text-xl"></i>
          </a>
          <a href="#" className="hover:text-blue-400">
            <i className="fab fa-instagram text-xl"></i>
          </a>
        </div>
      </div>
    </div>
    <div className="mt-8 border-t-gray-700">
<div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
<p className="text-sm">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
<div className="flex space-x-4">
<Link href="/privacy">
<h3 className="text-sm hover:text-blue-400">Privacy Policy</h3>
</Link>
<Link href="/terms">
<h3 className="text-sm hover:text-blue-400">Terms of Service</h3>
</Link>
</div>
</div>
</div>
</footer>
  );
};

export default Footer;
