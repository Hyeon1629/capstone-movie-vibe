const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth');
const userCtrl   = require('../controllers/userController');

router.post('/register', userCtrl.register);
router.post('/login',    userCtrl.login);
router.get('/auth',      auth, userCtrl.auth);
router.get('/logout',    auth, userCtrl.logout);

module.exports = router;
