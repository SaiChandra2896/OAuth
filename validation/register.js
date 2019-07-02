const validator = require('validator');
const isEmpty = require('./isEmpty');

const validateRegisterInput = (data) => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!validator.isLength(data.name, { min: 4, max: 15 })) {
    errors.name = 'Name should be between 4 and 15 charecters';
  };
  if (validator.isEmpty(data.name)) {
    errors.name = 'Name feild is required';
  }

  if (validator.isEmpty(data.email)) {
    errors.email = 'Email feild is required';
  }
  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password feild is required';
  }
  if (!validator.isLength(data.password, { min: 6, max: 12 })) {
    errors.password = 'Password must be 6 to 12 charecters long';
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password feild is required';
  }
  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
};

module.exports = validateRegisterInput;