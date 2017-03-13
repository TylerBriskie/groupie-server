
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_genre', function(table){
    table.increments();
    table.integer('user_id').references('users.id').unsigned().onDelete('cascade');
    table.integer('genre_id').references('genre.id').unsigned().onDelete('cascade');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_genre');

};
