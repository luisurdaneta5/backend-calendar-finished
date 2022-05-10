const { response } = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../models/Users");
const { generarJWT } = require("../helpers/jwt");
/**
 *
 *
 */
const crearUser = async (req, resp = response) => {
	const { email, password } = req.body;

	try {
		let user = await Users.findOne({ email });

		if (user) {
			return resp.status(400).json({
				ok: false,
				msg: "Un usuario existe con ese correo",
			});
		}

		user = new Users(req.body);

		//encriptar contrase;a
		const salt = bcrypt.genSaltSync();

		user.password = bcrypt.hashSync(password, salt);

		await user.save();

		//Generar token

		const token = await generarJWT(user.id, user.name);

		resp.status(201).json({
			ok: true,
			uid: user.id,
			name: user.name,
			token,
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: "Por Favor comunicarse con soporte",
		});
	}
};

const LoginUser = async (req, resp = response) => {
	const { email, password } = req.body;

	try {
		const users = await Users.findOne({ email });

		if (!users) {
			return resp.status(400).json({
				ok: false,
				msg: "El usuario no existe con ese correo",
			});
		}

		const validPassword = bcrypt.compareSync(password, users.password);

		if (!validPassword) {
			return resp.status(400).json({
				ok: false,
				msg: "Password Incorrecto",
			});
		}

		//Generacion de token
		const token = await generarJWT(users.id, users.name);

		resp.json({
			ok: true,
			uid: users.id,
			name: users.name,
			token,
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: "Por Favor comunicarse con soporte",
		});
	}
};

const RenewToken = async (req, resp) => {
	const uid = req.uid;
	const name = req.name;

	//generar token
	const token = await generarJWT(uid, name);

	resp.json({
		ok: true,
		uid,
		name,
		token,
	});
};

module.exports = {
	crearUser,
	LoginUser,
	RenewToken,
};
