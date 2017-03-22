var express = require('express');
var router = express.Router();
const knex = require('../db/knex');
const dotenv = require('dotenv').config();

var app = express();

// return random content and user for potential match

function reformatMatches(data){
  const reformatted = [];
  const usersById = {};

  data.forEach(user => {
    if (usersById[user.user_id]){
      usersById[user.user_id].genres.push(user.genre_name)
    } else {
      usersById[user.user_id] = {
        username: user.username,
        user_id: user.user_id,
        age: user.age,
        instrument: user.instrument,
        video: user.is_video,
        bio: user.bio,
        content: user.content_url,
        genres: [user.genre_name]
      };
      reformatted.push(usersById[user.user_id])
    }
  })
  return reformatted;
}


// router.get('/random/content', function(req, res, next){
//   console.log(req.user.id)
//   knex.from('users')
//   .select('content.id as content_id', 'content.user_id',
//   'content.is_video', 'content.content_url', 'users.id as userID',
//   'users.bio','users.username', 'users.age', 'user_genre.genre_name as genre_name',
//   'users.instrument as instrument')
//   .leftJoin('content', 'users.id', 'content.user_id')
//   // .leftJoin('user_connection', 'user_connection.connectee', req.params.id)
//   .innerJoin('user_genre', 'users.id', 'user_genre.user_id')
//   .whereNot('users.id', req.user.id)
//   // .whereNot('users.id', 'connectee')
//   .then(content=>{
//
//     console.log(content);
//     const reformatted = reformatMatches(content)
//     let x = Math.floor(Math.random() * (reformatted.length))
//     console.log("Sending: ", reformatted[x])
//     res.send(reformatted[x]);
//   })
// })

router.get('/random/content', function(req,res,next){
  let myConnections = [];
  let myGenres=[];
  let randomMatch = {};
  knex.from('user_genre')
  .select('user_genre.genre_name as genre')
  .where('user_genre.user_id', req.user.id)
  .then(result=>{
    for(var i=0; i<result.length; i++){
      myGenres.push(result[i].genre)
    }
    knex.from('users')
      .select('content.id as content_id', 'content.user_id',
      'content.is_video', 'content.content_url', 'users.id as userID',
      'users.bio','users.username', 'users.age', 'user_genre.genre_name as genre_name',
      'users.instrument as instrument')
      .leftJoin('content', 'users.id', 'content.user_id')
      .innerJoin('user_genre', 'users.id', 'user_genre.user_id')
      .whereIn('genre_name', myGenres)
      .whereNot('users.id', req.user.id)
      .then(content=>{

        console.log("content: ",content);
        const reformatted = reformatMatches(content)
        let x = Math.floor(Math.random() * (reformatted.length))
        console.log("reformatted:", reformatted[x])
        return reformatted[x];
      }).then(random=>{
        console.log("sending: ", random)
        randomMatch = random
        res.send(randomMatch);
      })
  })
})


// Swipe Left

router.post('/reject/:match_id', function(req, res, next){
  console.log('swiped left')
  return knex('user_rejection').insert({
    rejector: req.user.id,
    rejectee: req.params.match_id
  })
  .then(()=>{
    console.log('user rejected')
  })
})

// Swipe Right
router.post('/accept/:match_id', function(req, res, next){
  console.log('swiped right')
  return knex('user_connection').insert({
    connector: req.user.id,
    connectee: req.params.match_id
  })
  .then(()=>{
    console.log('connection made...')
  })
})

module.exports = router;
