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
              console.log("line 18, loging user from knex query >>",user)
              protect.decrypt(user.password, profile.session.password).then(result => {
                console.log(result)
                  if (result === true) {
                    jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: '7d' }, function(error, token){

                      console.log(token);
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

router.get('/profile', function(req, res){
  console.log(req.body)
  if(req.user) {
    return knex('users').where('email', req.user.email)
      .then(data =>{
        res.json(data)
      })
  } else {
    res.status(401);
    res.json({
      message: "UnAuthorized"
    });
  }
});

module.exports = router
