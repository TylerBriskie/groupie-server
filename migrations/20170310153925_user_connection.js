
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('user_connection', function(table){
    table.increments();
    table.integer('connector').references('users.id').unsigned().onDelete('cascade');
    table.integer('connectee').references('users.id').unsigned().onDelete('cascade');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_connection');
};
