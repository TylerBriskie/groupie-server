var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
var jwt = require('jsonwebtoken');
var knex = require('../db/knex.js');
var protect = require('../db/encryption.js')


  router.post('/', function(req, res, next) {
    let profile = req.body;
    // console.log(profile);
    knex.select().table('users').where('email', profile.session.email).first()
        .then(user => {
          // console.log(user)
            if(user === undefined) {
              res.status(500).send('Email Not Found!');
            } else {
              protect.decrypt(user.password, profile.session.password).then(result => {
                console.log(result)
                  if (result === true) {
                    jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: '1d' }, function(error, token){
                      console.log(error, token);
                      res.send(token);
                    });
                  } else {
                    res.status(500).send('Incorrect Password')
                  }
              }).catch(error => {
                  // res.redirect('/')
              })
            }

        })

});

module.exports = router
