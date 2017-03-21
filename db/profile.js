let knex = require('./knex.js');

module.exports = {

  checkIfProfileExists: function(user) {
    return knex('users').select().where('email', user.email).first()
  },

  storeNewProfile: function(newProfile) {
    return knex.insert({
      email: newProfile.email,
      password: newProfile.password,
      username: newProfile.username,
      instrument: newProfile.instrument
    }).into('users').returning('id').then((id)=>{return id;});
  }


}
