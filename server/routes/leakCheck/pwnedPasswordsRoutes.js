const express = require('express');
const router = express.Router();
const { getPwnedPasswordsReport } = require('../../controllers/leakCheck/pwnedPasswordsController');
const authMiddleware = require('../../middlewares/authorization/authMiddleware');

router.get('/check', authMiddleware, getPwnedPasswordsReport);

module.exports = router;