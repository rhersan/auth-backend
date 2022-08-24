const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { db } = require('../models/Usuario');

// Crear Usuario
const crearUsuario = async (req, res = response) => {

    const { name, email, password } = req.body;


    try{


    
    // Verificar email
    const usuario = await Usuario.findOne({ email: email});

    if(usuario){
        return res.status(400).json({
            ok: false,
            msg: 'El usuario ya existe con ese email'
        });
    }

    // Crear usuario con el modelo
    const dbUser = new Usuario(req.body);


    // Hashear contraseña
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync( password, salt );

    // Generar el  JWT
     const token = await generarJWT( dbUser.id, dbUser.name, dbUser.email );
    
     // Crear usuario de DB
    await dbUser.save();

    // Generar respuesta
    return res.status(200).json({
        ok: true,
        uid: dbUser.id,
        name,
        email,
        token
    });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador'
        });
    }
}

// Login
const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const dbUser = await Usuario.findOne( {email: email});

        if(!dbUser){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            }); 
        }

        // Confirmar si el password hace match
        const validPassword =  bcrypt.compareSync(password, dbUser.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válido'
            }); 
        }

        // Generar el JWT
        const token = await generarJWT(dbUser.id, dbUser.name, dbUser.email );
        

        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });


    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador'
        });
    }
}

// Validar y renovar token
const revalidarToken = async (req, res =  response) => {
    const { uid } = req;
    const dbUser = await Usuario.findById(uid);

    const token = await generarJWT(uid, dbUser.name, dbUser.email);
    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
}

module.exports = {
    crearUsuario,
    login,
    revalidarToken
}