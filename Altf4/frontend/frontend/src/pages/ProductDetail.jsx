import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const sliderRef = useRef(null);
  const touchStartX = useRef(null);

  /*const images = product?.images || [];*/

  useEffect(() => {

    setLoading(true);
    fetch(`http://localhost/altf4/backend/get_product.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(true);
        } else {
          setProduct({
            ...data,
            images: JSON.parse(data.images),
            sizes: JSON.parse(data.sizes)
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % product.images.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - touchStartX.current;

    if (diffX > 50) prevImage();
    else if (diffX < -50) nextImage();
  };

  const handleAddToCart = () => {
  if (!selectedSize) {
    alert('Seleziona una taglia');
    return;
  }

  addToCart({
    id: `${product.id}-${selectedSize}`,
    name: product.name,
    price: product.price,
    image: product.images[0],
    size: selectedSize,
    quantity: quantity,
  });

  setQuantity(1);
  setSelectedSize(null);
};

  if (!product) return <p>Prodotto non trovato</p>;

  return (
    
    <main className="product-page">
      <Link to="/shop" className="back-arrow" title="Torna allo shop"><FaArrowLeft /></Link>

      <div className="product-content">
        {/* Galleria immagini */}
        <div className="gallery-container">
          <div
            className="image-slider"
            ref={sliderRef}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {product.images.map((src, index) => (
              <img key={index} src={src} alt={`Immagine ${index + 1}`} />
            ))}
          </div>

          <button className="nav-button left" onClick={prevImage}>&#10094;</button>
          <button className="nav-button right" onClick={nextImage}>&#10095;</button>

          <div className="dots-container">
            {product.images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              ></span>
            ))}
          </div>
        </div>

        {/* Dettagli prodotto */}
        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="price">€{product.price}</p>
          <p className="product-description">{product.description}</p>
          <div className="size-options">
            {product.sizes.map((size) => (
              <div
                key={size}
                className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>
          <div className="purchase-row">
            <div className="quantity-selector">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>   
            <button
                className={`buy-button ${!selectedSize ? 'disabled' : ''}`}
                disabled={!selectedSize}
                onClick={handleAddToCart}
            >
                ADD TO CART
            </button>
            
          </div>
        </div>
      </div>
    </main>
  );
}
