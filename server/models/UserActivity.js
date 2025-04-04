const { Schema, model } = require('mongoose');

const UserActivitySchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	type: { type: String, required: true },
	input: { type: String, required: true },
	result: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

module.exports = model('UserActivity', UserActivitySchema);