/* installing DOTENV */
require('dotenv').config();

const express = require('express');

/* Path import for images */
const path = require('path');

/* Helmet import for secure HTTP headers */
const helmet = require('helmet');

/* Cors import for secure multi-origin requests */
const cors = require('cors');

/* import Rate-limit to limit requests */
const rateLimit = require('express-rate-limit');


const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');


const app = express();

const limiter = rateLimit({
    // 15 minutes
     windowMs: 15 * 60 * 1000,
     // Limit each IP to 100 requests per `window` (here, per 15 minutes)
     max: 100,
     // Return rate limit info in the `RateLimit-*` headers
     standardHeaders: true, 
     // Disable the `X-RateLimit-*` headers
     legacyHeaders: false, 
 });
 
 app.use(express.json());
 app.use(helmet());
 app.use(cors());
 app.use(limiter);
 app.use(express.urlencoded({ extended: true }));
 
 /* Prevent CORS Errors */
 app.use((req, res, next) => {
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
     res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
     next();
   });
 
 /* image management */
 app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);


module.exports = app;