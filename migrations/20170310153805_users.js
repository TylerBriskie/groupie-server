
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', function(table){
    table.increments();
    table.text('email').notNullable();
    table.text('password').notNullable();
    table.text('username').notNullable();
    table.text('instrument').notNullable();
    table.integer('age');
    table.float('lat');
    table.float('long');
    table.text('bio');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
