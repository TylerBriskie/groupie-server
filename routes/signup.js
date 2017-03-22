var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
var jwt = require('jsonwebtoken');
var knex = require('../db/knex.js');
var profile = require('../db/profile.js');
var protect = require('../db/encryption.js')

router.post('/', (req, res, next) => {
    console.log(req.body)
    if (validUser(req.body)) {
        profile.checkIfProfileExists(req.body)
            .then((user) => {
                if (user === undefined) {
                    req.body.password = protect.encrypt(req.body.password)
                        .then((data) => {
                            console.log(data)
                            const newProfile = {
                                username: req.body.username,
                                email: req.body.email,
                                instrument: req.body.instrument,
                                password: data
                            };
                            profile.storeNewProfile(newProfile).then(id => {
                              newProfile.id = id[0];
                              console.log(id)
                              delete newProfile.password;
                              jwt.sign(newProfile, process.env.TOKEN_SECRET, {expiresIn: '7d' }, function(error, token){

                                console.log("Signin, returning token:", token);
                                res.send(token);
                              });
                            })
                        });
                } else {
                  res.status(500).send('profile already exists with that email');
                }
            }).catch(error => {
              console.log(error)
              res.status(500).send(error)
            });

    } else {
      let errors = []
      if (req.body.username.length < 1){
          errors.push('username field can\'t be blank');
      }
      if (req.body.password.length < 1){
        errors.push('Password field can\'t be blank');
      }
      if (req.body.password_confirm.length < 1){
        errors.push('Please confirm password');
      }
      if (req.body.email.length < 1){
        errors.push('Email field can\'t be blank');
      }
      if (req.body.password != req.body.password_confirm){
        errors.push('Passwords must match');
      }
      res.status(500).send(errors)
    }

});

function validUser(user) {
    return typeof user.username == 'string' &&
        user.username.trim() != '' &&
        typeof user.email == 'string' &&
        user.email.trim() != '' &&
        typeof user.password == 'string' &&
        user.password.trim() != '' &&
        user.password.length > 7 &&
        user.password === user.password_confirm;

}

module.exports = router;
