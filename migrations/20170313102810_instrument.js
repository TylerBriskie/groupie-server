
exports.up = function(knex, Promise) {
  return knex.schema.createTable('instrument', function(table){
    table.increments();
    table.text('name');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('instrument');
};
