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
    return res.status(200).json({
        mensaje: "Endpoint de cursos funcionando",
        status: "success"
    });
};

const crear = async (req, res) => {
    // ... tu código de crear
};

const listar = async (req, res) => {
    // ... tu código de listar
};

const mostrarUno = async (req, res) => {
    // ... tu código de mostrarUno
};

const borrar = async (req, res) => {
    // ... tu código de borrar
};

const editar = async (req, res) => {
    // ... tu código de editar
};

const subirImagen = async (req, res) => {
    // ... tu código de subirImagen
};

const mostrarImagen = async (req, res) => {
    // ... tu código de mostrarImagen
};

const buscador = async (req, res) => {
    // ... tu código de buscador
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