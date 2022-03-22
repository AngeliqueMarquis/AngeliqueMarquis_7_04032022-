/* import express */
const express = require('express');

/* create router */
const router = express.Router();

/* import middleware */
const auth = require('../middleware/auth');

/* controller import */
const commentCtrl = require('../controllers/comment');

/* save routes in the router */
router.post('/', commentCtrl.createComment); 
router.delete('/:id', auth, commentCtrl.deleteComment);
router.get('/', auth, commentCtrl.getAllComment);
router.get('/:postId', auth, commentCtrl.getAllCommentsOfOnePost);


module.exports = router;