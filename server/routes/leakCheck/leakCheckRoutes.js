const express = require('express');
const router = express.Router();
const { getLeakCheckReport } = require('../../controllers/leakCheck/leakCheckController');
const authMiddleware = require('../../middlewares/authorization/authMiddleware');

router.get('/check', authMiddleware, getLeakCheckReport);

module.exports = router;