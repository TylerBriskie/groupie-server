var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
var jwt = require('jsonwebtoken');
var knex = require('../db/knex.js');
var protect = require('../db/encryption.js')


//get all genres
router.get('/', function(req, res, next){
  return knex('genre')
    .then(genres=>{
      console.log(genres)
      res.json(genres)
    })
})

//get users genres
router.get('/:user_id', function(req, res, next){
  return knex('genre')
  .innerJoin('user_genre', 'user_genre.genre_id', 'genre.id')
  .innerJoin('users', 'user_genre.user_id', 'users.id')
  .where('users.id', req.params.user_id)
  .then(genres=>{
    console.log(genres)
    res.json(genres)
  })
});

module.exports = router
