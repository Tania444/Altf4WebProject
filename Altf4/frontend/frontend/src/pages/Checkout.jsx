// src/pages/Checkout.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

export default function Checkout() {
  const { cart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const BANNER_TEXT = '#GO ALT+F4';
  const REPEAT_COUNT = 100;
  const baseItems = Array.from({ length: REPEAT_COUNT }, () => BANNER_TEXT);
  const bannerItems = [...baseItems, ...baseItems];


  return (
    <div className="checkout-container">

        <section className="scroll-banner fixed top-0 w-full bg-black z-50 h-12">
            <div className="scroll-banner-text">
              {bannerItems.map((txt, i) => (
                <span key={i} className="mr-8">
                  {txt}
                </span>
                ))}
            </div>
        </section>

        <div className="checkout-header">
            <Link to="/" className="checkout-link">
                <img src="/IMAGE/logo.png" alt="ALT Logo" className="checkout-logo" />
            </Link>
        </div>

      {/* Colonna sinistra: form utente */}
      <div className="checkout-form">
        <h2>Delivery</h2>
        <form>
          <input placeholder="Country/Region" defaultValue="Italy" />
          <div className="two-cols">
            <input placeholder="First name" />
            <input placeholder="Last name" />
          </div>
          <input placeholder="Company (optional)" />
          <input placeholder="Address" />
          <input placeholder="Apartment, suite, etc. (optional)" />
          <div className="two-cols">
            <input placeholder="Postal code" />
            <input placeholder="City" />
          </div>
          <input placeholder="Phone" />
        </form>

        <h3>Shipping method</h3>
        <div className="shipping-note">
          Enter your shipping address to view available shipping methods.
        </div>

        <h3>Payment</h3>
        <p>Metodi di pagamento verranno implementati qui.</p>
      </div>

      {/* Colonna destra: riepilogo carrello */}
      <div className="checkout-summary">
        <h2>Order Summary</h2>
        <ul>
          {cart.map((item, i) => (
            <li key={i}>
              <div className="item-details">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name} {item.size && `| ${item.size}`}</p>
                  <p>€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="discount-code">
          <input placeholder="Discount code or gift card" />
          <button>Apply</button>
        </div>

        <div className="totals">
          <p>Subtotal ({cart.length} items): €{total.toFixed(2)}</p>
          <p>Shipping: <span className="small">Enter shipping address</span></p>
          <h3>Total: €{total.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}
