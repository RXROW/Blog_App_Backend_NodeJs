const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Import controllers
const authControllers = require('../controllers/authControllers');

// Define routes
router.post('/register', authControllers.registerUserCtrl);
router.post('/login', authControllers.loginUserCtrl);
 

module.exports = router;
