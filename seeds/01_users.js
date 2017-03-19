
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('DELETE FROM "users"; ALTER SEQUENCE users_id_seq RESTART WITH 5')
    .then(function(){
      const users = [
        {
          id: 1,
          username: "HeavyMetalMarty",
          email: "HeavyMetalMarty@gmail.com",
          password: "password",
          age: 22,
          bio: "My name is Marty and I love to shred!  Hit me up if you wanna start a metal band"
        },
        {
          id: 2,
          username: "DaveDrums",
          email: "davedrums@gmail.com",
          password: "password",
          age: 34,
          bio: "Dave here, I've been drumming since I was 2.  I love funk, jazz, and long walks on the beach"
        },
        {
          id:3,
          username: "Slap-a-da-Bass",
          email: "slapdabass@gmail.com",
          password: "password",
          age: 38,
          bio: "Laying down the dirtiest bass grooves in Denver."
        },
        {
          id:4,
          username: "Sammy_Shredder",
          email: "sammyshredder@gmail.com",
          password: "password",
          age: 28,
          bio: "I'm Sammy, and I used to be in a band called Van Halen.  I play rhythm guitar and sing, and I think I'm pretty good"
        }
      ];
      return knex('users').insert(users);
    });
};
