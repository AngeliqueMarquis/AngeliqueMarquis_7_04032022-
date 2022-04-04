/* bcrypt import */
const bcrypt = require('bcrypt');

/* jsonwebtoken import */
const jwt = require('jsonwebtoken');

const passwordValidator = require('password-validator');

/* model import */
const db = require('../models');

/* create a validation schema */
const schema = new passwordValidator();
schema
  .is().min(6)
  .is().max(50)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)

/* user registration */
exports.signup = (req, res, next) => {
  if (!schema.validate(req.body.password)){
    return res.status(401).json({message: 'Le mot de passe doit contenir au moins un chiffre, une minuscule et une majuscule'});
};

  /* password hash */
  bcrypt.hash(req.body.password, 10)
          .then(hash => {
            db.User.create ({
              firstname: req.body.firstname, 
              lastname: req.body.lastname, 
              email: req.body.email,
              password: hash,
          })
            .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
            .catch(error => res.status(400).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));     
};

/* user login */
exports.login = (req, res, next) => {
  db.User.findOne({ where : {email: req.body.email} })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé' });
        } 
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect' });
            }
            res.status(200).json({
              userId: user.id,
              token: jwt.sign(
                { userId: user.id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' })
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};


exports.getOneUser = (req, res, next) => {
  db.User.findOne({ where: {id: req.params.id} })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
};

/* modify user */
exports.modifyUser = (req, res, next) => {
  if (req.file) {
    const image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    db.User.update({ image: image }, { where: { id: req.params.id } });
  }
  db.User.update(
    { lastname: req.body.lastname, firstname: req.body.firstname },
    { where: { id: req.params.id } }
  )
    .then(() => res.status(200).json({ message: 'Profil modifié'}))
    .catch((err) => res.status(400).json({ err }));
};
  
/* delete user */
exports.deleteUser = async (req, res, next) => {
  db.User.findOne ({ where: { id: req.params.id } })
    .then((user) => {
         db.Post.destroy( { where: { id: req.params.id } })
         db.Comment.destroy( { where: { id: req.params.id } })
         db.User.destroy( { where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: 'Compte supprimé' }))
        .catch(error => res.status(400).json({ error }));
      })
    .catch (error => res.status(500).json({ error }));
};