/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const pool = require('../models/databaseConfig')

const bookingDB = {
    // .. POST a new booking
    insertBooking: function (user_id, flight_id, name, passport, nationality, age, promotion_id, callback) {
        console.log("Connected! Inserting a new booking...");
        var params = [user_id, flight_id, name, passport, nationality, age, promotion_id];
        var sql = `
        INSERT INTO booking (user_id, flight_id, name, passport, nationality, age, promotion_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            console.log(`${result.affectedRows} row has been affected`);
            console.table(result)
            return callback(null, result.insertId);
        })
    },
    getBookingById: function (user_id, callback) {
        console.log("Connected! Getting a booking by booking_id...");
        var params = [user_id];
        var sql = `
        SELECT booking.booking_id, booking.user_id, booking.flight_id, booking.name, booking.passport, booking.nationality, booking.age, booking.created_at, booking.promotion_id FROM booking WHERE user_id = ?
        `
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            if (result.length == 0) {
                console.log("No booking with this booking_id")
                return callback("No booking", null)
            }
            console.table(result)
            return callback(null, result)
        })
    },
    getAllBookings: function (callback) {
        console.log("Connected! Getting all bookings...");
        var sql = `SELECT booking.booking_id, booking.user_id, booking.flight_id, booking.name, booking.passport, booking.nationality, booking.age, booking.created_at, booking.promotion_id FROM booking
        `;
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            if (result.length == 0) {
                console.log("There are no bookings.")
                return callback("No bookings", null)
            }
            console.table(result)
            return callback(null, result);
        })
    }, 
    deleteBooking: function (booking_id, callback) {
        console.log("Connected! Deleting booking...");
        var sql = "DELETE FROM booking WHERE booking_id = ?";
        pool.query(sql, [booking_id], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            console.log(`${result.affectedRows} row has been affected`);
            console.table(result)
            return callback(null, result.affectedRows);
        })
    },
}


module.exports = bookingDB 