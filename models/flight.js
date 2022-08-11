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
            console.table(result[1])                    // prints result[1], which is the last inserted flight
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
            if (result.length == 0) {
                console.log("No flight in database")
                return callback("No flights", null)
            }
            console.table(result)
            return callback(null, result);
        })
    },
    // .. GET flight information
    getFlightDirect: function (origin_airport_id, destination_airport_id, givenDate, callback) {
        console.log("Connected! Getting flight information...");
        var params = [origin_airport_id, destination_airport_id, givenDate, givenDate];
        var sql = `
        SELECT f.flight_id, f.flightCode, f.aircraft, a1.name as originAirport, a2.name as destinationAirport, f.embarkDate, f.travelTime, f.price, a1.country as originCountry, a2.country as destinationCountry
        FROM flight as f, airport as a1, airport as a2 
        WHERE originAirport = ? AND destinationAirport = ? 
        AND f.originAirport = a1.airport_id AND f.destinationAirport = a2.airport_id
        AND f.embarkDate >= ? AND f.embarkDate < DATE_ADD(?, INTERVAL 1 DAY)`;

        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            if (result.length == 0) {
                console.log("No flights found")
                return callback("No flights found")
            }
            

            console.table(result)
            return callback(null, result)
        })
    },
    // .. GET flight by id
    getFlightById: function (flight_id, callback) {
        console.log("Connected! Getting flight information...");
        var params = [flight_id];
        var sql = `
        SELECT f.flight_id, f.flightCode, f.aircraft, a1.name as originAirport, a2.name as destinationAirport, f.embarkDate, f.travelTime, f.price, a1.country as originCountry, a2.country as destinationCountry
        FROM flight as f, airport as a1, airport as a2 
        WHERE f.flight_id = ? 
        AND f.originAirport = a1.airport_id AND f.destinationAirport = a2.airport_id`;

        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            if (result.length == 0) {
                console.log("No flights found")
                return callback("No flights", null)
            }
            console.table(result)
            return callback(null, result)
        }
        )
    },
    // .. DELETE flights and its associated bookings
    deleteFlight: function (flight_id, callback) {
        console.log("Connected! Deleting flight...");
        var sql = "DELETE FROM booking WHERE flight_id = ?; DELETE FROM flight WHERE flight_id = ?; DELETE FROM review WHERE flight_id = ?";
        pool.query(sql, [flight_id, flight_id, flight_id], (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            var affectedRows = result[0].affectedRows + result[1].affectedRows;
            console.log(`${affectedRows} row has been affected`);
            return callback(null, affectedRows)
        })
    },
}

module.exports = flightDB