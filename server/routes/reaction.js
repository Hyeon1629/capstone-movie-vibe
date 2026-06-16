const express      = require('express');
const router       = express.Router();
const auth         = require('../middleware/auth');
const reactionCtrl = require('../controllers/reactionController');

router.post('/toggle', auth, reactionCtrl.toggleReaction);
router.get('/count',        reactionCtrl.getReactionCount); // 비로그인 허용

module.exports = router;
