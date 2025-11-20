import './Navbar.css';
import { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems] = useState([]); // Aquí conectarías con tu estado global del carrito

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <a href="/" className="navbar-logo">
          INTERCAMBIA-TEC
        </a>
        
        <div className="navbar-right">
          {/* Icono del Carrito */}
          <div className="cart-dropdown">
            <button className="cart-toggle" onClick={toggleCart}>
              🛒
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </button>
            
            {/* Dropdown del Carrito */}
            <div className={`cart-dropdown-content ${isCartOpen ? 'active' : ''}`}>
              <div className="cart-header">
                <h3>Tu Carrito</h3>
              </div>
              
              <div className="cart-items">
                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <p>No hay productos en el carrito</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>${item.price}</p>
                      </div>
                      <button className="remove-item">×</button>
                    </div>
                  ))
                )}
              </div>
              
              {cartItems.length > 0 && (
                <div className="cart-footer">
                  <div className="cart-total">
                    <strong>Total: ${cartItems.reduce((sum, item) => sum + item.price, 0)}</strong>
                  </div>
                  <button className="checkout-btn">Finalizar Compra</button>
                </div>
              )}
            </div>
          </div>

          {/* Menú Desplegable */}
          <div className="menu-dropdown">
            <button className="menu-toggle" onClick={toggleMenu}>
              ☰
            </button>
            
            <div className={`menu-dropdown-content ${isMenuOpen ? 'active' : ''}`}>
              <a href="/" className="menu-link">Inicio</a>
              <a href="/comprar" className="menu-link">Comprar</a>
              <a href="/vender" className="menu-link">Vender</a>
              <a href="/admin" className="menu-link">Admin</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;