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
        email: user.email,
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
  .then(genres=>{
    for(var i=0; i<genres.length; i++){
      myGenres.push(genres[i].genre)
    }
    knex.from('user_connection')
    .select('user_connection.connectee as connectee')
    .where('user_connection.connector', req.user.id)
    .then((winners)=>{
      if (winners){
        // console.log("winners:", winners)
        for(var j=0; j<winners.length; j++){
          myConnections.push(winners[j].connectee)
        }
      }
      // console.log("myconnections:", myConnections)
      knex.from('user_rejection')
      .select('user_rejection.rejectee as rejectee')
      .where('user_rejection.rejector', req.user.id)

    .then((losers)=>{
      // console.log("losers: ", losers)
      if (losers){
        for(var x=0; x<losers.length; x++){
          myConnections.push(losers[x].rejectee)
        }
      }
      console.log("myconnections:", myConnections);
      knex.from('users')
        .select('content.id as content_id', 'content.user_id',
        'content.is_video', 'content.content_url', 'users.id as userID',
        'users.bio','users.username', 'users.email as email','users.age', 'user_genre.genre_name as genre_name',
        'users.instrument as instrument')
        .leftJoin('content', 'users.id', 'content.user_id')
        // .leftJoin('user_connection', 'user_connection.connector', req.user.id)
        // .leftJoin('user_rejection', 'user_rejection.rejector', req.user.id)
        .innerJoin('user_genre', 'users.id', 'user_genre.user_id')
        // .whereIn('genre_name', myGenres)
        .whereNot('users.id', req.user.id)
        .whereNotIn('users.id', myConnections)
        // .whereNotIn('rejectee', myConnections)
        .then(content=>{

          // console.log("content: ",content);
          const reformatted = reformatMatches(content)
          let x = Math.floor(Math.random() * (reformatted.length))
          // console.log("reformatted:", reformatted[x])
          return reformatted[x];
        }).then(random=>{
          if (random != undefined){
            console.log("sending: ", random)
            randomMatch = random
            res.json(randomMatch);
          } else {
            console.log("no users found")
            res.status(301)
            res.json({
              error: "No Users Found... :(",

            })
          }
        })
    })
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
    res.json({message: 'rejected'})
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
  .then((result)=>{
    console.log("result of connection:", result)
    return knex('user_connection')
    .where('connectee', req.user.id)
    .andWhere('connector', req.params.match_id)
    .then((isConnected)=>{
      if (isConnected.length>0){
        console.log("connection made!")
        res.status(202).send('connection made')
      } else {
        res.status(206).send('no connection yet')
      }

    })
  })
})

module.exports = router;
