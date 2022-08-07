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
    // .. GET an airport by airport_id
    getAirportById: function(airport_id, callback) {
        console.log("Connected! Getting an airport by airport_id...");
        var params = [airport_id];
        var sql = "SELECT airport.airport_id, airport.name, airport.country, airport.description FROM airport WHERE airport_id = ?";
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            if (result.length == 0) {
                console.log("No airport with this airport_id")
                return callback("No airport", null)
            }
            console.table(result)
            return callback(null, result)
        })
    },
    // .. GET all airports
    getAllAirports: function(callback) {
        console.log("Connected! Getting all airports...");
        var sql = "SELECT airport.airport_id, airport.name, airport.country, airport.description FROM airport";
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }

            if (result.length == 0) {
                console.log("No airports in database")
                return callback("No airports", null)
            }
            
            console.table(result)
            return callback(null, result)
        })
    },
    // .. DELETE an airport
    deleteAirport: function(airport_id, callback) {
        console.log("Connected! Deleting an airport...");
        var params = [airport_id];
        var sql = "DELETE FROM airport WHERE airport_id = ?";
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            console.log(`${result.affectedRows} row has been affected`)
            return callback(null, result.affectedRows)
        })
    },
    
}

module.exports = airportDB