/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/


const pool = require('../models/databaseConfig')

const promotionDB = {
    insertPromotion: function (promo_name, promo_description, start_date, end_date, discount_percent, callback) {
        console.log("Connected! Inserting a new promotion...");
        if (start_date > end_date) {
            console.log("Start date must be before end date");
            return callback("Invalid Date", null)
        }

        var params = [promo_name, promo_description, start_date, end_date, discount_percent, start_date, end_date];
        var sql = `INSERT INTO promotion (promotion_name, promotion_description, promotion_start_date, promotion_end_date, discount_percent)
        SELECT * FROM (SELECT ? as promotion_name, ? as promotion_description, ? as promotion_start_date, ? as promotion_end_date, ? as discount_percent) as tmp
        WHERE NOT EXISTS (SELECT * FROM promotion WHERE promotion_start_date = ? AND promotion_end_date = ?);`;
        
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            
            // Checks if any data gets inserted, if not then it means that the promotion already exists
            if (result.affectedRows == 0) {
                return callback("Promotion already exists", null)
            }

            console.table(result)
            console.log(`${result.affectedRows} row has been affected`);
            return callback(null, result.insertId);
        })
    },
    getAllPromotions: function (callback) {
        console.log("Connected! Getting all promotions...");
        var sql = `SELECT * FROM promotion ORDER BY promotion_start_date`;
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            console.table(result)
            return callback(null, result);
        })
    },
    getPromotionById: function (promotion_id, callback) {
        console.log("Connected! Getting a promotion by promotion_id...");
        var sql = `SELECT * FROM promotion WHERE promotion_id = ?`;
        pool.query(sql, [promotion_id], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            console.table(result)
            return callback(null, result);
        })
    },
    deletePromotion: function (promotion_id, callback) {
        console.log("Connected! Deleting promotion...");
        var params = [promotion_id, promotion_id]
        var sql = `
        DELETE FROM promotion where promotion_id = ?;
        DELETE FROM flight_promotion where promotion_id = ?;`;
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            console.log(`${result[0].affectedRows + result[1].affectedRows} row has been affected`);    
            return callback(null, result)
        })
    },
    // # For flight_promotion
    getAllFlightPromotion: function (callback) {
        console.log("Connected! Getting all flight promotions...");
        var sql = `SELECT flight_id, promotion_id FROM flight_promotion`;
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            console.table(result)
            return callback(null, result);
        } )
    },
    getPromotionByFlightID: function (flight_id, callback) {
        console.log("Connected! Getting promotion...");
        var params = [flight_id];
        var sql = `
        SELECT fp.flight_id , p.* FROM flight_promotion as fp, promotion as p
        WHERE fp.flight_id = ? AND p.promotion_id = fp.promotion_id
        AND p.promotion_end_date >= CURDATE() 
        ORDER BY p.discount_percent DESC;`;
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            console.table(result)
            return callback(null, result)
        })
    },
    insertPromotionByFlightID: function (flight_id, promotion_id, callback) {
        console.log("Connected! Inserting promotion...");
        var params = [flight_id, promotion_id];
        var sql = `
        SELECT * FROM flight WHERE flight_id = ?;
        SELECT * FROM promotion WHERE promotion_id = ?;
        `
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            // Checks if the flight is within the promotion period
            flight_departure_date = new Date(result[0][0]['embarkDate']);
            promo_start_date = new Date(result[1][0]['promotion_start_date']);
            promo_end_date = new Date(result[1][0]['promotion_end_date']);

            console.table(result[0])
            console.table(result[1])

            // Checks if flight is within the promotion period
            if (flight_departure_date < promo_start_date || flight_departure_date > promo_end_date) {
                console.log("Flight is not within the promotion period")
                return callback("Flight not in promotion period", null)
            }

            params = [flight_id, promotion_id]
            var sql = `INSERT INTO flight_promotion (flight_id, promotion_id) VALUES (?, ?);`
            pool.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err)
                    return callback(err, null)
                }
                console.table(result)
                return callback(null, result.insertId)
            })
        })
    },
    deleteFlightPromotion: function (flight_id, callback) {
        console.log("Connected! Deleting flight promotion...");
        var params = [flight_id];
        var sql = `DELETE FROM flight_promotion where flight_id = ?`;
        pool.query(sql, params,(err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            console.log(`${result.affectedRows} row has been affected`);
            return callback(null, result.affectedRows);
        })
    },
}

module.exports = promotionDB