import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { products } from '../data/product';
import './Shop.css';

import { useEffect, useState } from 'react';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const { category } = useParams();

  useEffect(() => {
  fetch("http://localhost/altf4/backend/get_products.php")
    .then(res => res.json())
    .then(data => setProducts(data))
    .catch(err => console.error("Errore nel caricamento prodotti:", err));
}, []);

  const filteredProducts = category
  ? products.filter(product => product.type === category)
  : products;

  return (
    
    <div className="shop-container">
      <h1 className="shop-title">Tutti i Prodotti</h1>
      <div className="shop-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <Link to={`/shop/${product.id}`}>
              <div className="image-wrapper">
                <img src={product.images[0]} alt={product.name} />
                <img
                  src={product.images[1]}
                  alt={`${product.name} Hover`}
                  className="hover"
                />
              </div>
              <div className="product-info">
                <p className="product-name">{product.name}</p>
                <p className="product-price">€{product.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}