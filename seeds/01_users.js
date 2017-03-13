
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
          age: 22
        },
        {
          id: 2,
          username: "DaveDrums",
          email: "davedrums@gmail.com",
          password: "password",
          age: 34
        },
        {
          id:3,
          username: "Slap-a-da-Bass",
          email: "slapdabass@gmail.com",
          password: "password",
          age: 38
        },
        {
          id:4,
          username: "Sammy_Shredder",
          email: "sammyshredder@gmail.com",
          password: "password",
          age: 28
        }
      ];
      return knex('users').insert(users);
    });
};
