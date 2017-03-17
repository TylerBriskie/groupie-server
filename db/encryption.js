var bcrypt = require('bcrypt');

module.exports = {
    encrypt: function(password) {
        return bcrypt.hash(password, 10).then(hash => {
          return hash;
        })
    },
    decrypt: function(hash, plainText) {
      return bcrypt.compare(plainText, hash).then(function(res) {
        // console.log(res);
            if (res === true) {
              return true;
            } else {
              return false;
            }
        });
    }

}
