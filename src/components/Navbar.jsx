import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import SigninButton from './elements/SigninButton';

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    setLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="w-full bg-black/30 backdrop-blur border-b border-yellow-400/20 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
          <div className="text-2xl sm:text-3xl">🌟</div>
          <a href='/'>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-yellow-300 leading-tight">Kalaga Prasad Astrology</h1>
              <p className="text-xs lg:text-sm text-blue-200 mt-1 lg:mt-0">Scientific Astrology Expert</p>
            </div>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-6">
          <a href='/'>
            <button className="text-white hover:text-yellow-300">Home</button>
          </a>
          <a href="#services">
            <button className="text-white hover:text-yellow-300">Services</button>
          </a>
          {loggedIn && (
            <a href="/your-orders">
              <button className="text-white hover:text-yellow-300">Your Orders</button>
            </a>
          )}
          <a href="/booking">
            <button className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-xl font-semibold shadow hover:bg-yellow-300">
              Book Now
            </button>
          </a>
          <SigninButton />
        </nav>
        {/* Mobile Menu Button */}
        <div className='flex sm:hidden items-center ml-4'>
             <a href="/booking" className="mr-2 ">
              <button className="bg-yellow-400 text-blue-900 w-full py-2 rounded-xl font-semibold shadow hover:bg-yellow-300 px-4 text-xs whitespace-nowrap">
                Book{" "}Now
              </button>
            </a>
        <div className="sm:hidden">
            <button onClick={toggleMenu} className="text-yellow-300 text-2xl focus:outline-none ">
              ☰
            </button>
          </div>
        </div>
        </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4">
          <div className="flex flex-col gap-4 p-4 rounded-lg ">
            <a href="/" className="text-white hover:text-yellow-300 text-center">Home</a>
            <a href="#services" className="text-white hover:text-yellow-300 text-center">Services</a>
            {loggedIn && (
              <a href="/your-orders" className="text-white hover:text-yellow-300 text-center">Your Orders</a>
            )}
           
            <a href='/' className="text-white hover:text-yellow-300 text-center">
              User Profile
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
