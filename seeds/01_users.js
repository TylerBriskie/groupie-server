
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('DELETE FROM "users"; ALTER SEQUENCE users_id_seq RESTART WITH 6')
    .then(function(){
      const users = [
        {
          id: 1,
          username: "HeavyMetalMarty",
          email: "HeavyMetalMarty@gmail.com",
          password: "$2a$10$ScgD/c.6i1mPjgYuJts2I.BvMIUJ6TZ.in/GJ1yhG3GY0P4BcGxq2",
          age: 22,
          instrument: "Guitar",
          lat: 37.3382,
          long: -121.8863,
          bio: "My name is Marty and I love to shred!  Hit me up if you wanna start a metal band."
        },
        {
          id: 2,
          username: "DaveDrums",
          email: "davedrums@gmail.com",
          password: "$2a$10$ScgD/c.6i1mPjgYuJts2I.BvMIUJ6TZ.in/GJ1yhG3GY0P4BcGxq2",
          age: 34,
          instrument: "Drums",
          lat: 46.65,
          long: -79.38,
          bio: "Dave here, I've been drumming since I was 2.  I love funk, jazz, and long walks on the beach."
        },
        {
          id:3,
          username: "Slap-a-da-Bass",
          email: "slapdabass@gmail.com",
          password: "$2a$10$ScgD/c.6i1mPjgYuJts2I.BvMIUJ6TZ.in/GJ1yhG3GY0P4BcGxq2",
          age: 38,
          instrument: "Bass",
          lat: 42.3314,
          long: -83.0458,
          bio: "Laying down the dirtiest bass grooves in Denver."
        },
        {
          id:4,
          username: "Sammy_Shredder",
          email: "sammyshredder@gmail.com",
          password: "$2a$10$ScgD/c.6i1mPjgYuJts2I.BvMIUJ6TZ.in/GJ1yhG3GY0P4BcGxq2",
          age: 28,
          instrument: "Guitar",
          lat: 22.8905,
          long: -109.9167,
          bio: "I'm Sammy, and I used to be in a band called Van Halen.  I play rhythm guitar and sing, and I think I'm pretty good."
        },
        {
          id:5,
          username: "BluegrassBill",
          email: "bluegrassbill@gmail.com",
          password: "$2a$10$ScgD/c.6i1mPjgYuJts2I.BvMIUJ6TZ.in/GJ1yhG3GY0P4BcGxq2",
          age: 55,
          instrument: "Violin",
          lat: 36.1626,
          long: -86.7816,
          bio: "Bill's the name, hot country licks is the game.  I like my chicken fried, my beer cold, and my elected officials republican.  Let's Party!"
        },

      ];
      return knex('users').insert(users);
    });
};
