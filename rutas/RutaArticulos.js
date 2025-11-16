const express = require("express");
const router = express.Router();
const ArticuloController = require("../controladores/Articulos");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// CONFIGURACIÓN CORRECTA PARA RENDER.COM
const almacenamiento = multer.diskStorage({
    destination: function (req, file, cb) {
        //  USAR /tmp/ EN RENDER - SIEMPRE FUNCIONA
        const uploadPath = '/tmp/articulos/';
        
        console.log('Configurando directorio para Render...');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log(' Directorio creado en /tmp/');
        }
        
        console.log('Ruta definitiva:', uploadPath);
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        
        const uniqueName = 'img-' + Date.now() + path.extname(file.originalname);
        console.log('💾Archivo será:', uniqueName);
        cb(null, uniqueName);
    }
});

const subidas = multer({ 
    storage: almacenamiento,
    fileFilter: function (req, file, cb) {
        console.log('🔍 Validando archivo:', file.mimetype);
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Rutas
router.get("/ruta-de-pruebas", ArticuloController.prueba);
router.get("/curso", ArticuloController.curso);
router.post("/crear", ArticuloController.crear);
router.get("/articulos/:ultimos?", ArticuloController.listar);
router.get("/articulo/:id", ArticuloController.mostrarUno);
router.delete("/articulo/:id", ArticuloController.borrar);
router.put("/articulo/:id", ArticuloController.editar);

// ✅ Ruta para subir la imagen (CON CONFIGURACIÓN CORRECTA)
router.post("/subir-imagen/:id", subidas.single("archivo0"), ArticuloController.subirImagen);

// Ruta para mostrar imagen 
router.get("/imagen/:fichero", ArticuloController.mostrarImagen);
router.get("/buscar/:busqueda", ArticuloController.buscador);

module.exports = router;