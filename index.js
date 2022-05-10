const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require("cors");

require("dotenv").config();

//Crear servidor Express

const app = express();

//Conexion Base de datos
dbConnection();

//Cors
app.use(cors());

//Directorio publico use = middleware
app.use(express.static("public"));

//Lectura y Parseo del body
app.use(express.json());

//Rutas

//Auth
app.use("/api/auth", require("./routes/auth"));

//Events
app.use("/api/events", require("./routes/events"));

//Escuchar peticiones
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
