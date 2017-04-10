
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('user_genre', function(table){
    table.increments();
    table.integer('user_id').references('users.id').unsigned().onDelete('cascade');
    table.text('genre_name');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_genre');

};
