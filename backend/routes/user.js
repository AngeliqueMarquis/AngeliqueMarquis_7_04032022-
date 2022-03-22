/* import express */
const express = require('express');


/* create router */
const router = express.Router();

/* import middleware */
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/* controller import */
const userCtrl = require('../controllers/user');

/* save routes in the router */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id', userCtrl.getOneUser);
router.put('/:id', auth, multer, userCtrl.modifyUser);
router.delete('/:id', auth, userCtrl.deleteUser);


module.exports = router;