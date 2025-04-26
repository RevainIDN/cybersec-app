const express = require('express');
const router = express.Router();
const passwordManagerController = require('../../controllers/passwordManager/passwordManagerController');
const authMiddleware = require('../../middlewares/authorization/authMiddleware');

router.post('/', authMiddleware, passwordManagerController.createPassword);
router.get('/', authMiddleware, passwordManagerController.getPasswords);
router.delete('/:id', authMiddleware, passwordManagerController.deletePassword);

module.exports = router;