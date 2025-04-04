const express = require('express');
const authController = require('../../controllers/authorization/authController');
const authMiddleware = require('../../middlewares/authorization/authMiddleware');
const router = express.Router();

router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.get('/users', authMiddleware, authController.getUsers);
router.get('/activity', authMiddleware, authController.getUserActivity);

module.exports = router;