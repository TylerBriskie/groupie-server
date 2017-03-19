
exports.seed = function(knex, Promise) {
  return knex.raw('DELETE FROM "user_genre"; ALTER SEQUENCE user_genre_id_seq RESTART WITH 8')
    .then(function(){
      const user_genre = [
        {
          id: 1,
          user_id: 1,
          genre_id: 1
        },
        {
          id: 2,
          user_id: 2,
          genre_id: 6
        },
        {
          id: 3,
          user_id: 2,
          genre_id: 5
        },
        {
          id: 4,
          user_id: 3,
          genre_id: 6
        },
        {
          id: 5,
          user_id: 4,
          genre_id: 1
        },
        {
          id: 6,
          user_id: 4,
          genre_id: 11
        },
        {
          id: 7,
          user_id: 1,
          genre_id: 8
        },

      ];
      return knex('user_genre').insert(user_genre);
    });
};
