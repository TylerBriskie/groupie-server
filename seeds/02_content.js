
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('DELETE FROM "content"; ALTER SEQUENCE content_id_seq RESTART WITH 6')
    .then(function(){
      const content = [
        {
          id: 1,
          is_video: true,
          user_id: 1,
          content_url: "https://www.youtube.com/embed/gPibbNqCh1w#t=0m05s"
        },
        {
          id: 2,
          is_video: false,
          user_id: 2,
          content_url: "https://soundcloud.com/torontodrummer/drum-solo#t=1:42"
        },
        {
          id: 3,
          is_video: true,
          user_id: 3,
          content_url: "https://www.youtube.com/embed/DjpudvU-ZRA#t=0m03s"
        },
        {
          id: 4,
          is_video: true,
          user_id: 4,
          content_url: "https://www.youtube.com/watch?v=RvV3nn_de2k"
        },
        {
          id: 5,
          is_video: false,
          user_id: 5,
          content_url: "https://soundcloud.com/goose-creek-symphony/fiddle-solo-fred-live"
        }
      ];
      return knex('content').insert(content);
    });
};
