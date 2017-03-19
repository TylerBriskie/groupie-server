
exports.seed = function(knex, Promise) {
  return knex.raw('DELETE FROM "genre"; ALTER SEQUENCE genre_id_seq RESTART WITH 13')
    .then(function(){
      const genre = [
        {
          id: 1,
          name: "Metal"
        },
        {
          id: 2,
          name: "Country"
        },
        {
          id: 3,
          name: "Rock"
        },
        {
          id: 4,
          name: "Blues"
        },
        {
          id: 5,
          name: "Jazz"
        },
        {
          id: 6,
          name: "Funk"
        },
        {
          id: 7,
          name: "Acoustic"
        },
        {
          id: 8,
          name: "Punk"
        },
        {
          id: 9,
          name: "R&B"
        },
        {
          id: 10,
          name: "Hip-Hop"
        },
        {
          id: 11,
          name: "Hard Rock"
        },
        {
          id: 12,
          name: 'EDM'
        }
      ];
      return knex('genre').insert(genre);
    });
};
