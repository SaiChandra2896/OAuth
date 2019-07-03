const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const keys = require('../../config/keys');

//get validation files
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//get model
const User = require('../../models/User');
// const rand = rand = Math.floor((Math.random() * 100) + 54);
let mailOptions = {};

const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "saichandranani143@gmail.com",
    pass: "saichandra"
  }
});

router.post('/register', (req, res) => {
  //get errors object
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const rand = Math.floor((Math.random() * 100) + 54);
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ error: 'User exists' });
    }
    else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        random: rand
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
  const link = 'http://localhost:5000/api/user/verify?id=' + rand;
  mailOptions = {
    to: req.body.email,
    subject: 'Please confirm your email account',
    html: `Hello, <br> Please click on the link to verify your email. <br><a href=${link}>Click here to verify</a>`
  }
  smtpTransport.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.log(err);
    }
    else {
      res.json({ sent: 'email sent' });
    }
  });
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user using email
  User.findOne({ email }).then((user) => {
    //validation for login
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    if (!user) {
      return res.json({ error: 'User not found please sign up' });
    }
    if (!user.confirmation) {
      return res.json({ error: 'please confirm email to login' });
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

router.get('/verify', (req, res) => {

  // console.log('abc');
  // console.log(mailOptions.to);
  User.findOne({ email: mailOptions.to }).then(user => {
    if (req.query.id == user.random) {
      user.confirmation = true;
      user.save().then(user => {
        res.json({
          status: 'user successfully verified',
          user,
        });
      });
    }
    else {
      res.json({ error: badrequest });
    }

  });
});
module.exports = router;