/**
 *    Rutas de Usuarios / Auth
 *    host + /api/auth
 *
 */
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { crearUser, LoginUser, RenewToken } = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validar--jwt");

const routes = Router();

routes.post(
	"/new",
	[
		//middleware
		check("name", "El nombre es Obligatorio").not().isEmpty(),
		check("email", "El email es Obligatorio").isEmail(),
		check("password", "El password debe ser de 6 caracteres").isLength({
			min: 6,
		}),
		validarCampos,
	],
	crearUser
);

routes.post(
	"/",
	[
		//middlewares
		check("email", "El email es Obligatorio").isEmail(),
		check("password", "El password debe ser de 6 caracteres").isLength({
			min: 6,
		}),
		validarCampos,
	],
	LoginUser
);

routes.get("/renew", validarJWT, RenewToken);

module.exports = routes;
