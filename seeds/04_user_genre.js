
exports.seed = function(knex, Promise) {
  return knex.raw('DELETE FROM "user_genre"; ALTER SEQUENCE user_genre_id_seq RESTART WITH 10')
    .then(function(){
      const user_genre = [
        {
          id: 1,
          user_id: 1,
          genre_name:"Metal"
        },
        {
          id: 2,
          user_id: 2,
          genre_name:"Funk"
        },
        {
          id: 3,
          user_id: 2,
          genre_name: "Jazz"
        },
        {
          id: 4,
          user_id: 3,
          genre_name: "Funk"
        },
        {
          id: 5,
          user_id: 4,
          genre_name: "Metal"
        },
        {
          id: 6,
          user_id: 4,
          genre_name: "Hard Rock"
        },
        {
          id: 7,
          user_id: 1,
          genre_name: "Punk"
        },
        {
          id: 8,
          user_id: 5,
          genre_name: "Country"
        },
        {
          id: 9,
          user_id: 5,
          genre_name: "Acoustic"
        }

      ];
      return knex('user_genre').insert(user_genre);
    });
};
