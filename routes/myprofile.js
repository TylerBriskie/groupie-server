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
      knex.from('content')
      .select('content.id as content_id', 'content.user_id', 'content.is_video', 'content.content_url', 'users.id as userID', 'users.bio','users.username', 'users.age', 'genre.id as genre_id','instrument.name as instrument','genre.name as genre_name')
      .where('users.id', req.user.id)
      .innerJoin('users', 'users.id', 'content.user_id')
      .innerJoin('user_genre', 'users.id', 'user_genre.user_id')
      .innerJoin('genre', 'genre.id', 'user_genre.genre_id')
      .innerJoin('user_instrument', 'users.id', 'user_instrument.user_id')
      .innerJoin('instrument', 'instrument.id', 'user_instrument.instrument_id')
      .then(content=>{
        console.log("content from join:", content)
        if (content.length>1){
          const reformatted = reformatMatches(content)
          console.log("Reformatted: ", reformatted)
          res.send(reformatted[0]);
        } else {
            res.send(content);
        }
      })
      // console.log("User found: ", req.user)
      //   res.json(req.user)
    } else {
        res.status(401);
        res.json({
            message: "UnAuthorized"
        });
    }
});

router.post('/update', function(req,res,next){
  console.log("updating profile")
  console.log(req.user.id)
  return knex('users').where('id', req.user.id).first().update({
    bio: req.body.bio
  }).then(()=>{
    return knex('content').where('content.user_id', req.user.id).first().update({
      content_url: req.body.content_url
    }).then(()=>{

    })
  })

})

// router.get('/profile', function(req, res){
//   if(req.user) {
//     return knex('users').where('email', req.user.email)
//       .then(data =>{
//         res.json(data)
//       })
//   } else {
//     res.status(401);
//     res.json({
//       message: "UnAuthorized"
//     });
//   }
// });


module.exports = router
