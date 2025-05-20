import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CartProvider } from './context/CartContext';

import './index.css';
import Layout from './components/Layout.jsx';
import App from './App.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Checkout from './pages/Checkout.jsx';
import AboutUs from './pages/AboutUs.jsx';  /*DA IMPLEMENTARE*/ 
import TeamPage from './pages/TeamPage.jsx' /*DA IMPLEMENTARE*/

/*AGGIUNTA TENNYYYS*/
import LoginForm from './pages/login/LoginForm.jsx';
import RegisterForm from './pages/login/RegisterForm.jsx';
import Profilo from './pages/Profilo.jsx';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />

          {/*AGGIUNTA TENNYYS*/}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profilo" element={<Profilo />} />
          {/* Route padre con layout comune */}
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/category/:category" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/games/:slug" element={<TeamPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
);
