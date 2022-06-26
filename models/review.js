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
        var sql = `INSERT INT O review (flight_id, user_id, rating, review_text) VALUES (?, ?, ?, ?)`
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
        var sql = `SELECT r.review_id, u.user_id, u.username, r.flight_id, r.rating, r.review_text 
        FROM review as r, user as u 
        WHERE r.flight_id = ? AND r.user_id = u.user_id;`
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
    }
}

module.exports = reviewDB