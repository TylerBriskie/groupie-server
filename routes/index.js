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

router.get('/users/random', (req,res,next)=>{
  return knex('users')
    .then(function(data){
      let rando = Math.floor(Math.random() * (data.length))
      let checkMeOut = data[rando];
      console.log(checkMeOut)
      res.send(checkMeOut)
    })
})

router.get('/users/findamatch', (req, res, next)=>{
  // return knex('users').where('')
})




//get user by id
router.get('/users/:id', function(req,res,next){
  return knex('users').where('id', req.params.id)
    .then(data=>{
      res.json(data);
    });
});


// Get a users content
router.get('/users/:user_id/content', function(req, res, next){
  knex.from('content')
    .select('content.id', 'content.user_id', 'content.is_video', 'content.content_url')
    .where('content.user_id', req.params.user_id)
    .then((content)=>{
      console.log(content);
      res.json(content)
    })
})





module.exports = router;
