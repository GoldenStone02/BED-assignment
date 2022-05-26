// Import Libraries
const express = require('express');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const app = express(); // create an instance of express

// const Airport = require('../models/airport');
// const Booking = require('../models/booking');
// const Flight = require('../models/flight');
const User = require('../models/user');


// Middleware
app.use(urlEncodedParser)   // attachs body-parser middleware
app.use(bodyParser.json())    // parse json

// ! Create middleware that ensures the keys are entered in correctly

/* Endpoints References
# 11 APIs
    • Endpoint 1 - POST /users
    • Endpoint 2 - GET /users
    • Endpoint 3 - GET /users/:id
    • Endpoint 4 - PUT /users/:id
    • Endpoint 5 - POST /airport
    • Endpoint 6 - GET /airport
    • Endpoint 7 - POST /flight
    • Endpoint 8 - GET /flightDirect/:originAirportId/:destinationAirportId
    • Endpoint 9 - POST /booking/:userid/:flightid
    • Endpoint 10 - DELETE /flight/:id
    • Endpoint 11 - GET /transfer/flight/:originAirportId/:destinationAirportId
# 2 Bonus APIs
    • Endpoint 12 - POST
    • Endpoint 13
*/

// • Endpoint 1 - POST /users/
app.post('/users', (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var contact = req.body.contact;
    var password = req.body.password;
    var role = req.body.role;
    var profile_pic_url = req.body.profile_pic_url;

    User.insertUser(username, email, contact, password, role, profile_pic_url, (err, result) => {
        if (err) {
            // Checks for Duplicate Entry
            if (err.code == "ER_DUP_ENTRY") {
                res.status(422).send("422 Unprocessable Entity");
                return;
            }
            res.status(500).send("500 Internal Server Error");
        }
        else {
            console.log(result)
            res.status(201).send(`${result} user added`);
        };
    });
})

// • Endpoint 2 - GET /users/
app.get('/users', (req, res) => {
    User.getAllUsers((err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    });
})

// • Endpoint 3 - GET /users/:id
app.get('/users/:id', (req, res) => {
    var user_id = req.params.id;
    User.getUser(user_id, (err, result) => {
        if (err) {
            // Checks if user is in the database
            if (err == "User not found") {
                res.status(404).send("404 Not Found");
                return;
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

// • Endpoint 4 - PUT /users/:id
app.put('/users/:id', (req, res) => {
    var user_id = req.params.id;
    var username = req.body.username;
    var email = req.body.email;
    var contact = req.body.contact;
    var password = req.body.password;
    var role = req.body.role;       // # [NOTE] Customer shouldn't be able to change to admin
    var profile_pic_url = req.body.profile_pic_url;

    User.updateUser(user_id, username, email, contact, password, role, profile_pic_url, (err, result) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                res.status(422).send("422 Unprocessable Entity");
                return;
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        // # Note, it doesn't show the content
        res.status(204).send("204 No Content");
    })
})

// • Endpoint 5 - POST /airport
app.post('/airport', (req, res) => {

})

// • Endpoint 6 - GET /airport
app.get('/airport', (req, res) => {

})

// • Endpoint 7 - POST /flight
app.get('/flight', (req, res) => {

})

// • Endpoint 8 - GET /flightDirect/:originAirportId/:destinationAirportId
app.get('/flightDirect/:originAirportId/:destinationAirportId', (req, res) => {

})

// • Endpoint 9 - POST /booking/:userid/:flightid
app.get('/booking/:userid/:flightid', (req, res) => {

})

// • Endpoint 10 - DELETE /flight/:id
app.delete('/flight/:id', (req, res) => {

})

// • Endpoint 11 - GET /transfer/flight/:originAirportId/:destinationAirportId
app.get('/transfer/flight/:originAirportId/:destinationAirportId', (req, res) => {

})

// 2 Bonus APIs

module.exports = app