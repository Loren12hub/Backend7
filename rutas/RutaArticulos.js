const express = require("express");
const router = express.Router();
const ArticuloController = require("../controladores/Articulos");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// CONFIGURACIÓN PARA img/articulos/
const almacenamiento = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'img/articulos/';  // ← CAMBIADO A img/articulos/

        console.log('Configurando directorio para imágenes...');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log('Directorio creado en img/articulos/');
        }

        console.log('Ruta definitiva:', uploadPath);
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        const uniqueName = 'img-' + Date.now() + path.extname(file.originalname);
        console.log(' Archivo será:', uniqueName);
        cb(null, uniqueName);
    }
});

const subidas = multer({
    storage: almacenamiento,
    fileFilter: function (req, file, cb) {
        console.log('Validando archivo:', file.mimetype);
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

// Las rutas se mantienen igual...
router.get("/ruta-de-pruebas", ArticuloController.prueba);
router.get("/curso", ArticuloController.curso);
router.post("/crear", ArticuloController.crear);
router.get("/articulos/:ultimos?", ArticuloController.listar);
router.get("/articulo/:id", ArticuloController.mostrarUno);
router.delete("/articulo/:id", ArticuloController.borrar);
router.put("/articulo/:id", ArticuloController.editar);
router.post("/subir-imagen/:id", subidas.single("archivo0"), ArticuloController.subirImagen);
router.get("/imagen/:fichero", ArticuloController.mostrarImagen);
router.get("/buscar/:busqueda", ArticuloController.buscador);

module.exports = router;