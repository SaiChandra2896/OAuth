const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//const passport = require('passport');
const jwt = require('jsonwebtoken');

const keys = require('../../config/keys');

//get validation files
const validateRegisterInput = require('../../validation/register');

//get model
const User = require('../../models/User');

router.post('/register', (req, res) => {

  //get errors object
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ error: 'User exists' });
    }
    else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        //console.log(salt);
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser.save().then(user => res.json(user)).catch(err => console.log(err));
        });
      });
    }
  });
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user using email
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.json({ error: 'User not found please sign up' });
    }
    bcrypt.compare(password, user.password).then((passwordmatched) => {
      if (passwordmatched) {
        const payload = { id: user.id, name: user.name };//creating payload for jwt
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        })
      }
      else {
        return res.status(400).json({ password: "password incorrect" });
      }
    })
  });
});



module.exports = router;