const userModel = require('../models/db').User;
const { encrypt } = require('../lib/bcrypt');
exports.register = function (req, res) {
  var body = req.body;
  const username = body.username;
  const password = body.password;
  const email = String(body.email);
  const userType = String(body.userType);
  
  if (body.password != body.confirmPassword) {
    res.status(400).render('sign-up', { user: undefined, message: 'Password does not match' });
  } else if (username && password) {
    userModel.findOne({ where: { userName: username } }).then(function (checkUser) {
      if (checkUser) {
        res.status(400).render('sign-up', { user: undefined, message: 'User name has been used' });
      } else {
        if (email.includes("@mail.sfsu.edu")) {
          console.log("hello?");
          encrypt(password).then(function (saltPassword) {
            userModel.create({ email: body.email, userName: body.username, password: saltPassword, firstName: body.firstName, lastName: body.lastName, userType: body.userType });
            res.status(200).render('login', { user: undefined, message: 'You have been registered! Please login.' });
          });
        }
        else {
          console.log("hello?");
          res.status(200).render('sign-up', { user: undefined, message: 'Must be SFSU email' });
        }
      }
    });
  } else {
    res.status(400).render('sign-up', { user: undefined, message: 'User name or password cannot be empty' });
  }
};
