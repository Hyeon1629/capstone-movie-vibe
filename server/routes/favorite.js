const express      = require('express');
const router       = express.Router();
const auth         = require('../middleware/auth');
const favoriteCtrl = require('../controllers/favoriteController');

router.post('/add',       auth, favoriteCtrl.addFavorite);
router.delete('/remove',  auth, favoriteCtrl.removeFavorite);
router.get('/list',       auth, favoriteCtrl.getFavoritedMovie);

module.exports = router;
