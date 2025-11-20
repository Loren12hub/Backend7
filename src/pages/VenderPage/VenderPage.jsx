import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { articulosAPI } from '../../services/api';
import './VenderPage.css';

const VenderPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await articulosAPI.getArticulos();
      
      // Filtrar productos de COMPRA
      const allProducts = response.data.datos || response.data || [];
      const compraProducts = allProducts.filter(product => product.categoria === 'compra');
      
      setProducts(compraProducts);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vender-container">
      <Navbar />
      
      <div className="vender-header">
        <h1 className="vender-title">
           Productos que <span className="vender-title-gradient">Buscan Compradores</span>
        </h1>
        <p className="vender-subtitle">
          Productos que otros estudiantes están buscando comprar
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">
            No hay productos buscando compradores en este momento.
          </p>
          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '10px' }}>
            (Solo se muestran productos con categoría "compra")
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={product.imagen 
                    ? `http://localhost:5000${product.imagen}`
                    : 'https://images.unsplash.com/photo-1581093458791-8a6b5d202e9f?w=400&h=300&fit=crop'
                  }
                  alt={product.nombre}
                  className="product-image"
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-title">{product.nombre}</h3>
                <div className="product-price">${product.precio}</div>
                <p className="product-description">{product.descripcion}</p>
                
                <div className="product-meta">
                  <span className="product-category"> Busco Comprar</span>
                  <span className="product-condition">{product.condicion}</span>
                </div>

                <div className="seller-info">
                  <p><strong>Publicado por:</strong> {product.vendedor}</p>
                  <p><strong>Contacto:</strong> {product.contacto}</p>
                  <p><strong>Carrera:</strong> {product.carrera}</p>
                </div>
                
                <button className="contact-button">
                  Ofrecer Producto
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenderPage;