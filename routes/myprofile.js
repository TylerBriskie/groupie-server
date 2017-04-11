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

function reformatProfile(data){
  const reformatted = [];
  const usersById = {};
  // console.log("reformatting data: ", data);
  data.forEach(user => {
    if (usersById[user.userID] && (usersById[user.userID].genres.indexOf(user.genre_name)=== -1)){
      usersById[user.userID].genres.push(user.genre_name)
    } else if (usersById[user.userID] && (usersById[user.userID].filtered_instruments.indexOf(user.filtered_instrument)=== -1)){
      usersById[user.userID].filtered_instruments.push(user.filtered_instrument)
    } else if (usersById[user.userID]){

    }else{
      usersById[user.userID] = {
        username: user.username,
        user_id: user.userID,
        age: user.age,
        lat: user.lat,
        long: user.long,
        instrument: user.instrument,
        filtered_instruments: [user.filtered_instrument],
        bio: user.bio,
        content_url: user.content_url,
        genres: [user.genre_name]
      };
      reformatted.push(usersById[user.userID])
    }
  })
  console.log("Reformatted Data: ", reformatted)
  console.log("Length of Reformatted: ", reformatted.length);
  return reformatted;
}

router.get('/', function(req, res) {
    if (req.user) {
      knex.from('users')
      .select('content.id as content_id', 'user_genre.genre_name as genre_name', 'content.user_id', 'content.content_url',
      'users.id as userID', 'users.bio','users.username',
      'users.age','users.instrument as instrument',
      'users.lat', 'users.long',
      'filter_instrument.instrument as filtered_instrument')
      .where('users.id', req.user.id)
      .leftJoin('content', 'users.id', 'content.user_id')
      .leftJoin('user_genre', 'users.id', 'user_genre.user_id')
      .leftJoin('filter_instrument', 'users.id', 'filter_instrument.user_id')
      .then(content=>{
        console.log("content from join:", content)
        // if (content.length>1){
          const reformatted = reformatProfile(content)
          // console.log("Reformatted: ", reformatted)
          res.send(reformatted[0]);
        // } else {
        //   // console.log("content: ", content[0])
        //     res.send(content[0]);
        // }
      })
    } else {
        res.status(401);
        res.json({
            message: "UnAuthorized"
        });
    }
});

  // router.get('/myconnections', function(req,res,next){
  //   console.log("getting my connections")
  //   return knex('users').where('user_id')
  // })

  router.post('/updateContent', function(req,res,next){
    console.log("updating content for profile ", req.user.id)
    console.log(req.body.content_url)
    return knex('content').where('user_id', req.user.id).insert({
      user_id: req.user.id,
      content_url: req.body.content_url
    }).then(data=>{
      console.log("update content data:", data);
    })
    })

  router.post('/updateBio', function(req,res,next){
    console.log("updating Bio for profile ", req.user.id)
    console.log(req.body.bio)
    return knex('users').where('id', req.user.id).first().update({
      bio: req.body.bio
    }).then(data=>{
      console.log("update bio data:", data);
    }).catch((err)=>{
      console.log(err)
      next(err)
    })
    })

  router.post('/addGenre', function(req, res, next){
    let myNewGenres = req.body.genre.split(", ")
    let myPromises = [];
    console.log("My New genres:", myNewGenres)
    console.log('how many?', myNewGenres.length)
    for (var i=0; i<myNewGenres.length; i++){
      myPromises.push(
        knex('user_genre').insert({
          user_id: req.user.id,
          genre_name: myNewGenres[i]
        })
      )
    }
    console.log("all my promises:", myPromises)
    Promise.all(myPromises)
    .then((whahappen)=>{
      console.log("promise.all: ", whahappen)
      res.send("Adding Genres")
    })
    .catch((err)=>{
      console.log(err)
      next(err)
    })
  })

    router.delete('/removeGenre', function(req,res,next){
      console.log('removing genre')
      return knex('user_genre').where('user_id', req.user.id)
        .del()
        .then(()=>{
          console.log("Genres Deleted")
        })
        .catch(err=>{
          console.log("An Error Occurred:", err)
          next(err)
        })
    })

  router.post('/filterInstrument', function(req, res, next){

    let myFilters = req.body.filterInstruments
    let myPromises = [knex('filter_instrument')
      .where('user_id', req.user.id)
      .del()];
    console.log('filter these instruments: ', myFilters)
    console.log('how many? : ', myFilters.length)
    for (var i=0; i<myFilters.length; i++){
      myPromises.push(
        knex('filter_instrument').insert({
          user_id: req.user.id,
          instrument: myFilters[i]
        })
      )
    }
    Promise.all(myPromises).then((result)=>{
      console.log("adding instruments to filter: ", result)
    })
  })


  router.post('/updateInstrument', function(req, res, next){
    console.log(`updating user ${req.user.id}'s instrument to: ${req.body.instrument}`)
    return knex('users').where('id', req.user.id).first().update({
      instrument: req.body.instrument
    }).then((result)=>{
      console.log(result)
    }).catch(err=>{
      console.log("Error: ", err)
      throw err
    })

  })

  // router.post('/logout', function(req, res, next){
  //   console.log("logging out")
  // })


  router.delete('/deleteProfile', function(req,res,next){
    console.log('Account Deleted')
    return knex('users').where('id', req.user.id).del().then(result=>{console.log(result)})
  })


module.exports = router
