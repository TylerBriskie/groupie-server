
exports.seed = function(knex, Promise) {
  return knex.raw('DELETE FROM "user_connection"; ALTER SEQUENCE user_connection_id_seq RESTART WITH 2')
    .then(function(){
      const connection = [
        {
          id: 1,
          user_1: 1,
          user_2: 2
        }
      ];
      return knex('user_connection').insert(connection);
    });
};
