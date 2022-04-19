/* import express */
const express = require('express');

/* create router */
const router = express.Router();

/* import middleware */
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/* controller import */
const postCtrl = require('../controllers/post');
const likeCtrl = require('../controllers/like');

/* save routes in the router */
router.post('/', auth, multer, postCtrl.createPost); 
router.delete('/:id', auth, postCtrl.deletePost);
router.get('/', auth, postCtrl.getAllPost);
router.get('/:id', auth, postCtrl.getOnePost);

router.post('/:postId/like', auth, likeCtrl.likePost);
router.get('/:postId/like', auth, likeCtrl.getAllLike);


module.exports = router;
