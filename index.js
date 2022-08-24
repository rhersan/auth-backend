const express = require('express');
const cors = require('cors');
const path = require('path');
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

// Otras rutas
app.get('*', (req, resp) => {
    resp.sendFile( path.resolve(__dirname, 'public/index.html'));
});



app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
} );

