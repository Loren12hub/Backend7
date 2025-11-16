const mongoose = require('mongoose');


const conexion =  async()=>{

    try{
       await mongoose.connect("mongodb+srv://IntercambiaTec:intercambia123@basededatos.cxq4s4f.mongodb.net/?appName=BaseDeDatos")

       console.log("Conectado a la base de datos");
    }catch(error)
    {
        console.log(error);
        throw new Error("No se puede conectar a la  base de datos")

    }

}

module.exports = {
    conexion
}