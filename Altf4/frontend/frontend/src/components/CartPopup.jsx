// src/components/CartPopup.jsx
import './CartPopup.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';

export default function CartPopup({ onClose }) {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);



const handleCheckout = () => {
  const username = localStorage.getItem("username");

  if (!username) {
    setShowLoginPopup(true);
  } else {
    navigate("/checkout");
  }
};


  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className="cart-popup">
      <div className="cart-header">
        <span className="cart-title">YOUR CART:</span>
        <span className="cart-total">€{total.toFixed(2)}</span>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="cart-body">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p style={{ textAlign: 'center', paddingTop: '2rem', color: '#888' }}>Your Cart Is Empty!</p>
            <img src="/IMAGE/bee_shop.webp" alt="Empty Cart" className="empty-cart-img" />
            <p className="shop-now" onClick={() => navigate("/shop")}>Shop Now!</p>
          </div>
        ) : (
            <ul className="cart-items">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                        <div>
                          <strong>{item.name}</strong> {item.size && `(${item.size})`}
                        </div>
                        <div>€{item.price} x {item.quantity}</div>
                        <div className="cart-actions">
                            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                            <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                  </li>
                ))}
            </ul>  
        )}
        {cart.length > 0 && (
          <div className="checkout-bar">
            <button className="checkout-button" onClick={handleCheckout}>GO TO CHECKOUT</button>
          </div>
        )}

      </div>

      {showLoginPopup && (
        <div className="login-popup-overlay" onClick={() => setShowLoginPopup(false)}>
          <div className="login-popup" onClick={(e) => e.stopPropagation()}>
            <p>Per procedere con l'ordine devi effettuare prima il login al tuo account!!</p>
            <div className="popup-buttons">
              <button onClick={() => navigate("/login")}>LOGIN</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
