var mysql = require('mysql')
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '1qwer$#@!',
            database: 'sp_air',
            dateStrings: true
          });
  
      return conn;
    }
};
  
// put this at the end of the file
module.exports = dbconnect;
  