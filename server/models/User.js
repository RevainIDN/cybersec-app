const { Schema, model } = require('mongoose');

const User = new Schema({
	email: { type: String, unique: true, required: true },
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	role: { type: String, default: 'USER' }
})

module.exports = model('User', User)