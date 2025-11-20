import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { articulosAPI } from '../../services/api';
import './ComprarPage.css';

const ComprarPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await articulosAPI.getArticulos();
      const allProducts = response.data.datos || response.data || [];
      
      // Filtrar SOLO productos de VENTA
      const ventaProducts = allProducts.filter(product => product.categoria === 'venta');
      
      setProducts(ventaProducts);
      
    } catch (error) {
      console.error(' Error cargando productos:', error);
      setError('Error al cargar los productos: ' + (error.message || ''));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="comprar-container">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos en venta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comprar-container">
      <Navbar />
      
      <div className="comprar-header">
        <h1 className="comprar-title">
           Productos en <span className="comprar-title-gradient">Venta</span>
        </h1>
        <p className="comprar-subtitle">
          Encuentra productos que otros estudiantes quieren vender
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="empty-state">
          <h3>No hay productos en venta</h3>
          <p>No se encontraron productos con categoría "venta"</p>
          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '10px' }}>
            Crea un nuevo producto desde el panel de administración seleccionando "Producto en Venta"
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
                    : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
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
                  <span className="product-category">🛒 En Venta</span>
                  <span className="product-condition">{product.condicion}</span>
                </div>
                
                <div className="seller-info">
                  <p><strong>Vendedor:</strong> {product.vendedor}</p>
                  <p><strong>Contacto:</strong> {product.contacto}</p>
                  <p><strong>Carrera:</strong> {product.carrera}</p>
                  <p>
                    <strong>Estado:</strong> 
                    <span style={{ 
                      color: product.vendido ? '#EF4444' : '#10B981',
                      fontWeight: 'bold',
                      marginLeft: '5px'
                    }}>
                      {product.vendido ? 'Vendido' : 'Disponible'}
                    </span>
                  </p>
                </div>
                
                <button className="contact-button" disabled={product.vendido}>
                  {product.vendido ? 'Producto Vendido' : 'Contactar al Vendedor'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComprarPage;