
exports.seed = function(knex, Promise) {
  return knex.raw('DELETE FROM "filter_instrument"; ALTER SEQUENCE filter_instrument_id_seq RESTART WITH 3')
    .then(function(){
      const instruments = [
        {
          id: 1,
          user_id: 5,
          instrument: "Guitar"
        },
        {
          id: 2,
          user_id: 1,
          instrument: "Drums"
        },
      ];
      return knex('filter_instrument').insert(instruments);
    });
};
