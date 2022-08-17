const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// crear servicod / aplicación de express
const app = express();


// Base de Datos
dbConnection();

// Directorio público
app.use( express.static('public') );

// CORS
app.use(cors());

// Lectura y parse de body
app.use( express.json())

// Rutas
app.use('/api/auth', require('./routes/auth') );


app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
} );

