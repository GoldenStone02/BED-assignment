/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

// Import Libraries
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const app = express(); // create an instance of express

// Import Modules
const User = require('../models/user');
const Airport = require('../models/airport');
const Flight = require('../models/flight');
const Booking = require('../models/booking');
const Transfer = require('../models/transfer');
const Promotion = require('../models/promotion');
const Image = require('../models/image')
const Review = require('../models/review')

// Middleware
app.use(fileUpload())         // attachs file-upload middleware
app.use(urlEncodedParser)     // attachs body-parser middleware
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
    # It has been integrated into Endpoint 1 - POST /users and Endpoint 4 - PUT /users/:id

    * 2nd Bonus API - Promotion
    ! Need to figure out proper APIs for promotion
    • Endpoint 12 - POST /promotion
    • Endpoint 13 - GET /promotion/
    • Endpoint 14 - DELETE /promotion/:id
    • Endpoint 15 - GET /promotion/flight/:flightid
    • Endpoint 16 - POST /promotion/:promotionid/flight/:flightid
    • Endpoint 17 - DELETE /promotion/flight/:flightid

    * User Reviews for Flights
    • Endpoint 18 - POST /review/:flightid/:userid
    • Endpoint 19 - GET /review/:flightid

    * Addtional Quality of Life APIs
    • Endpoint 20 - GET /flight (Gets all flights)
*/

// • Endpoint 1 - POST /users/
app.post('/users', (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var contact = req.body.contact;
    var password = req.body.password;
    var role = req.body.role;
    var profile_picture = "";

    if (req.files != null || req.files != undefined) {
        // Get image from profile_pic_url
        var profile_pic_url = req.files.profile_pic_url;
        profile_picture = Image.checkFile(profile_pic_url, username)
        // Check if the file is an image
        if (profile_picture == "") {
            console.log("Invalid Image File")
            res.status(400).send("400 Bad Request")
            return
        }
    }

    if (profile_picture == "") {
        profile_picture = "./img/default.png"
    }

    User.insertUser(username, email, contact, password, role, profile_picture, (err, result) => {
        if (err) {
            // Checks for Duplicate Entry
            if (err.code == "ER_DUP_ENTRY") {
                res.status(422).send("422 Unprocessable Entity");
                return;
            }
            res.status(500).send("500 Internal Server Error");
        }
        else {
            res.status(201).send({"userid": result});
        };
    });
})

// • Endpoint 2 - GET /users/
app.get('/users', (req, res) => {
    User.getAllUsers((err, result) => {
        if (err) {
            if (err == "No users") {
                res.status(200).send({'Message':"No registered users"})
                return
            }
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
                res.status(404).send({"Message": "User not in database"});
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
    var profile_picture = "";

    if (req.files != null || req.files != undefined) {
        // Get image from profile_pic_url
        var profile_pic_url = req.files.profile_pic_url;
        profile_picture = Image.checkFile(profile_pic_url, username)
        // Check if the file is an image
        if (profile_picture == "") {
            console.log("Invalid Image File")
            res.status(400).send("400 Bad Request")
            return
        }
    }

    if (profile_picture == "") {
        profile_picture = "./img/default.png"
    }

    User.updateUser(user_id, username, email, contact, password, role, profile_picture, (err, result) => {
        if (err) {
            if (err == "User not found") {
                res.status(404).send({"Message": "User not in database"});
                return;
            }
            if (err.code == "ER_DUP_ENTRY" || err == "Invalid role") {
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
            if (err == "No airports") {
                res.status(200).send({"Message": "No airport in database"})
                return
            }
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
            if (err == "No flights found") {
                res.status(404).send({"Message":"No flights for given flight directions"})
                return
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

// • Endpoint 9 - POST /booking/:userid/:flightid
app.post('/booking/:userid/:flightid', (req, res) => {
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
// # Image uploading and storage
// # Used express file upload

// # Promotion API

// • Endpoint 12 - POST /promotion
app.post('/promotion', (req, res) => {
    var promo_name = req.body.promo_name
    var promo_description = req.body.promo_description
    var start_date = req.body.start_date
    var end_date = req.body.end_date
    var discount = req.body.discount

    Promotion.insertPromotion(promo_name, promo_description, start_date, end_date, discount, (err, result) => {
        if (err) {

            if (err == "Promotion already exists") {
                res.status(422).send({"Message": "Promotion already exists"})
                return;
            }

            if (err == "Invalid Date") {
                res.status(400).send({"Message": "Invalid Date"});
                return;
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(201).send({"promotion_id": result});
    })
})

// • Endpoint 13 - GET /promotion/
app.get('/promotion', (req, res) => {
    Promotion.getAllPromotions((err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

// • Endpoint 14 - DELETE /promotion/:id
// Delete from promotions & flight_promotions
app.delete('/promotion/:id', (req, res) => {
    var promotion_id = req.params.id;

    Promotion.deletePromotion(promotion_id, (err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send({"Message": "Deletion successful"});
    })
})

// • Endpoint 15 - GET /promotion/flight/:flightid
// Get promotion by flight id
app.get('/promotion/flight/:flightid', (req, res) => {
    var flight_id = req.params.flightid;

    Promotion.getPromotionByFlightID(flight_id, (err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

// • Endpoint 16 - POST /promotion/:promotionid/flight/:flightid
app.post('/promotion/:promotionid/flight/:flightid', (req, res) => {
    var flight_id = req.params.flightid;
    var promotion_id = req.params.promotionid;

    Promotion.insertPromotionByFlightID(flight_id, promotion_id, (err, result) => {
        if (err) {
            if (err == "Flight not in promotion period") {
                res.status(400).send({"Message": "Flight not in promotion period"})
                return;
            }
            if (err.code == "ER_DUP_ENTRY") {
                res.status(422).send({"Message": "Flight already in promotion"})
                return;
            }

            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(201).send({"Message": "Promotion added to flight"});
    })
})

// • Endpoint 17 - DELETE /promotion/flight/:flightid
// Delete flight from flight_promotions
app.delete('/promotion/flight/:flightid', (req, res) => {
    var flight_id = req.params.flightid;

    Promotion.deleteFlightPromotion(flight_id, (err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send({"Message": "Deletion successful"});
    })
})

// # Review API

// • Endpoint 18 - POST /review/:flightid/:userid
app.post('/review/:flightid/:userid', (req, res) => {
    var flight_id = req.params.flightid;
    var user_id = req.params.userid;
    var rating = req.body.rating;
    var review = req.body.review;

    Review.insertReview(flight_id, user_id, rating, review, (err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(201).send({"review_id": result});
    })
})

// • Endpoint 19 - GET /review/:flightid
app.get('/review/:flightid', (req, res) => {
    var flight_id = req.params.flightid;

    Review.getReviewsForFlight(flight_id, (err, result) => {
        if (err) {

            if (err == "No reviews") {
                res.status(404).send({"Message": "No reviews for this flight"})
                return;
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

// ! NOT PART OF REQUIREMENT
// • Endpoint 20 - GET /flight (Gets all flights)
app.get('/flight', (req, res) => {
    Flight.getAllFlights((err, result) => {
        if (err) {
            if (err == "No flights") {
                res.status(200).send({"Message": "No flights in database"})
                return
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

module.exports = app