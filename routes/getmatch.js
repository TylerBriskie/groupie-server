var express = require('express');
var router = express.Router();
const knex = require('../db/knex');
const dotenv = require('dotenv').config();

var app = express();

let myLocation = {
  lat: 0,
  long: 0
}

// return random content and user for potential match


function getDistanceToMatch(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return (Math.round(d * 0.621371));
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}



function reformatMatches(data, distance) {
    const reformatted = [];
    const usersById = {};
    console.log("Reformatting matches, distance filter: ", distance)
    if (distance == 300){
      distance = 1000000
      console.log("Setting Range to Max Distance... ", distance)
    }
    data.forEach(user => {
      let howFar = getDistanceToMatch(user.matchLat, user.matchLong, myLocation.lat, myLocation.long)
        if (howFar < distance){
          if (usersById[user.user_id]) {
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
                  distance: howFar,
                  genres: [user.genre_name]
              };
              reformatted.push(usersById[user.user_id])
          }
        }

    })
    return reformatted;
}

router.get('/random/content', function(req, res, next) {
    let myConnections = [];
    let myGenres = [];
    let myInstrumentFilters = [];
    let randomMatch = {};
    let distanceFilter = req.query.sortDistance;
    knex.from('filter_instrument')
        .select('filter_instrument.instrument as instrument')
        .where('filter_instrument.user_id', req.user.id)
        .then(instruments => {
            for (var a = 0; a < instruments.length; a++) {
                if (instruments[a].instrument != null) {
                    myInstrumentFilters.push(instruments[a].instrument)
                }
            }
            knex.from('users')
                .select('users.lat', 'users.long')
                .where('users.id', req.user.id).first()
                .then(location =>{
                  console.log('location? : ', location)
                  myLocation.lat = location.lat;
                  myLocation.long = location.long
                  console.log(myLocation)

            knex.from('user_genre')
                .select('user_genre.genre_name as genre')
                .where('user_genre.user_id', req.user.id)
                .then(genres => {
                    for (var i = 0; i < genres.length; i++) {
                        myGenres.push(genres[i].genre)
                    }
                    console.log("My Genres: ", myGenres)
                    knex.from('user_connection')
                        .select('user_connection.connectee as connectee')
                        .where('user_connection.connector', req.user.id)
                        .then((winners) => {
                            if (winners) {
                                // console.log("winners:", winners)
                                for (var j = 0; j < winners.length; j++) {
                                    myConnections.push(winners[j].connectee)
                                }
                            }
                            // console.log("myconnections:", myConnections)
                            knex.from('user_rejection')
                                .select('user_rejection.rejectee as rejectee')
                                .where('user_rejection.rejector', req.user.id)

                            .then((losers) => {
                                // console.log("losers: ", losers)
                                if (losers) {
                                    for (var x = 0; x < losers.length; x++) {
                                        myConnections.push(losers[x].rejectee)
                                    }
                                }
                                console.log("My instrument filters: ", myInstrumentFilters)
                                console.log("myconnections:", myConnections);
                                var myQuery = knex.from('users')
                                    .select('content.id as content_id', 'content.user_id',
                                        'content.is_video', 'content.content_url', 'users.id as userID',
                                        'users.bio', 'users.username', 'users.email as email', 'users.age', 'users.lat as matchLat', 'users.long as matchLong', 'user_genre.genre_name as genre_name',
                                        'users.instrument as instrument')
                                    .innerJoin('content', 'users.id', 'content.user_id')

                                // .leftJoin('user_connection', 'user_connection.connector', req.user.id)
                                // .leftJoin('user_rejection', 'user_rejection.rejector', req.user.id)
                                .innerJoin('user_genre', 'users.id', 'user_genre.user_id')
                                .whereNot('users.id', req.user.id)
                                // .whereIn('genre_name', myGenres)
                                .whereNotIn('users.id', myConnections)
                                    // .whereNotIn('rejectee', myConnections)
                                    console.log("req.query.sortByInstrument: ", typeof req.query.sortByInstrument)
                                    console.log("req.query.sortByGenre: ", typeof req.query.sortByGenre)
                                if (req.query.sortByInstrument == "true") {
                                  console.log("Sorting by instrument filters...")
                                  myQuery.whereIn('instrument', myInstrumentFilters);
                                }
                                if (req.query.sortByGenre == 'true'){
                                  console.log("My genres: ", myGenres)
                                  myQuery.whereIn('genre_name', myGenres)
                                  console.log("Sorting By Genre Filters...")
                                }


                                // myQuery.debug(true);

                                myQuery.then(content => {

                                    // console.log("content: ",content);
                                    const reformatted = reformatMatches(content, distanceFilter)
                                    let x = Math.floor(Math.random() * (reformatted.length))
                                    console.log("reformatted:", reformatted[x])
                                    return reformatted[x];
                                }).then(random => {
                                    console.log("random: ", random)
                                    if (random != undefined) {
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
        })
})


// Swipe Left

router.post('/reject/:match_id', function(req, res, next) {
    console.log('swiped left')
    return knex('user_rejection').insert({
            rejector: req.user.id,
            rejectee: req.params.match_id
        })
        .then(() => {
            res.json({
                message: 'rejected'
            })
            console.log('user rejected')
        })
})

// Swipe Right
router.post('/accept/:match_id', function(req, res, next) {
    console.log('swiped right')
    return knex('user_connection').insert({
            connector: req.user.id,
            connectee: req.params.match_id
        })
        .then((result) => {
            console.log("result of connection:", result)
            return knex('user_connection')
                .where('connectee', req.user.id)
                .andWhere('connector', req.params.match_id)
                .then((isConnected) => {
                    if (isConnected.length > 0) {
                        console.log("connection made!")
                        res.status(202).send('connection made')
                    } else {
                        res.status(206).send('no connection yet')
                    }

                })
        })
})

module.exports = router;
