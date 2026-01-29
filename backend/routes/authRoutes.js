const expres = require('express');
const router = expres.Router();

const { registerUser, loginUser } = require('../controllers/authController');

// Register route
router.post('/register', registerUser);

module.exports = router;
