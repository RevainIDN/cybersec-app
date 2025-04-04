const { expandUrl } = require('../../services/leakCheck/urlDecoderService');
const UserActivity = require('../../models/UserActivity');

const getExpandedUrl = async (req, res) => {
	const { url } = req.query;
	const userId = req.user?.userId;

	if (!url) {
		return res.status(400).json({ message: 'Не указан URL для расширения.' });
	}

	try {
		const longUrl = await expandUrl(url);

		if (userId) {
			const activity = new UserActivity({
				userId,
				type: 'url_expansion',
				input: url,
				result: longUrl,
			});
			await activity.save();
		}

		return res.status(200).json({ shortUrl: url, longUrl });
	} catch (error) {
		return res.status(500).json({ message: 'Ошибка сервера при расширении URL.' });
	}
};

module.exports = { getExpandedUrl };