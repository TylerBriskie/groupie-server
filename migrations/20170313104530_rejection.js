
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_rejection', function(table){
    table.increments();
    table.integer('user_1').references('users.id').unsigned().onDelete('cascade');
    table.integer('user_2').references('users.id').unsigned().onDelete('cascade');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_rejection')
};
