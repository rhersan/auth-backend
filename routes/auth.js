const {Router} = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, revalidarToken } = require('../controllers/auth');
const { validarCapos } = require('../middlewares/validar-campo');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


// Crear un nuevo usuario
router.post( '/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatorio').isLength({min:6}),
    validarCapos
], crearUsuario);

//  Login de usuario
router.post( '/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatorio').isLength({min:6}),
    validarCapos
], login);


// Calidar y revalidar token
router.get( '/renew',validarJWT, revalidarToken );


module.exports = router;