/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const pool = require('./databaseConfig')

// Accesses the database and returns user table results.
const userDB = {
    // .. POST a new user
    insertUser: function (username, email, contact, password, role, profile_pic_url, callback) {
        console.log("Connected! Inserting a new user...");
        // .. Can only be Customer or Admin
        if (role != "Customer" && role != "admin") {
            console.log("Invalid role");
            return callback("Invalid role", null)
        }
        var params = [username, email, contact, password, role, profile_pic_url];
        var sql = `INSERT INTO user (username, email, contact, password, role, profile_pic_url) VALUES (?, ?, ?, ?, ?, ?);
        SELECT * FROM user WHERE user_id = LAST_INSERT_ID()`;
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            console.log(`${result[0]['affectedRows']} row has been affected`);
            return callback(null, result[1][0]['user_id']);
        });
    },
    // .. GET all users
    getAllUsers: (callback) => {
        console.log("Connected! Getting all users...");
        var sql = "SELECT user.user_id, user.username, user.email, user.contact, user.role, user.profile_pic_url, user.created_at FROM user";
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }

            if (result.length == 0) {
                console.log("There are no registered users.")
                return callback("No users", null)
            }

            console.table(result)
            return callback(null, result);
        });
    },
    // .. GET a single user by userid
    getUser: (user_id, callback) => {
        console.log("Connected! Getting a single user...");
        var sql = "SELECT user.user_id, user.username, user.email, user.contact, user.role, user.profile_pic_url, user.created_at FROM user where user_id = ?";
        pool.query(sql, user_id,(err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            if (result.length == 0) {
                console.log("User not found")
                return callback("User not found", null)
            }
            console.table(result)
            return callback(null, result[0])
        })
    },
    // .. PUT a user by userid
    updateUser: (user_id, username, email, contact, password, role, profile_pic_url, callback) => {
        console.log("Connected! Updating a user...")

        // ! Ensure that customer can't be an Admin
        // Ensure that only admin user_id can bypass this check to change roles
        // user_id = 1 is the admin user
        if (user_id != 1 && role == "admin") {
            console.log("Invalid role");
            return callback("Invalid role", null)
        }

        var sql = `SELECT * FROM user WHERE user_id = ?`;
        pool.query(sql, [user_id], (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }

            if (result.length == 0) {
                console.log("User not found")
                return callback("User not found", null)
            }

            console.log(result)
            // Use previous values if new values are not provided
            // Else, will change the values to the new ones
            var og_values = {
                username: (username == "" || username == undefined) ? result[0].username : username,
                email: (email == "" || email == undefined) ? result[0].email : email,
                contact: (contact == "" || contact == undefined) ? result[0].contact : contact,
                password: (password == "" || password == undefined) ? result[0].password : password,
                role: (role == "" || role == undefined) ? result[0].role : role,
                profile_pic_url: (profile_pic_url == "" || profile_pic_url == undefined) ? result[0].profile_pic_url : profile_pic_url
            }
            console.log(og_values)

            var sql = `UPDATE user SET username = ?, email = ?, contact = ?, password = ?, role = ?, profile_pic_url = ? WHERE user_id = ?;`
            var params = [og_values.username, og_values.email, og_values.contact, og_values.password, og_values.role, og_values.profile_pic_url, user_id];
            pool.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err)
                    return callback(err, null)
                }
                console.log(`${result.affectedRows} row has been affected`)
                return callback(null, result.affectedRows)
            })
        })
    },
    // .. Login a user
    login: (email, password, callback) => {
        console.log("Connected! Logging in a user...");
        var params = [email, password]
        var sql = `SELECT user_id, role FROM user WHERE email  = ? AND password = ?`;
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            if (result.length == 0) {
                console.log("No response")
                return callback("No response", null)
            }
            console.log(result)
            return callback(null, result[0])
        })
    },
}

module.exports = userDB