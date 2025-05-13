import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link, useNavigate } from 'react-router-dom';
import 'swiper/css';
import './index.css';
import './App.css';

export default function App() {
  const [partite, setPartite] = useState([]);
  const navigate = useNavigate();
  const BANNER_TEXT = '#GO ALT+F4';
  const REPEAT_COUNT = 100;
  const baseItems = Array.from({ length: REPEAT_COUNT }, () => BANNER_TEXT);
  const bannerItems = [...baseItems, ...baseItems];

  useEffect(() => {
    fetch('http://localhost:8000/partite')
      .then(res => res.json())
      .then(data => setPartite(data))
      .catch(err => console.error('Errore nel recupero dati:', err));
  }, []);

  return (
    <div className="min-h-screen w-full text-white bg-black overflow-x-hidden">

      {/* Header dinamico orizzontale */}
      <header className="flex items-center justify-between p-4">
        <div
          onClick={() => navigate('/')}
          className="text-white text-xl font-extrabold tracking-wider uppercase cursor-pointer transition duration-300 hover:text-yellow-400"
        >
          Alt+F4
        </div>
        <nav className="flex-1 mx-8 flex gap-6">
          <div className="relative group">
            <button className="hover:text-xl-yellow-400 uppercase">Shop</button>
            <ul>
              <li><Link to="/shop/tshirt" className="hover:bg-gray-800">T-Shirt</Link></li>
              <li><Link to="/shop/felpe" className="hover:bg-gray-800">Felpe</Link></li>
              <li><Link to="/shop/cappelli" className="hover:bg-gray-800">Cappelli</Link></li>
            </ul>
          </div>
          <div className='relative group'>
            <button className="hover:text-yellow-400 uppercase">About Us</button>
            <ul>
              <li><Link to="/aboutUs/careers" className="hover:bg-gray-800">Careers</Link></li>
              <li><Link to="/aboutUs/info" className="hover:bg-gray-800">Info</Link></li>
            </ul>
          </div>
          <div className="relative group">
            <button className="hover:text-yellow-400 uppercase">Teams</button>
            <ul>
              <li><Link to="/teams/valorant" className="hover:bg-gray-800">Valorant</Link></li>
              <li><Link to="/teams/fifa" className="hover:bg-gray-800">FIFA</Link></li>
              <li><Link to="/teams/csgo2" className="hover:bg-gray-800">CS:GO2</Link></li>
              <li><Link to="/teams/lol" className="hover:bg-gray-800">League of Legends</Link></li>
            </ul>
          </div>
          <Link to="/partite" className="hover:text-yellow-400 uppercase">Partite</Link>
          <Link to="/login" className="hover:text-yellow-400 uppercase">Login</Link>
          <div className='relative group'>
            <button className="hover:text-yellow-400 uppercase">
          </button>
          </div>
        </nav>
      </header>

      {/* Scroll banner sopra il video */}
      <section className="scroll-banner">
        <div className="scroll-banner-text">
          {bannerItems.map((txt, i) => (
            <span key={i} className="mr-8">
              {txt}
            </span>
          ))}
        </div>
      </section>

      {/* Banner hero con video e testo */}
      <section className="relative w-screen aspect-video mt-[2cm] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/bg.mp4" type="video/mp4" />
          Il tuo browser non supporta il video.
        </video>
        <div className="hero-text-overlay">
          <h1>WHEN WE PLAY<br/>OTHERS QUIT</h1>
        </div>
      </section>

      {/* Titolo “Partite” subito sotto il video */}
      <h2 className="text-3xl font-bold text-center mt-8">Partite</h2>

      {/* Lista partite */}
      <section id="partite" className="p-6 bg-black/90 rounded-xl max-w-6xl mx-auto mt-32">
        <h2 className="text-3xl mb-6 font-bold border-b border-yellow-500 pb-2 uppercase">
          Partite Registrate
        </h2>
        <ul className="space-y-4">
          {partite.map((p, idx) => (
            <li key={idx} className="bg-gray-800 p-5 rounded hover:bg-gray-700 transition">
              {p.data} {p.ora} — {p.team_alt} vs {p.team_enemy} → {p.risultato || '—'}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
