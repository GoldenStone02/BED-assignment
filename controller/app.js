/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

// Import Libraries
const express = require('express');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const app = express(); // create an instance of express

// Import Modules
const User = require('../models/user');
const Airport = require('../models/airport');
const Flight = require('../models/flight');
const Booking = require('../models/booking');
const Transfer = require('../models/transfer');
const Promotion = require('../models/promotion');

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
    * 1st Bonus API - Image uploading and storage
    • Endpoint 12 - POST /users/:id/profile
    • Endpoint 13 - GET /users/:id/profile
    • Endpoint 14 - PUT /users/:id/profile
    • Endpoint 15 - DELETE /users/:id/profile

    * 2nd Bonus API - Promotion
    • Endpoint 16 - POST /promotion
    • Endpoint 17 - GET /promotion/
    • Endpoint 18 - GET /promotion/:id
    • Endpoint 19 - PUT /promotion/:id
    • Endpoint 20 - DELETE /promotion/:id

    • Endpoint 21 - GET /flight (Gets all flights)
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
    var name = req.body.name;
    var country = req.body.country;
    var description = req.body.description;

    Airport.insertAirport(name, country, description, (err, result) => {
        if (err) {
            // Checks for Duplicate Entry
            if (err.code == "ER_DUP_ENTRY") {
                res.status(422).send("422 Unprocessable Entity");
                return;
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(204).send("204 No Content");
        return;
    })
})

// • Endpoint 6 - GET /airport
app.get('/airport', (req, res) => {
    Airport.getAllAirports((err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

// • Endpoint 7 - POST /flight
app.post('/flight', (req, res) => {
    var flightCode = req.body.flightCode
    var aircraft= req.body.aircraft
    var originAirportID = req.body.originAirport
    var destinationAirportID = req.body.destinationAirport
    var embarkDate = req.body.embarkDate
    var travelTime = req.body.travelTime
    var price = req.body.price

    Flight.insertFlight(flightCode, aircraft, originAirportID, destinationAirportID, embarkDate, travelTime, price, (err, result) => {
        if (err) {
            // Checks for Duplicate Entry
            if (err.code == "ER_DUP_ENTRY") {
                res.status(422).send("422 Unprocessable Entity");
                return;
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(201).send({"flight_id": result});
    })
})

// • Endpoint 8 - GET /flightDirect/:originAirportId/:destinationAirportId
app.get('/flightDirect/:originAirportID/:destinationAirportID', (req, res) => {
    var originAirportID = req.params.originAirportID;
    var destinationAirportID = req.params.destinationAirportID;

    Flight.getFlightDirect(originAirportID, destinationAirportID, (err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

// • Endpoint 9 - POST /booking/:userid/:flightid
app.get('/booking/:userid/:flightid', (req, res) => {
    var user_id = req.params.userid
    var flight_id = req.params.flightid
    var name = req.body.name
    var passport = req.body.passport
    var nationality = req.body.nationality
    var age = req.body.age

    Booking.insertBooking(user_id, flight_id, name, passport, nationality, age, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send("500 Internal Server Error");
            return
        }
        res.status(201).send({"booking_id": result});
    })
})

// • Endpoint 10 - DELETE /flight/:id
app.delete('/flight/:id', (req, res) => {
    var flight_id = req.params.id;

    Flight.deleteFlight(flight_id, (err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send({"Message": "Deletion successful"});
    })
})

// • Endpoint 11 - GET /transfer/flight/:originAirportID/:destinationAirportID
// ! WORK IN PROGRESS
app.get('/transfer/flight/:originAirportID/:destinationAirportID', (req, res) => {
    var originAirportID = req.params.originAirportID;
    var destinationAirportID = req.params.destinationAirportID;

    Transfer.getTransferFlights(originAirportID, destinationAirportID, (err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(201).send(result);
    })
})

// 2 Bonus APIs
// ! EVERYTHING BELOW IS WORK IN PROGRESS
// ! DO NOT USE YET

// # Image uploading and storage
// # Used express file upload

// • Endpoint 12 - POST /users/:id/profile
app.post('/users/:id/profile', (req, res) => {
    
})
// • Endpoint 13 - GET /users/:id/profile

// • Endpoint 14 - PUT /users/:id/profile

// • Endpoint 15 - DELETE /users/:id/profile


// # Promotion API

// • Endpoint 16 - POST /promotion
app.post('/promotion', (req, res) => {
    var flight_id = req.body.flight_id
    var start_date = req.body.start_date
    var end_date = req.body.end_date
    var discount = req.body.discount

    Promotion.insertPromotion((err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(201).send({"promotion_id": result});
    })
})

// • Endpoint 17 - GET /promotion/

// • Endpoint 18 - GET /promotion/:id

// • Endpoint 19 - PUT /promotion/:id

// • Endpoint 20 - DELETE /promotion/:id


// ! NOT PART OF REQUIREMENT
// • Endpoint 21 - GET /flight (Gets all flights)
app.get('/flight', (req, res) => {
    Flight.getAllFlights((err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

module.exports = app