/*
    Event Routes
    /api/events

*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar--jwt");
const { isDate } = require("../helpers/isDate");
const { validarCampos } = require("../middlewares/validar-campos");
const {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
} = require("../controllers/events");

const routes = Router();

routes.use(validarJWT);
//Obtener Eventos
routes.get("/", getEvents);

//Crear Eventos
routes.post(
	"/",
	[
		check("title", "El titulo es requerido").not().isEmpty(),
		check("start", "La Fecha de inicio es requerida").custom(isDate),
		check("end", "La Fecha final es requerida").custom(isDate),
		validarCampos,
	],
	createEvent
);

//Actualizar Eventos
routes.put("/:id", updateEvent);

//Borrar Eveneto
routes.delete("/:id", deleteEvent);

module.exports = routes;
