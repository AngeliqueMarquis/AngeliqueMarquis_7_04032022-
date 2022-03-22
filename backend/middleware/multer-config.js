/* import Multer */
const multer = require('multer');

/* extension to translate */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

/* configuration of MULTER for image file modification */
const storage = multer.diskStorage({

  /* destination in images folder */
    destination: (req, file, callback) => {
      callback(null, 'images');
    },

    /* New image name */
    filename: (req, file, callback) => {
      const name = file.originalname.replace(/\.[^/.]+$/, '')
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
    }
});
 
/* multer export */
module.exports = multer({ storage }).single('image');