
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('content', function(table){
    table.increments();
    table.boolean('is_video').defaultTo(false);
    table.integer('user_id').references('users.id').unsigned().onDelete('cascade');
    table.text('content_url').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('content');

};
