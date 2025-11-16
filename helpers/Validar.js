const validator = require("validator");

/* Método para validar los datos de un artículo */
const validarArticulo = (parametros) => {
    // Verificar si parametros.titulo y parametros.contenido están definidos y son cadenas de texto
    if (typeof parametros.titulo !== 'string' || typeof parametros.contenido !== 'string') {
        return { success: false, message: "Los datos del artículo son inválidos" };
    }

    // Eliminar espacios en blanco al principio y al final de las cadenas
    parametros.titulo = validator.trim(parametros.titulo);
    parametros.contenido = validator.trim(parametros.contenido);

    // Verificar si los campos no están vacíos después de eliminar los espacios en blanco
    if (validator.isEmpty(parametros.titulo) || validator.isEmpty(parametros.contenido)) {
        return { success: false, message: "Faltan datos por enviar" };
    }

    // Si pasa todas las validaciones, retorna éxito y ningún mensaje de error
    return { success: true };
};

module.exports = {
    validarArticulo
};
