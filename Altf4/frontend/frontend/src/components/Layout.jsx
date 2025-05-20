import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Layout.css'; // o Layout.css se li hai separati
import CartPopup from '../components/CartPopup'; // o './CartPopup' se nella stessa cartella
import { useCart } from '../context/CartContext';

import { FaUserCircle } from "react-icons/fa";


export default function Layout() {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const BANNER_TEXT = '#GO ALT+F4';
  const REPEAT_COUNT = 100;
  const baseItems = Array.from({ length: REPEAT_COUNT }, () => BANNER_TEXT);
  const bannerItems = [...baseItems, ...baseItems];
  const { cart } = useCart();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  /*AGGIUNTA TENNYYS*/
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };


  return (
    <div className="min-h-screen w-full text-white bg-black overflow-x-hidden">
      {/* Header dinamico orizzontale */}
      <header className="flex items-center justify-between p-4 fixed top-12 z-50 w-full bg-black">
        {/* Riga 1: logo + icone */}
        <div className="header-top">
          <div onClick={() => navigate('/')} className="logo cursor-pointer">
            <img src="/IMAGE/logo.png" alt="Logo AltF4" className="logo-img" />
          </div>
          {/* TOP RIGHT ICONS */}
          <div className="top-icons">
            <div className="cart-icon"onClick={() => setIsCartOpen(true)}>
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-count">{cartItemCount}</span>
            </div>

            {/*da aggiungere il path per il link*/}
              <button className="game-icon" onClick={() => navigate('/')}>
                 <img src="/IMAGE/game.png" alt="Gioco" className="game-logo"/> 
              </button>
            
                {/*TENNYYY*/}
                {!username && (
                <button className="uppercase" onClick={() => navigate('/login')}>LOGIN</button>

                )}

              {username && (
                <div className="relative group profile-wrapper">
                  <button className="text-yellow-400">
                    <FaUserCircle size={28} />
                  </button>
                  <ul className="absolute right-0 top-full mt-1 bg-yellow-300 text-black rounded px-4 py-2 z-50 shadow-lg font-semibold text-sm">
                    <li className="py-1 border-b border-gray-400">👤 {username}</li>
                    <li>
                      <Link to="/profilo" className="block py-1 hover:text-red-600">Profilo</Link>
                    </li>
                    <li className="logout-button-wrapper relative">
                      <button onClick={handleLogout} className="hover:bg-red-600 w-full text-left px-2 py-1">Logout</button>
                      <span className="tooltip">Sei sicuro di voler effettuare il logout?</span>
                    </li>
                  </ul>
                </div>
              )} 

          </div>
        </div>



        <div className="menu-top-line" /> {/* ← Linea nera sopra il menu */}

        <nav className="flex-1 mx-8 flex gap-6 text-white">
          <div className="relative group">
            <button className="uppercase" onClick={() => navigate('/shop')}>SHOP</button>
            <ul>
              <li><Link to="/shop/category/tshirt" className="hover:bg-gray-800">T-Shirt</Link></li>
              <li><Link to="/shop/category/felpa" className="hover:bg-gray-800">Felpe</Link></li>
              <li><Link to="/shop/category/cappello" className="hover:bg-gray-800">Cappelli</Link></li>
            </ul>
          </div>
          <div className='relative group'>
            <button className="hover:text-yellow-400 uppercase"  onClick={() => navigate('/aboutus')}>ABOUT US</button>
          </div>
          <div className="relative group">
            <button className="hover:text-yellow-400 uppercase">TEAMS</button>
            <ul>
              <li><Link to="/games/valorant" className="hover:bg-gray-800">VALORANT</Link></li>
              <li><Link to="/games/fifa" className="hover:bg-gray-800">FIFA</Link></li>
              <li><Link to="/games/csgo2" className="hover:bg-gray-800">CS:GO2</Link></li>
              <li><Link to="/games/lol" className="hover:bg-gray-800">LEAGUE OF LEGENDS</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Scroll banner sopra l’header */}
      <section className="scroll-banner fixed top-0 w-full bg-black z-50 h-12">
        <div className="scroll-banner-text">
          {bannerItems.map((txt, i) => (
            <span key={i} className="mr-8">
              {txt}
            </span>
          ))}
        </div>
      </section>

      {isCartOpen && <CartPopup onClose={() => setIsCartOpen(false)} />}


      {/* Contenuto delle pagine */}
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
