var express = require('express');
var router = express.Router();
const knex = require('../db/knex');
const dotenv = require('dotenv').config();

var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//get users

router.get('/users', function(req, res, next) {
    return knex('users')
        .then(function(data) {
            res.json(data);
        });
});

router.get('/users/:id', function(req,res,next){
  return knex('users').where('id', req.params.id)
    .then(data=>{
      res.json(data);
    });
});

router.post('/newuser', function(req,res,next){
  return knex('users').insert({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age
    }).returning('username')
      .then(newUser=>{
        console.log(newUser);
        res.json(newUser);
      })
})

module.exports = router;
