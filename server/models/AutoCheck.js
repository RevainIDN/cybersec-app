const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutoCheckSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	type: { type: String, enum: ['analysis', 'leak'], required: true },
	subType: { type: String, enum: ['ip', 'url', 'domain', 'file', 'email', 'password'], required: true },
	input: { type: String, required: true },
	checkOnLogin: { type: Boolean, default: true },
	lastResult: { type: String, default: null },
	lastChecked: { type: Date, default: null },
});

module.exports = mongoose.model('AutoCheck', AutoCheckSchema);