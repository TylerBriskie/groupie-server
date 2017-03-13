
exports.up = function(knex, Promise) {
  return knex.schema.createTable('genre', function(table){
    table.increments();
    table.text('name').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('genre');

};
