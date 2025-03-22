const express = require('express');
const router = express.Router();
const { getExpandedUrl } = require('../../controllers/leakCheck/urlDecoderController');

router.get('/expand', getExpandedUrl);

module.exports = router;