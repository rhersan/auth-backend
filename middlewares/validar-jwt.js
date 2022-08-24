const { response } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    
    const token = req.header('x-token');

    // if(!token){
    //     return res.json({
    //         ok: false,
    //         msg: 'Renew',
    //         token
    //     });
    // }

    try {

        const {uid, name, email} =jwt.verify( token, process.env.SECRETE_JWT_SEED );
        req.uid = uid;
        req.name = name;
        req.email = email;

    }catch(error){
        return res.status(401).json({
            ok: false,
            msg: 'error en el token'
        });
    }
    


    // Todo OK
    next();

}



module.exports = {
    validarJWT
}