
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('filter_instrument', function(table){
    table.increments();
    table.integer('user_id').references('users.id').unsigned().onDelete('cascade');
    table.text('instrument');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('filter_instrument');
};
