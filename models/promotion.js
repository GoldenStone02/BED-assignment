/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const pool = require('../models/databaseConfig')

const promotionDB = {
    insertPromotion: function (callback) {

    },
    getallPromotions: function (callback) {

    },
    getPromotion: function (promotion_id, callback) {
        console.log("Connected! Getting promotion...");
        var params = [promotion_id];
        var sql = `SELECT * FROM promotion WHERE promotion_id = ?`
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            console.table(result)
            return callback(null, result)
        })
    },
    deletePromotion: function (callback) {

    }
}

module.exports = promotionDB