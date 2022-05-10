const { response } = require("express");
const Event = require("../models/Events");

const getEvents = async (req, resp = response) => {
	const events = await Event.find().populate("user", "name");
	resp.json({
		ok: true,
		events,
	});
};

const createEvent = async (req, resp = response) => {
	const event = new Event(req.body);

	try {
		event.user = req.uid;
		const eventSaved = await event.save();

		resp.json({
			ok: true,
			event: eventSaved,
		});
	} catch (error) {
		console.log(error);
		return resp.status(500).json({
			ok: false,
			mgs: "Comuniquese con Soporte",
		});
	}
};

const updateEvent = async (req, resp = response) => {
	const eventId = req.params.id;
	const uid = req.uid;
	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return resp.status(404).json({
				ok: false,
				msg: "El evento buscando no existe",
			});
		}

		if (event.user.toString() !== uid) {
			return resp.status(401).json({
				ok: false,
				msg: "Usted no tiene permiso para editar este evento",
			});
		}

		const eventNew = {
			...req.body,
			user: uid,
		};

		const eventUpdate = await Event.findByIdAndUpdate(eventId, eventNew, {
			new: true,
		});

		resp.json({
			ok: true,
			event: eventUpdate,
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: "Comunicarse con soporte",
		});
	}

	resp.json({
		ok: true,
		msg: "updateEvent",
	});
};

const deleteEvent = async (req, resp = response) => {
	const eventId = req.params.id;
	const uid = req.uid;
	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return resp.status(404).json({
				ok: false,
				msg: "El evento buscando no existe",
			});
		}

		if (event.user.toString() !== uid) {
			return resp.status(401).json({
				ok: false,
				msg: "Usted no tiene permiso para eliminar este evento",
			});
		}

		await Event.findByIdAndDelete(eventId);

		resp.json({
			ok: true,
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: "Comunicarse con soporte",
		});
	}
};

module.exports = {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
};
