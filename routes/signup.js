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
            .then((result) => {
                if (result === undefined) {
                    req.body.password = protect.encrypt(req.body.password)
                        .then((data) => {
                            console.log(data)
                            const newProfile = {
                                username: req.body.username,
                                email: req.body.email,
                                password: data
                            };
                            profile.storeNewProfile(newProfile).then(id => {
                              res.status(200).send('profile created')
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
