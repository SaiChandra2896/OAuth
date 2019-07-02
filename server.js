const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const user = require('./routes/api/user');

const app = express();

//use body parser to parse incoming request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//config DB
const db = require('./config/keys').mongoURI;

//connect to database
mongoose.connect(db, { useNewUrlParser: true }).then(() => console.log('mongodb connected'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.use(passport.initialize());//initialize passport
require('./config/passport')(passport);//configure passport

app.use('/api/user', user);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
