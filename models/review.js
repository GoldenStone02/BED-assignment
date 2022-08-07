/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const pool = require('../models/databaseConfig')

const reviewDB = {
    // .. POST /review/:flightid/:userid
    insertReview: function (flight_id, user_id, rating, review, callback) {
        var params = [flight_id, user_id, rating, review];
        // ! NOTE: There was an error over here. 
        var sql = `INSERT INTO review (flight_id, user_id, rating, review_text) VALUES (?, ?, ?, ?)`
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            console.table(result)
            return callback(null, result.insertId);
        })
    },
    // .. GET /review/:flightid
    getReviewsForFlight: function (flight_id, callback) {
        var params = [flight_id]
        var sql = `SELECT r.review_id, u.user_id, u.username, r.flight_id, r.rating, r.review_text, r.created_at
        FROM review as r, user as u 
        WHERE r.flight_id = ? AND r.user_id = u.user_id
        ORDER BY r.created_at DESC;`
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }

            if (result.length == 0) {
                console.log("No review in database")
                return callback("No reviews", null)
            }

            console.table(result)
            return callback(null, result);
        })
    },
    getAllReview: function (callback) {
        var sql = `SELECT r.review_id, u.user_id, u.username, r.flight_id, r.rating, r.review_text
        FROM review as r, user as u 
        WHERE r.user_id = u.user_id;`
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }

            if (result.length == 0) {
                console.log("No review in database")
                return callback("No reviews", null)
            }

            console.table(result)
            return callback(null, result);
        })
    },
    deleteReview: function (review_id, callback) {
        var sql = `DELETE FROM review WHERE review_id = ?`
        pool.query(sql, [review_id], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            console.log(`${result.affectedRows} row has been affected`);
            console.table(result)
            return callback(null, result.affectedRows);
        })
    }
}

module.exports = reviewDB