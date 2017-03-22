
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_rejection', function(table){
    table.increments();
    table.integer('rejector').references('users.id').unsigned().onDelete('cascade');
    table.integer('rejectee').references('users.id').unsigned().onDelete('cascade');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_rejection')
};
