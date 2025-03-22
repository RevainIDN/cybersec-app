const express = require('express');
const router = express.Router();
const { getPwnedPasswordsReport } = require('../../controllers/leakCheck/pwnedPasswordsController');

router.get('/check', getPwnedPasswordsReport);

module.exports = router;