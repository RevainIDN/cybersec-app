const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	site: { type: String, required: true }, // Зашифрованное на клиенте
	login: { type: String, required: true }, // Зашифрованное на клиенте
	encryptedPassword: { type: String, required: true }, // Зашифрованное на клиенте
	strength: { type: String, enum: ['weak', 'medium', 'strong'], required: true },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Password', PasswordSchema);