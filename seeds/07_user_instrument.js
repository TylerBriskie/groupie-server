
exports.seed = function(knex, Promise) {

  return knex.raw('DELETE FROM "user_instrument"; ALTER SEQUENCE user_instrument_id_seq RESTART WITH 5')
    .then(function(){
      const user_instrument = [
        {
          id: 1,
          user_id: 1,
          instrument_id: 1
        },
        {
          id: 2,
          user_id: 2,
          instrument_id: 2
        },
        {
          id: 3,
          user_id: 3,
          instrument_id: 3
        },
        {
          id: 4,
          user_id: 4,
          instrument_id: 1
        }
      ];
      return knex('user_instrument').insert(user_instrument);
    });
};
