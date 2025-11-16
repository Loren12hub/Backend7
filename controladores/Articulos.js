const fs = require('fs')
const path = require('path')
const { validarArticulo } = require('../helpers/Validar')
const Articulo = require("../modelos/Articulo");

// Función de prueba simple
const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Prueba exitosa",
        timestamp: new Date().toISOString()
    });
};

// Endpoint de información
const curso = (req, res) => {
    return res.status(200).json({
        mensaje: "Endpoint de cursos funcionando",
        status: "success",
        timestamp: new Date().toISOString()
    });
};

// Crear nuevo artículo
const crear = async (req, res) => {
    try {
        let parametros = req.body;

        // Validación rápida
        if (!parametros.titulo || !parametros.contenido) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            });
        }

        // Validar datos
        const validacion = validarArticulo(parametros);
        if (!validacion.success) {
            return res.status(400).json({
                status: "error",
                mensaje: validacion.message
            });
        }

        // Crear y guardar artículo
        const articulo = new Articulo(parametros);
        const articuloGuardado = await articulo.save();

        return res.status(201).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Artículo creado con éxito"
        });

    } catch (error) {
        console.error("Error al crear artículo:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "No se pudo guardar el artículo"
        });
    }
};

// Listar todos los artículos
const listar = async (req, res) => {
    try {
        const articulos = await Articulo.find({})
            .sort({ fecha: -1 })
            .limit(50)
            .exec();

        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontraron artículos"
            });
        }

        return res.status(200).json({
            status: "success",
            contador: articulos.length,
            articulos: articulos
        });

    } catch (error) {
        console.error("Error al obtener artículos:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al obtener artículos"
        });
    }
};

// Mostrar un artículo específico
const mostrarUno = async (req, res) => {
    try {
        let id = req.params.id;
        const articulo = await Articulo.findById(id);

        if (!articulo) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo: articulo
        });
    } catch (error) {
        console.error("Error al buscar artículo:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al buscar artículo"
        });
    }
};

// Borrar artículo
const borrar = async (req, res) => {
    try {
        let articulo_id = req.params.id;
        const articuloBorrado = await Articulo.findOneAndDelete({ _id: articulo_id });

        if (!articuloBorrado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo para borrar"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "Artículo borrado con éxito"
        });
    } catch (error) {
        console.error("Error al borrar artículo:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al borrar artículo"
        });
    }
};

// Editar artículo
const editar = async (req, res) => {
    try {
        let articulo_id = req.params.id;
        let parametros = req.body;
        
        // Validación correcta
        const validacion = validarArticulo(parametros);
        if (!validacion.success) {
            return res.status(400).json({
                status: "error",
                mensaje: validacion.message
            });
        }

        const articuloActualizado = await Articulo.findOneAndUpdate(
            { _id: articulo_id }, 
            parametros, 
            { new: true }
        );

        if (!articuloActualizado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo para actualizar"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado,
            mensaje: "Artículo actualizado con éxito"
        });
    } catch (error) {
        console.error("Error al editar artículo:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al editar artículo"
        });
    }
};
//subir imgen
const subirImagen = async (req, res) => {
    try {
        console.log("Iniciando subida de imagen...");

        // Verificar si el archivo se ha cargado correctamente
        if (!req.file) {
            console.log("No se recibió archivo");
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha proporcionado ningún archivo"
            });
        }

        console.log("Archivo recibido:", req.file.originalname);

        // Validar por MIME type
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            console.log("Tipo MIME no válido:", req.file.mimetype);
            
            // Borrar el archivo no válido
            if (fs.existsSync(req.file.path)) {
                fs.unlink(req.file.path, (error) => {
                    if (error) console.error("Error al borrar archivo:", error);
                });
            }
            
            return res.status(400).json({
                status: "error",
                mensaje: "Formato de imagen no válido. Use JPEG, PNG, GIF o WebP"
            });
        }

        // Recoger el ID del artículo
        const articulo_id = req.params.id;
        console.log("Buscando artículo ID:", articulo_id);

        // Buscar el artículo por su ID
        const articulo = await Articulo.findById(articulo_id);

        // Verificar si se encontró el artículo
        if (!articulo) {
            console.log("Artículo no encontrado");
            
            // Borrar imagen si el artículo no existe
            if (fs.existsSync(req.file.path)) {
                fs.unlink(req.file.path, (error) => {
                    if (error) console.error("Error al borrar archivo:", error);
                });
            }
            
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo"
            });
        }

        console.log("Artículo encontrado:", articulo.titulo);

        // LÍNEA CRÍTICA QUE FALTA: Asignar la nueva imagen al artículo
        articulo.imagen = req.file.filename;

        console.log(" Guardando artículo con nueva imagen...");
        
        // Guardar el artículo actualizado
        const articuloActualizado = await articulo.save();

        console.log(" Imagen subida correctamente:", req.file.filename);

        // Devolver respuesta con el artículo actualizado
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado,
            imagen: req.file.filename,
            mensaje: "Imagen subida correctamente"
        });

    } catch (error) {
        console.error(" Error al subir la imagen:", error);
        
        // En caso de error, borrar la imagen subida
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (error) => {
                if (error) console.error("Error al borrar archivo en catch:", error);
            });
        }
        
        return res.status(500).json({
            status: "error",
            mensaje: "Error al subir la imagen: " + error.message
        });
    }
};

// Mostrar imagen
const mostrarImagen = async (req, res) => {
    try {
        let fichero = req.params.fichero;
        let ruta_fisica = './img/articulos/' + fichero;

        fs.stat(ruta_fisica, (error, stats) => {
            if (error || !stats.isFile()) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se encontró la imagen"
                });
            }
            return res.sendFile(path.resolve(ruta_fisica));
        });
    } catch (error) {
        console.error("Error al mostrar imagen:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al mostrar imagen"
        });
    }
};

// Buscar artículos
const buscador = async (req, res) => {
    try {
        let busqueda = req.params.busqueda;
        const articulosEncontrados = await Articulo.find({
            "$or": [
                { "titulo": { "$regex": busqueda, "$options": "i" } },
                { "contenido": { "$regex": busqueda, "$options": "i" } },
            ]
        }).sort({ fecha: -1 }).exec();

        if (!articulosEncontrados || articulosEncontrados.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontraron artículos"
            });
        }

        return res.status(200).json({
            status: "success",
            articulos: articulosEncontrados,
            mensaje: "Artículos encontrados"
        });
    } catch (error) {
        console.error("Error al buscar artículos:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al buscar artículos"
        });
    }
};

// Exportar todas las funciones
module.exports = {
    prueba,
    curso,
    crear,
    listar,
    mostrarUno,
    borrar,
    editar,
    subirImagen,
    mostrarImagen,
    buscador
};