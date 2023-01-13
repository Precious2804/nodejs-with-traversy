const express = require('express');
const { register, login, get_logged_user } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register)

router.post('/login', login)

router.get('/user-profile', get_logged_user)

module.exports = router