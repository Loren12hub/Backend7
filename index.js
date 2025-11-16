const { conexion } = require('./basedatos/conexion')
const express = require("express")
const cors = require("cors")

//Inicializar app
console.log("app de node arrancada")

//Conectar a la base de datos
conexion();

// Crear servidor Node
const app = express()
const puerto = process.env.PORT || 3900;

//Configurar cors
app.use(cors())

//Convertir body a objeto js
app.use(express.static('img'));
app.use(express.json()) // recibir datos con formato JSON
app.use(express.urlencoded({extended: true})) // convirtiendo formato encode a JSON

/*RUTAS*/ 
const rutas_articlo = require("./rutas/RutaArticulos")

//cargando rutas
app.use("/api", rutas_articlo)
/*FIN RUTAS*/

// rutas de prueba hardcodeadas
app.get("/probando", (req, res) => {
    console.log("Se ha ejecutado el endpoint probando ")
    return res.status(200).json([
        {
            curso: "INTERCAMBIA-TEC CORRECTO", 
        }
    ])
})

app.get("/", (req, res)=>{
    return res.send(`
        <h1>Empezando un api rest con node</h1>
    `)
})

//crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto " + puerto)
})