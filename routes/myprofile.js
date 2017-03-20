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

router.get('/', function(req, res) {
    if (req.user) {
      console.log("User found: ", req.user)
        res.send(req.user)
        // return knex('users')
        //     .where('email', req.user.email)
        //     .first()
        //     .then(data =>{
        //       // console.log(data[0].id)
        //       res.json(data)
        //     })
    } else {
        res.status(401);
        res.json({
            message: "UnAuthorized"
        });
    }
});

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
