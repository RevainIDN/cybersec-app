
const { expandUrl } = require('../../services/leakCheck/urlDecoderService');

const getExpandedUrl = async (req, res) => {
	const { shortUrl } = req.query;
	if (!shortUrl) {
		return res.status(400).json({ message: 'Не указан короткий URL.' });
	}

	try {
		const expandedUrl = await expandUrl(shortUrl);
		return res.status(200).json({ expandedUrl });
	} catch (error) {
		return res.status(500).json({ message: 'Ошибка при расширении URL.' });
	}
};

module.exports = { getExpandedUrl };