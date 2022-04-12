/* import model */
const db = require('../models');
const fs = require('fs');

/* create post */
exports.createPost = async (req, res, next) => {
  if (req.file) {
    const imagePost = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    await db.Post.create({
        userId: req.body.userId,
        content: req.body.content,
        image: imagePost,
    });
  } else {
    await db.Post.create({
      userId: req.body.userId,
      content: req.body.content,
    })
  }
  try {
      res.status(201).json({ message: 'Publication créée'});
  } catch {
      (error => res.status(400).json({ error }));
  }
};

/* delete post */
exports.deletePost = async (req, res, next) => {
  db.Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (post.image) {
        const filename = post.image.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          db.Post.destroy({ where: { id: req.params.id} });
        });
      } else {
         db.Post.destroy({ where: { id: req.params.id} });
      }
    })
    .then(() => res.status(200).json({ message: 'Publication supprimée' }))
    .catch((error) => res.status(400).json({ error }));
};

/* get all the post */         
exports.getAllPost = (req, res, next) => {
    db.Post.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        include: [
          { model: db.User }
        ]  
    })
      .then((post) => res.status(200).json({ post}))
      .catch((error) => res.status(400).json({ error }));
};

/* get a post */
exports.getOnePost = (req, res, next) => {
  db.Post.findOne({ where: { id: req.params.id } })
  .then((post) => res.status(200).json(post))
  .catch((error) => res.status(404).json({ error}))
};

