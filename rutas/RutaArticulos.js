const fs = require('fs')
const path = require('path')
const { validarArticulo } = require('../helpers/Validar')
const Articulo = require("../modelos/Articulo");

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una acción de prueba en mi controlador"
    });
};

const curso = (req, res) => {
    console.log("Se ha ejecutado el endpoint probando ");
    return res.status(200).json([
        {
            curso: "Master en React",
            autor: "Manuel Hernandez Herrera",
            url: "manuelhernandezweb.com.mx/master-react-pro"
        },
        {
            curso: "Master en React Native",
            autor: "Manuel Hernandez Herrera",
            url: "manuelhernandezweb.com.mx/master-react-native"
        }
    ]);
};

const crear = async (req, res) => {
    try {
        let parametros = req.body;

        if (!parametros.titulo || !parametros.contenido) {
            return res.status(400).json({
                status: "Error",
                mensaje: "Faltan datos por enviar"
            });
        }

        // CORREGIDO - Manejo correcto de validación
        const validacion = validarArticulo(parametros);
        if (!validacion.success) {
            return res.status(400).json({
                status: "Error",
                mensaje: validacion.message
            });
        }

        const articulo = new Articulo(parametros);
        const articuloGuardado = await articulo.save();

        return res.status(201).json({  // ✅ Cambiado a 201 para creación
            status: "OK",
            articulo: articuloGuardado,
            mensaje: "Artículo creado con éxito"
        });
    } catch (error) {
        console.error("Error al guardar el artículo:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "No se pudo guardar el artículo"
        });
    }
};

//  CORREGIDO - Sin setTimeout
const listar = async (req, res) => {
    try {
        const articulos = await Articulo.find({}).sort({ fecha: -1 }).exec();
        
        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: "Error",
                mensaje: "No se encontraron artículos"
            });
        }

        return res.status(200).json({
            status: "OK",
            parametro: req.params.ultimos, 
            contador: articulos.length,
            articulos: articulos
        });
    } catch (error) {
        console.error("Error al obtener los artículos:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un problema al obtener los artículos"
        });
    }
};

const mostrarUno = async (req, res) => {
    try {
        let id = req.params.id;
        const articulo = await Articulo.findById(id);

        if (!articulo) {
            return res.status(404).json({
                status: "Error",
                mensaje: "No se ha encontrado el artículo"
            });
        }

        return res.status(200).json({
            status: "OK",
            articulo: articulo
        });
    } catch (error) {
        console.error("Error al buscar el artículo:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un error al buscar el artículo"
        });
    }
};

const borrar = async (req, res) => {
    try {
        let articulo_id = req.params.id;
        const articuloBorrado = await Articulo.findOneAndDelete({ _id: articulo_id });

        if (!articuloBorrado) {
            return res.status(404).json({
                status: "Error",
                mensaje: "No se encontró el artículo para borrar"
            });
        }

        return res.status(200).json({
            status: "OK",
            articulo: articuloBorrado,
            mensaje: "Artículo borrado con éxito"
        });
    } catch (error) {
        console.error("Error al borrar el artículo:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un error al borrar el artículo"
        });
    }
};

// ✅ CORREGIDO - Validación arreglada
const editar = async (req, res) => {
    try {
        let articulo_id = req.params.id;
        let parametros = req.body;
        
        // ✅ CORREGIDO - Validación correcta
        const validacion = validarArticulo(parametros);
        if (!validacion.success) {
            return res.status(400).json({
                status: "Error",
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
                status: "Error",
                mensaje: "No se encontró el artículo para actualizar"
            });
        }

        return res.status(200).json({
            status: "OK",
            articulo: articuloActualizado,
            mensaje: "Artículo actualizado con éxito"
        });
    } catch (error) {
        console.error("Error al editar el artículo:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un error al editar el artículo"
        });
    }
};

// ✅ MODIFICADO para Render
const subirImagen = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: "Error",
                mensaje: "Petición inválida: No se ha proporcionado ningún archivo"
            });
        }

        const nombreArchivo = req.file.originalname;
        const archivoSplit = nombreArchivo.split(".");
        const extension = archivoSplit[archivoSplit.length - 1];

        if (extension !== "png" && extension !== "jpg" && extension !== "jpeg" && extension !== "gif") {
            fs.unlink(req.file.path, (error) => {
                if (error) console.error("Error al borrar el archivo:", error);
            });
            return res.status(400).json({
                status: "Error",
                mensaje: "La extensión del archivo no es válida"
            });
        }

        const articulo_id = req.params.id;
        const articulo = await Articulo.findById(articulo_id);

        if (!articulo) {
            return res.status(404).json({
                status: "Error",
                mensaje: "No se encontró el artículo para actualizar"
            });
        }

        articulo.imagen = req.file.filename;
        const articuloActualizado = await articulo.save();

        return res.status(200).json({
            status: "OK",
            articulo: articuloActualizado,
            mensaje: "Artículo actualizado con éxito"
        });
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un problema al subir la imagen"
        });
    }
};

// ✅ CORREGIDO para Render
const mostrarImagen = (req, res) => {
    try {
        let fichero = req.params.fichero;
        let ruta_fisica = '/tmp/articulos/' + fichero;  // ✅ Cambiado para Render

        fs.stat(ruta_fisica, (error, stats) => {
            if (error || !stats.isFile()) {
                return res.status(404).json({
                    status: "Error",
                    mensaje: "No se encontró la imagen"
                });
            }
            return res.sendFile(path.resolve(ruta_fisica));
        });
    } catch (error) {
        console.error("Error al mostrar la imagen:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un problema al mostrar la imagen"
        });
    }
};

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
                status: "Error",
                mensaje: "No se encontraron artículos"
            });
        }

        return res.status(200).json({
            status: "OK",
            articulos: articulosEncontrados,
            mensaje: "Artículos encontrados"
        });
    } catch (error) {
        console.error("Error al buscar artículos:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un problema al buscar artículos"
        });
    }
};

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