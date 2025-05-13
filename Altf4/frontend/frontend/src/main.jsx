import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import App from './App.jsx';

import Partite from './pages/Partite.jsx';
import Shop from './pages/Shop.jsx';
import Careers from './pages/Careers.jsx';
import Info from './pages/Info.jsx';
import Valorant from './pages/Valorant.jsx';
import CSGO2 from './pages/CSGO2.jsx';
import FIFA from './pages/FIFA.jsx';
import LOL from './pages/LOL.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/partite" element={<Partite />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about/careers" element={<Careers />} />
        <Route path="/about/info" element={<Info />} />
        <Route path="/games/valorant" element={<Valorant />} />
        <Route path="/games/csgo2" element={<CSGO2 />} />
        <Route path="/games/fifa" element={<FIFA />} />
        <Route path="/games/lol" element={<LOL />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
