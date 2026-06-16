const express     = require('express');
const router      = express.Router();
const auth        = require('../middleware/auth');
const commentCtrl = require('../controllers/commentController');

router.post('/save',         auth, commentCtrl.saveComment);
router.get('/list',               commentCtrl.getComments);   // 비로그인 허용
router.delete('/delete',    auth, commentCtrl.deleteComment);

module.exports = router;
