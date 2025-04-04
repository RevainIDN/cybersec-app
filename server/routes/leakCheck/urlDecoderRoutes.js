const express = require('express');
const router = express.Router();
const { getExpandedUrl } = require('../../controllers/leakCheck/urlDecoderController');
const authMiddleware = require('../../middlewares/authorization/authMiddleware');

router.get('/expand', authMiddleware, getExpandedUrl);

module.exports = router;