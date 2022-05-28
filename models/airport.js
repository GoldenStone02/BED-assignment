/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const pool = require('../models/databaseConfig')

const airportDB = {
    // .. POST a new airport
    insertAirport: function(name, country, description, callback) {
        console.log("Connected! Inserting a new airport...");
        var params =[name, country, description];
        var sql = "INSERT INTO airport (name, country, description) VALUES (?, ?, ?); SELECT * FROM airport WHERE airport_id = LAST_INSERT_ID()";
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            console.table(result[1])
            console.log(`${result[0].affectedRows} row has been affected`)
            return callback(null, result[0].affectedRows)
        })
    },
    // .. GET all airports
    getAllAirports: function(callback) {
        console.log("Connected! Getting all airports...");
        var sql = "SELECT airport.airport_id, airport.name, airport.country FROM airport";
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            console.table(result)
            return callback(null, result)
        })
    }
}

module.exports = airportDB