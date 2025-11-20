import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { articulosAPI } from '../../services/api';
import './AdminPage.css';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: 'venta', 
    condicion: 'nuevo',
    descripcion: '',
    contacto: '',
    carrera: '',
    semestre: '',
    vendedor: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setMessage('Error: Solo se permiten archivos JPG, PNG o WebP');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage(' Error: La imagen debe ser menor a 5MB');
        return;
      }

      setImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Validar campos requeridos
      const requiredFields = ['nombre', 'precio', 'descripcion', 'contacto', 'carrera', 'semestre', 'vendedor'];
      const emptyFields = requiredFields.filter(field => !formData[field].trim());
      
      if (emptyFields.length > 0) {
        setMessage(` Por favor completa todos los campos: ${emptyFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Validar precio
      const precioNumero = parseFloat(formData.precio);
      if (isNaN(precioNumero) || precioNumero < 0) {
        setMessage(' Por favor ingresa un precio válido');
        setLoading(false);
        return;
      }

      // Validar imagen
      if (!image) {
        setMessage(' Por favor selecciona una imagen del producto');
        setLoading(false);
        return;
      }

      console.log(' Enviando producto con categoría:', formData.categoria);

      // Preparar FormData
      const articuloFormData = new FormData();
      articuloFormData.append('nombre', formData.nombre.trim());
      articuloFormData.append('precio', precioNumero.toString());
      articuloFormData.append('categoria', formData.categoria);
      articuloFormData.append('condicion', formData.condicion);
      articuloFormData.append('descripcion', formData.descripcion.trim());
      articuloFormData.append('contacto', formData.contacto.trim());
      articuloFormData.append('carrera', formData.carrera.trim());
      articuloFormData.append('semestre', formData.semestre.trim());
      articuloFormData.append('vendedor', formData.vendedor.trim());
      articuloFormData.append('stock', '1');
      articuloFormData.append('imagen', image);

      // Enviar al backend
      const response = await articulosAPI.createArticulo(articuloFormData);
      
      console.log(' Respuesta del backend:', response.data);
      
      if (response.data.exito) {
        const categoriaTexto = formData.categoria === 'venta' ? '🛒 VENTA' : '💰 COMPRA';
        setMessage(`¡Producto creado exitosamente! Se mostrará en: ${categoriaTexto}`);
        
        // Limpiar formulario
        setFormData({
          nombre: '',
          precio: '',
          categoria: 'venta',
          condicion: 'nuevo',
          descripcion: '',
          contacto: '',
          carrera: '',
          semestre: '',
          vendedor: ''
        });
        setImage(null);
        setImagePreview('');
        
      } else {
        setMessage('Error: ' + (response.data.mensaje || 'No se pudo crear el producto'));
      }
    } catch (error) {
      console.error(' Error completo:', error);
      
      if (error.response) {
        console.error('Respuesta de error:', error.response.data);
        const errorMessage = error.response.data.mensaje || error.response.data.error || 'Error del servidor';
        setMessage(` Error del servidor: ${errorMessage}`);
      } else if (error.request) {
        console.error(' No se recibió respuesta');
        setMessage(' Error de conexión: No se pudo conectar con el servidor backend');
      } else {
        console.error(' Error de configuración:', error.message);
        setMessage(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <Navbar />

      <div className="admin-header">
        <h1 className="admin-title">
          Panel de <span className="admin-title-gradient">Administración</span>
        </h1>
        <p className="admin-subtitle">
          Agrega nuevos productos directamente a la base de datos
        </p>
      </div>

      <div className="admin-main-content">
        <div className="admin-form-container">
          <h2 className="admin-form-title">
            Agregar Nuevo Producto
          </h2>

          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="admin-form">
            {/* Fila 1: Nombre y Precio */}
            <div className="form-row-2-1">
              <div className="form-group">
                <label className="form-label">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Ej: Calculadora Casio FX-991ES"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Precio ($) *
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="450"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Fila 2: Categoria y Condición */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  Categoría *
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                  disabled={loading}
                >
                  <option value="venta"> Producto en Venta</option>
                  <option value="compra"> Busco Comprar</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Condición *
                </label>
                <select
                  name="condicion"
                  value={formData.condicion}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                  disabled={loading}
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="usado-excelente">Usado - Excelente</option>
                  <option value="usado-bueno">Usado - Bueno</option>
                  <option value="usado-regular">Usado - Regular</option>
                </select>
              </div>
            </div>

            {/* Fila 3: Nombre Vendedor */}
            <div className="form-group">
              <label className="form-label">
                Nombre del Vendedor *
              </label>
              <input
                type="text"
                name="vendedor"
                value={formData.vendedor}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Ej: Juan Pérez"
                disabled={loading}
              />
            </div>

            {/* Fila 4: Carrera y Semestre */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  Carrera *
                </label>
                <input
                  type="text"
                  name="carrera"
                  value={formData.carrera}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Ej: Sistemas Computacionales"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Semestre *
                </label>
                <input
                  type="text"
                  name="semestre"
                  value={formData.semestre}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Ej: 6to"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Fila 5: Contacto */}
            <div className="form-group">
              <label className="form-label">
                Contacto *
              </label>
              <input
                type="text"
                name="contacto"
                value={formData.contacto}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Ej: 5512345678 o @usuario"
                disabled={loading}
              />
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label className="form-label">
                Descripción del Producto *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
                rows="4"
                className="form-textarea"
                placeholder="Describe tu producto detalladamente..."
                disabled={loading}
              />
            </div>

            {/* Sección de imagen */}
            <div className="upload-section">
              <label className="form-label">
                Subir Foto del Producto *
              </label>
              <div 
                className={`upload-area ${imagePreview ? 'has-image' : ''} ${loading ? 'disabled' : ''}`}
                onClick={() => !loading && document.getElementById('imageInput').click()}
              >
                {imagePreview ? (
                  <div className="preview-container">
                    <img src={imagePreview} alt="Vista previa" className="image-preview" />
                    {!loading && (
                      <button 
                        type="button" 
                        className="remove-image"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        Eliminar imagen
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">📷</div>
                    <div className="upload-text">
                      {loading ? 'Cargando...' : 'Haz clic para subir una foto'}
                    </div>
                    <div className="upload-hint">Formatos: JPG, PNG, WebP (Máx. 5MB)</div>
                  </>
                )}
                <input 
                  id="imageInput"
                  type="file" 
                  className="file-input"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Botón de Envío */}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? '📤 Publicando...' : '🚀 Publicar Producto'}
            </button>
          </form>
        </div>
      </div>
    </div> 
  );
};

export default AdminPage;