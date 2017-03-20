
exports.seed = function(knex, Promise) {
  return knex.raw('DELETE FROM "instrument"; ALTER SEQUENCE instrument_id_seq RESTART WITH 12')
    .then(function(){
      const instruments = [
        {
          id: 1,
          name: "Guitar"
        },
        {
          id: 2,
          name: "Drums"
        },
        {
          id: 3,
          name: "Bass"
        },
        {
          id: 4,
          name: "Piano"
        },
        {
          id: 5,
          name: "Keyboards"
        },
        {
          id: 6,
          name: "Saxophone"
        },
        {
          id: 7,
          name: "Trumpet"
        },
        {
          id: 8,
          name: "Vocals"
        },
        {
          id: 9,
          name: "Vibes"
        },
        {
          id: 10,
          name: "Percussion"
        },
        {
          id:11,
          name: "Fiddle"
        }
      ];
      return knex('instrument').insert(instruments);
    });
};
