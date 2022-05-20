const db = require('./databaseConfig')

// ! [NOTE] Something is wrong with the database
// * so please fix it soon.

const userDB = {
    // .. POST a new user
    insertUser: function (username, email, contact, password, role, profile_pic_url, callback) {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");
                var params = [username, email, contact, password, role, profile_pic_url];
                // .. Can only be Customer or Admin
                if (role != "Customer" && role != "Admin") {
                    console.log("Invalid role");
                    return callback("Invalid role", null)
                }
                var sql = "INSERT INTO user (username, email, contact, password, role, profile_pic_url) VALUES (?, ?, ?, ?, ?, ?)";
                conn.query(sql, params, (err, result) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    return callback(null, result.affectedRows);
                });
            };
        });
    },
    // .. GET all users
    getAllUsers: (callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");
                var sql = "SELECT user.user_id, user.username, user.email, user.contact, user.role, user.profile_pic_url, user.created_at FROM user";
                conn.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    return callback(null, result);
                });
            };
        })
    },
    // .. GET a single user by userid
    getUser: (callback) => {

    },
    // .. PUT a user by userid
    updateUser: (callback) => {

    }
}

module.exports = userDB