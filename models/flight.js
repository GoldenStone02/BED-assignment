/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const pool = require('../models/databaseConfig')

const flightDB = {
    // .. POST new flight
    insertFlight: function (flight_code, aircraft, origin_airport_id, destination_airport_id, embark_date, travel_time, price, callback) {
        console.log("Connected! Inserting a new flight...");
        var params = [flight_code, aircraft, origin_airport_id, destination_airport_id, embark_date, travel_time, price];
        // Inserts a new flight, then gets the new flight
        var sql = "INSERT INTO flight (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price) VALUES (?, ?, ?, ?, ?, ?, ?); SELECT * FROM flight WHERE flight_id = LAST_INSERT_ID()";
        // .. Add a new flight
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            // result[0] is the affected rows
            console.log(`${result[0].affectedRows} row has been affected`);
            console.log(`flight id: ${result[1][0].flight_id}`)     // prints flight id
            console.table(result[1])                // prints result[1], which is the last inserted flight
            return callback(null, result[1][0].flight_id);
        })
    },
    // .. GET all flights
    // ! NOT IN REQUIREMENTS
    getAllFlights: function (callback) {
        console.log("Connected! Getting all flights...");
        // Inserts a new flight, then gets the new flight
        var sql = `
        SELECT f.flight_id, f.flightCode, f.aircraft, a1.name as originAirport, a2.name as destinationAirport, f.embarkDate, f.travelTime, f.price 
        FROM flight as f, airport as a1, airport as a2 
        WHERE f.originAirport = a1.airport_id AND f.destinationAirport = a2.airport_id
        ORDER BY f.flight_id ASC`;
        // .. Get all flights
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            console.table(result)
            return callback(null, result);
        })
    },
    // .. GET flight information
    getFlightDirect: function (origin_airport_id, destination_airport_id, callback) {
        console.log("Connected! Getting flight information...");
        var params = [origin_airport_id, destination_airport_id];
        var sql = `
        SELECT f.flight_id, f.flightCode, f.aircraft, a1.name as originAirport, a2.name as destinationAirport, f.embarkDate, f.travelTime, f.price 
        FROM flight as f, airport as a1, airport as a2 
        WHERE originAirport = ? AND destinationAirport = ? 
        AND f.originAirport = a1.airport_id AND f.destinationAirport = a2.airport_id`;

        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            console.table(result[1])
            return callback(null, result[1])
        })
    },
    // .. DELETE flights and its associated bookings
    deleteFlight: function (flight_id, callback) {
        console.log("Connected! Deleting flight...");
        var sql = "DELETE FROM booking WHERE flight_id = ?; DELETE FROM flight WHERE flight_id = ?";
        pool.query(sql, [flight_id, flight_id], (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            var affectedRows = result[0].affectedRows + result[1].affectedRows;
            console.log(`${affectedRows} row has been affected`);
            return callback(null, affectedRows)
        })
    }
}

module.exports = flightDB