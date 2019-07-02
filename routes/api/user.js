const express = require('express');
const router = express.Router();

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
      newUser.save().then(user => res.json(user)).catch(err => console.log(err));
    }
  })
});

module.exports = router;