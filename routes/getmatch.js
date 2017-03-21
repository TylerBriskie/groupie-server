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


router.get('/random/content', function(req, res, next){
  console.log(req.user.id)
  knex.from('users')
  .whereNot('users.id', req.user.id)
  .select('content.id as content_id', 'content.user_id', 'content.is_video', 'content.content_url', 'users.id as userID', 'users.bio','users.username', 'users.age', 'user_genre.genre_name as genre_name','users.instrument as instrument')
  .leftJoin('content', 'users.id', 'content.user_id')
  .innerJoin('user_genre', 'users.id', 'user_genre.user_id')
  .then(content=>{
    console.log(content);
    const reformatted = reformatMatches(content)
    let x = Math.floor(Math.random() * (reformatted.length))
    console.log(reformatted[x])
    res.send(reformatted[x]);
  })
})


// Swipe Left

router.post('/:user_id/reject/:match_id', function(req, res, next){
  console.log('swiped left')
  return knex('user_rejection')
})

// Swipe Right
router.post('/:user_id/accept/:match_id', function(req, res, next){
  console.log('swiped right')
})

module.exports = router;
