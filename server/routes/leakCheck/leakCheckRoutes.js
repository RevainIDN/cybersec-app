const express = require('express');
const router = express.Router();
const { getLeakCheckReport } = require('../../controllers/leakCheck/leakCheckController');

router.get('/check', getLeakCheckReport);

module.exports = router;