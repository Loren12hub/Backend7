import { testAPI, articulosAPI } from './api';

export const testBackendConnection = async () => {
  try {
    console.log('🔍 Probando conexión con backend...');
    
    // Test 1: Conexión básica
    console.log('1. Probando ruta básica /api...');
    const testResponse = await testAPI.testConnection();
    console.log('✅ Backend respondió:', testResponse.data);
    
    // Test 2: Obtener artículos
    console.log('2. Probando obtener artículos...');
    const articulosResponse = await articulosAPI.getArticulos();
    console.log('✅ Artículos obtenidos:', articulosResponse.data);
    
    // Test 3: Obtener categorías
    console.log('3. Probando obtener categorías...');
    const categoriasResponse = await articulosAPI.getCategorias();
    console.log('✅ Categorías obtenidas:', categoriasResponse.data);
    
    console.log('🎉 ¡Todas las pruebas pasaron! Backend conectado correctamente.');
    return true;
    
  } catch (error) {
    console.error('❌ Error conectando con backend:');
    
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      console.error('   - No se puede conectar al backend en http://localhost:5000');
      console.error('   - Verifica que el backend esté ejecutándose');
    } else if (error.response) {
      console.error('   - Error del servidor:', error.response.status);
      console.error('   - Mensaje:', error.response.data);
    } else if (error.request) {
      console.error('   - No se recibió respuesta del backend');
    } else {
      console.error('   - Error:', error.message);
    }
    
    return false;
  }
};