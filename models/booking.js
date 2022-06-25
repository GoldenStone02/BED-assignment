/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const pool = require('../models/databaseConfig')

const bookingDB = {
    // .. POST a new booking
    insertBooking: function (user_id, flight_id, name, passport, nationality, age, callback) {
        console.log("Connected! Inserting a new booking...");
        var params = [user_id, flight_id, name, passport, nationality, age];
        var sql = `
        INSERT INTO booking (user_id, flight_id, name, passport, nationality, age) 
        VALUES (?, ?, ?, ?, ?, ?)`;
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            console.log(`${result.affectedRows} row has been affected`);
            console.table(result)
            return callback(null, result.insertId);
        })
    }
}


module.exports = bookingDB 