
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments();
    table.text('email').notNullable();
    table.text('password').notNullable();
    table.text('username').notNullable();
    table.integer('age').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
