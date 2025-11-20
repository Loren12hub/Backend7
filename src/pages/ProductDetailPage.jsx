import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();

  // Datos de prueba por ahora
  const product = {
    _id: id,
    title: 'Calculadora Casio FX-991ES',
    description: 'Calculadora científica casi nueva, perfecta para ingeniería. Incluye funda y manual.',
    price: 450,
    condition: 'usado-excelente',
    category: 'electronica',
    faculty: 'Ingeniería',
    seller: { name: 'Ana García', faculty: 'Ingeniería' },
    images: ['https://via.placeholder.com/600x400']
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Imagen */}
          <div>
            <img 
              src={product.images[0]} 
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Información */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-4xl font-bold text-green-600 mb-6">${product.price}</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <span className="font-semibold">Condición:</span>
                <span className="ml-2 capitalize bg-gray-100 px-3 py-1 rounded">
                  {product.condition}
                </span>
              </div>
              
              <div>
                <span className="font-semibold">Categoría:</span>
                <span className="ml-2 capitalize">{product.category}</span>
              </div>
              
              <div>
                <span className="font-semibold">Facultad:</span>
                <span className="ml-2">{product.faculty}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Descripción:</h3>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>

            {/* Información del Vendedor */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">Publicado por:</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {product.seller.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{product.seller.name}</p>
                  <p className="text-sm text-gray-600">{product.seller.faculty}</p>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="mt-6 space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
                Contactar al Vendedor
              </button>
              <button className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 font-semibold">
                Guardar en Fav
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;