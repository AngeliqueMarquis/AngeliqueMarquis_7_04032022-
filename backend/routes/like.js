const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const likeCtrl = require('../controllers/like');

router.get('/post/:id/like', auth, likeCtrl.getPostLikes);
router.post('/post/:id/like', auth, likeCtrl.createLike);
router.delete('/post/:id/like', auth, likeCtrl.deleteLike);

module.exports = router;