// En la función subirImagen, cambia esta parte:
const subirImagen = async (req, res) => {
    try {
        console.log('=== INICIANDO SUBIDA DE IMAGEN ===');
        console.log('ID recibido:', req.params.id);
        console.log('Archivo recibido:', req.file ? 'SÍ' : 'NO');

        if (!req.file) {
            console.log('No se recibió archivo');
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha proporcionado ningún archivo"
            });
        }

        console.log(' Archivo subido:', {
            nombre: req.file.filename,
            original: req.file.originalname,
            tamaño: req.file.size,
            ruta: req.file.path
        });

        const articulo_id = req.params.id;
        const articulo = await Articulo.findById(articulo_id);

        if (!articulo) {
            // Limpiar archivo subido si el artículo no existe
            fs.unlink(req.file.path, (error) => {
                if (error) console.error("Error al borrar archivo:", error);
            });
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo"
            });
        }

        // CORREGIDO: Usar img/articulos/ en lugar de /tmp/articulos/
        if (articulo.imagen) {
            const rutaAnterior = path.join('img/articulos/', articulo.imagen);
            if (fs.existsSync(rutaAnterior)) {
                fs.unlinkSync(rutaAnterior);
                console.log('🗑️ Imagen anterior eliminada:', rutaAnterior);
            }
        }

        // Actualizar el artículo con la nueva imagen
        articulo.imagen = req.file.filename;
        const articuloActualizado = await articulo.save();

        console.log('Imagen actualizada para artículo:', articulo_id);

        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado,
            archivo: {
                nombre: req.file.filename,
                ruta: `/api/imagen/${req.file.filename}`,
                tamaño: req.file.size
            },
            mensaje: "Imagen subida correctamente"
        });

    } catch (error) {
        console.error(" Error al subir la imagen:", error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor al subir imagen",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// CORREGIDO: En la función mostrarImagen
const mostrarImagen = (req, res) => {
    try {
        let fichero = req.params.fichero;
        let ruta_fisica = path.join('img/articulos/', fichero);  // ← CAMBIADO

        console.log('🔍 Buscando imagen en:', ruta_fisica);

        fs.stat(ruta_fisica, (error, stats) => {
            if (error || !stats.isFile()) {
                console.log(' Imagen no encontrada:', ruta_fisica);
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se encontró la imagen"
                });
            }

            console.log('Imagen encontrada, enviando...');
            return res.sendFile(path.resolve(ruta_fisica));  // ← Usar path.resolve
        });
    } catch (error) {
        console.error("Error al mostrar imagen:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al mostrar imagen"
        });
    }
};