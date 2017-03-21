
exports.seed = function(knex, Promise) {

  return knex.raw('DELETE FROM "user_instrument"; ALTER SEQUENCE user_instrument_id_seq RESTART WITH 6')
    .then(function(){
      const user_instrument = [
        {
          id: 1,
          user_id: 1,
          instrument_name: "Guitar"
        },
        {
          id: 2,
          user_id: 2,
          instrument_name: "Drums"
        },
        {
          id: 3,
          user_id: 3,
          instrument_name: "Bass"
        },
        {
          id: 4,
          user_id: 4,
          instrument_name: "Guitar"
        },
        {
          id: 5,
          user_id: 5,
          instrument_name: "Fiddle"
        }
      ];
      return knex('user_instrument').insert(user_instrument);
    });
};
