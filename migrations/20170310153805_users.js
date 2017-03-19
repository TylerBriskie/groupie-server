
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments();
    table.text('email').notNullable();
    table.text('password').notNullable();
    table.text('username').notNullable();
    table.integer('age');
    table.integer('lat');
    table.integer('long');
    table.text('bio');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
