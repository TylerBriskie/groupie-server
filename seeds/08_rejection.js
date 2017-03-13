
exports.seed = function(knex, Promise) {

  return knex.raw('DELETE FROM "user_rejection"; ALTER SEQUENCE user_rejection_id_seq RESTART WITH 2')
    .then(function(){
      const rejection = [
        {
          id: 1,
          user_1: 2,
          user_2: 1
        }
      ];
      return knex('user_rejection').insert(rejection);
    });
};
