import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'venta': 'category-sale',
      'compra': 'category-buy', 
      'cambio': 'category-exchange'
    };
    return colors[category] || 'category-default';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'venta': 'En Venta',
      'compra': 'Se Compra',
      'cambio': 'Para Cambiar'
    };
    return labels[category] || 'Producto';
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-link">
        <img 
          src={product.images?.[0] || '/placeholder-image.jpg'} 
          alt={product.title}
          className="product-image"
        />
        <div className="product-content">
          <span className={`category-tag ${getCategoryColor(product.category)}`}>
            {getCategoryLabel(product.category)}
          </span>
          
          {/* TÍTULO SIN la clase problemática */}
          <h3 className="product-title">
            {product.title}
          </h3>
          
          <p className="product-price">
            {product.category === 'cambio' ? ' Intercambio' : `$${product.price}`}
          </p>
          
          <div className="product-details">
            <div className="product-detail">
              <span>Condición:</span>
              <span className="product-detail-value capitalize">{product.condition}</span>
            </div>
            <div className="product-detail">
              <span>Facultad:</span>
              <span className="product-detail-value">{product.faculty}</span>
            </div>
          </div>
          
          <div className="seller-info">
            <span className="seller-label">Publicado por:</span>
            <span className="seller-name">{product.seller?.name || 'Anónimo'}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;