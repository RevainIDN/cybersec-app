const express = require('express');
const authController = require('../../controllers/authorization/authController');
const authMiddleware = require('../../middlewares/authorization/authMiddleware');
const router = express.Router();

router.post('/registration', authController.registration);
router.post('/login', authController.login);

router.get('/users', authMiddleware, authController.getUsers);
router.get('/activity', authMiddleware, authController.getUserActivity);
router.delete('/activity', authMiddleware, authController.deleteAllUserActivities);
router.get('/me', authMiddleware, authController.getUser);

router.post('/autocheck', authMiddleware, authController.createAutoCheck);
router.get('/autochecks', authMiddleware, authController.getAutoChecks);
router.post('/autochecks/run', authMiddleware, authController.runAutoChecks);
router.post('/autochecks/run/:id', authMiddleware, authController.runSingleAutoCheck);
router.delete('/autocheck/:id', authMiddleware, authController.deleteAutoCheck);

module.exports = router;