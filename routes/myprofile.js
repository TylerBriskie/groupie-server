var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
var jwt = require('jsonwebtoken');
var knex = require('../db/knex.js');
var protect = require('../db/encryption.js')

// router.get('/', function(req, res, next) {
//     // console.log("Req: ", req.body)
//     if (req.user){
//       console.log("user found")
//     }
//     // return knex('users')
//     //     .where('id', req.body.user_id)
//     //     .then(function(data) {
//     //         // console.log(data)
//     //         res.json(data);
//     //     });
// });
//

function reformatMatches(data){
  const reformatted = [];
  const usersById = {};
  console.log("reformatting data: ", data);
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

router.get('/', function(req, res) {
    if (req.user) {
      knex.from('users')
      .select('content.id as content_id', 'user_genre.genre_name as genre_name', 'content.user_id', 'content.content_url', 'users.id as userID', 'users.bio','users.username', 'users.age','users.instrument as instrument')
      .where('users.id', req.user.id)
      .leftJoin('content', 'users.id', 'content.user_id')
      .leftJoin('user_genre', 'users.id', 'user_genre.user_id')
      .then(content=>{
        console.log("content from join:", content)
        if (content.length>1){
          const reformatted = reformatMatches(content)
          console.log("Reformatted: ", reformatted)
          res.send(reformatted[0]);
        } else {
          console.log("content: ", content[0])
            res.send(content[0]);
        }
      })
    } else {
        res.status(401);
        res.json({
            message: "UnAuthorized"
        });
    }
});

  router.post('/updateContent', function(req,res,next){
    console.log("updating content for profile ", req.user.id)
    console.log(req.body.content_url)
    return knex('content').where('user_id', req.user.id).insert({
      content_url: req.body.content_url
    }).then(data=>{
      console.log(data);
    })
    })

  router.post('/updateBio', function(req,res,next){
    console.log("updating Bio for profile ", req.user.id)
    console.log(req.body.bio)
    return knex('users').where('id', req.user.id).first().update({
      bio: req.body.bio
    }).then(data=>{
      console.log(data);
    })
    })

  router.post('/addGenre', function(req, res, next){
    console.log('adding genre for user ', req.user.id)
    return knex('user_genre').insert({
      genre_name: req.body.genre
    }).then(data=>{
      console.log(data)
    })
  })

  router.post('/updateInstrument', function(req, res, next){
    console.log(`updating user ${req.user.id}'s instrument to: ${req.body.instrument}`)
    return knex('users').where('id', req.user.id).first().update({
      instrument: req.body.instrument
    }).then((result)=>{
      console.log(result)
    })

  })

  router.delete('/removeGenre', function(req,res,next){
    console.log('removing genre')
    return knex('user_genre').where('user_id', req.user.id).del().then(genres=>{console.log(genres)})
  })

  router.delete('/deleteProfile', function(req,res,next){
    console.log('Account Deleted')
    return knex('users').where('id', req.user.id).del().then(result=>{console.log(result)})
  })


module.exports = router
