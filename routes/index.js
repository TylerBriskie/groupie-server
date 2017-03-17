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


module.exports = router;
