
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_instrument', function(table){
    table.increments();
    table.integer('user_id').references('users.id').unsigned().onDelete('cascade');
    table.text('instrument_name')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_instrument');
};
