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
  knex.from('content')
  .select('content.id as content_id', 'content.user_id', 'content.is_video', 'content.content_url', 'users.id as userID', 'users.bio','users.username', 'users.age', 'user_genre.genre_name as genre_name','users.instrument as instrument')
  .innerJoin('users', 'users.id', 'content.user_id')
  .innerJoin('user_genre', 'users.id', 'user_genre.user_id')
  // .innerJoin('genre', 'genre.id', 'user_genre.genre_id')
  .innerJoin('user_instrument', 'users.id', 'user_instrument.user_id')
  // .innerJoin('instrument', 'instrument.id', 'user_instrument.instrument_id')
  .then(content=>{
    const reformatted = reformatMatches(content)
    let x = Math.floor(Math.random() * (reformatted.length))
    console.log(reformatted)
    res.send(reformatted[x]);
  })
})


// Swipe Left

router.post('/:user_id/reject/:match_id', function(req, res, next){
  console.log('swiped left')
})

// Swipe Right
router.post('/:user_id/accept/:match_id', function(req, res, next){
  console.log('swiped right')
})

module.exports = router;
