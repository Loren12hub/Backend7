import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { testBackendConnection } from './services/testConnection';
import './App.css';

// Importar páginas
import HomePage from './pages/HomePage/HomePage';
import ComprarPage from './pages/ComprarPage/ComprarPage';
import VenderPage from './pages/VenderPage/VenderPage';
import AdminPage from './pages/AdminPage/AdminPage';

function App() {
  const [backendStatus, setBackendStatus] = useState('probando...');

  useEffect(() => {
    const checkBackend = async () => {
      console.log('🔄 Iniciando prueba de conexión...');
      const isConnected = await testBackendConnection();
      setBackendStatus(isConnected ? 'conectado ✅' : 'error ❌');
    };

    checkBackend();
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Banner de estado del backend */}
        <div style={{
          padding: '10px',
          backgroundColor: backendStatus.includes('✅') ? '#d4edda' : '#f8d7da',
          color: backendStatus.includes('✅') ? '#155724' : '#721c24',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          borderBottom: '1px solid #ccc'
        }}>
          Estado del Backend: {backendStatus}
        </div>
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comprar" element={<ComprarPage />} />
          <Route path="/vender" element={<VenderPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;