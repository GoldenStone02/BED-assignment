// Import Libraries
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const cors = require('cors')    // Utilize for multiple
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config.js');
const path = require('path');
const app = express(); // Create an instance of express

// Import Modules
const User = require('../models/user');
const Airport = require('../models/airport');
const Flight = require('../models/flight');
const Booking = require('../models/booking');
const Transfer = require('../models/transfer');
const Promotion = require('../models/promotion');
const Image = require('../models/image')
const Review = require('../models/review');
const verifyToken = require('../auth/verifyToken');

// Middleware
app.use(fileUpload())         // attachs file-upload middleware
app.use(urlEncodedParser)     // attachs body-parser middleware
app.use(bodyParser.json())    // parse json
app.use(cors())

// Loads content from public folder
// Resources: https://expressjs.com/en/starter/static-files.html
app.use("/img", express.static("img"));
app.use(express.static(path.resolve("./public")))



/* Endpoints References

# Site Routing
    • GET /
    • GET /login
    • POST /login
    • Verify Token
    • Profile
    • Signup
    • Admin Panel
    • Browse Flights
    • Flight Details
    • Error Page
    
    # 11 APIs
    • Endpoint 1 - POST /users
    • Endpoint 2 - GET /users
    • Endpoint 3 - GET /users/:id
    • Endpoint 4 - PUT /users/:id
    • Endpoint 5 - POST /airport
    • Endpoint 6 - GET /airport
    • Endpoint 7 - POST /flight
    • Endpoint 8 - GET /flightDirect/:date/:originAirportId/:destinationAirportId
    • Endpoint 9 - POST /booking/:userid/:flightid
    • Endpoint 10 - DELETE /flight/:id
    • Endpoint 11 - GET /transfer/flight/:originAirportId/:destinationAirportId
# 2 Bonus APIs
    * 1st Bonus API - Image uploading and storage
    # It has been integrated into Endpoint 1 - POST /users and Endpoint 4 - PUT /users/:id

    * 2nd Bonus API - Promotion
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

    * Additional APIs for Admin Panel
    • Endpoint 21 - GET /admin/users
    • Endpoint 21 - GET /review/
    • Endpoint 22 - GET /booking
    • Endpoint 23 - GET /promotion/flight
    • Endpoint 24 - DEL /user/:userid
    • Endpoint 25 - DEL /airport/:airportid
    • Endpoint 26 - DEL /booking/:bookingid
    • Endpoint 27 - DEL /review/:reviewid

    * Additional APIs for Flight Details 
    • Endpoint 28 - GET /airport/:airportid
    • Endpoint 29 - GET /flight/:flightid
    • Endpoint 30 - GET /promotion/:promotionid
    • Endpoint 31 - GET /booking/:bookingid
*/


// ######################################################################################################################
// Site Routing
// • GET /
app.get('/', async (req, res) => {
    try {
        res.status(200).sendFile(path.resolve("./public/index.html"));
    } catch (err) {
        res.status(500).sendFile(path.resolve("./public/404.html"));
    }
});

// • GET /login
app.get('/login', (req, res) => {
    res.sendFile(path.resolve("./public/login.html"));
})

// • POST /login
app.post('/login', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    User.login(email, password, (err, user) => {
        if (err) {
            if (err == "No response") {
                return res.status(401).send();
            }
            return res.status(500).send("500 Internal Server Error")
        }
        const payload = { user_id: user.user_id, role: user.role};
        console.log(payload)
        jwt.sign(
            payload, 
            JWT_SECRET, 
            { algorithm: "HS256" }, 
            (err, token) => {
            if (err) {
                console.log(err);
                return res.status(401).send();
            } 
            return res.status(200).send({
                token: token,
                user_id: user.user_id
            });
        })
    })
});

// • Verify Token
app.get('/verifyHeader', verifyToken, async (req, res) => {
    try {
        if (req.decodedToken == null) {
            return res.status(200).send({
                role: "guest"
            });
        } else {
            return res.status(200).send({
                user_id: req.decodedToken.user_id,
                role: req.decodedToken.role
            });
        }
    } catch (err) {
        console.log(err)
    }
})

// • Profile
app.get('/profile', (req, res) => {
    return res.sendFile(path.resolve("./public/profile.html"));
})

// • Signup
app.get('/signup', (req, res) => {
    return res.sendFile(path.resolve("./public/signup.html"))
})

// • Admin Panel
app.get('/admin-panel', (req, res) => {
    return res.status(200).sendFile(path.resolve("./public/admin.html"));
})

// • Browse Flights
app.get('/browse-flights', (req, res) => {
    return res.sendFile(path.resolve("./public/flight_listing.html"));
})

// • Flight Details
app.get('/flight-details', (req, res) => {
    return res.sendFile(path.resolve("./public/flight_details.html"));
})



// End of Site Routing

// ######################################################################################################################

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
            return res.status(400).send("400 Bad Request")
        }
    }

    if (profile_picture == "") {
        profile_picture = "./img/default.png"
    }

    User.insertUser(username, email, contact, password, role, profile_picture, (err, result) => {
        if (err) {
            // Checks for Duplicate Entry
            if (err.code == "ER_DUP_ENTRY") {
                return res.status(422).send("422 Unprocessable Entity");
            }
            return res.status(500).send("500 Internal Server Error");
        }
        else {
            return res.status(201).send({"userid": result});
        };
    });
})

// • Endpoint 2 - GET /users/
app.get('/users', verifyToken, (req, res) => {
    User.getAllUsers((err, result) => {
        if (err) {
            if (err == "No users") {
                return res.status(200).send({'Message':"No registered users"})
            }
            return res.status(500).send("500 Internal Server Error");
        }
        return res.status(200).send(result);
    });
})

// • Endpoint 3 - GET /users/:id
app.get('/users/:id', verifyToken, (req, res) => {
    var user_id = req.params.id;
    User.getUser(user_id, (err, result) => {
        if (err) {
            // Checks if user is in the database
            if (err == "User not found") {
                return res.status(404).send({"Message": "User not in database"});
            }
            return res.status(500).send("500 Internal Server Error");
        }
        return res.status(200).send(result);
    })
})

// • Endpoint 4 - PUT /users/:id
app.put('/users/:id', verifyToken, (req, res) => {
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
            return res.status(400).send("400 Bad Request")
        }
    }

    if (profile_picture == "") {
        profile_picture = "./img/default.png"
    }

    User.updateUser(user_id, username, email, contact, password, role, profile_picture, (err, result) => {
        if (err) {
            if (err == "User not found") {
                return res.status(404).send({"Message": "User not in database"});
            }
            if (err.code == "ER_DUP_ENTRY" || err == "Invalid role") {
                return res.status(422).send("422 Unprocessable Entity");
            }
            return res.status(500).send("500 Internal Server Error");
        }
        // # Note, it doesn't show the content
        return res.status(204).send("204 No Content");
    })
})

// • Endpoint 5 - POST /airport
app.post('/airport', verifyToken, (req, res) => {
    var name = req.body.name;
    var country = req.body.country;
    var description = req.body.description;

    Airport.insertAirport(name, country, description, (err, result) => {
        if (err) {
            // Checks for Duplicate Entry
            if (err.code == "ER_DUP_ENTRY") {
                return res.status(422).send("422 Unprocessable Entity");
            }
            return res.status(500).send("500 Internal Server Error");
        }
        return res.status(204).send("204 No Content");
    })
})

// • Endpoint 6 - GET /airport
app.get('/airport', (req, res) => {
    Airport.getAllAirports((err, result) => {
        if (err) {
            if (err == "No airports") {
                return res.status(200).send({"Message": "No airport in database"})
            }
            return res.status(500).send("500 Internal Server Error");
        }
        return res.status(200).send(result);
    })
})

// • Endpoint 7 - POST /flight
app.post('/flight', verifyToken, (req, res) => {
    if (req.decodedToken.role != "admin" || req.decodedToken == null) {
        return res.status(403).send("403 Forbidden");
    } else {
        var flightCode = req.body.flightCode
        var aircraft= req.body.aircraft
        var originAirportID = req.body.originAirport
        var destinationAirportID = req.body.destinationAirport
        var embarkDate = req.body.embarkDate
        var travelTime = req.body.travelTime
        var price = req.body.price
    
        Flight.insertFlight(flightCode, aircraft, originAirportID, destinationAirportID, embarkDate, travelTime, price, (err, result) => {
            if (err) {
                return res.status(500).send("500 Internal Server Error");
            }
            return res.status(201).send({"flight_id": result});
        })
    }
})

// [Modified] 
// - Return Country
// • Endpoint 8 - GET /flightDirect/:date/:originAirportId/:destinationAirportId
app.get('/flightDirect/:date/:originAirportID/:destinationAirportID', (req, res) => {
    var originAirportID = req.params.originAirportID;
    var destinationAirportID = req.params.destinationAirportID;
    var givenDate = req.params.date

    // ! Need to modify to query for flights that are on or after th given date
    Flight.getFlightDirect(originAirportID, destinationAirportID, givenDate, (err, result) => {
        if (err) {
            if (err == "No flights found") {
                // # [NOTE] This is a temporary solution
                res.status(200).send({"Message":"No flights for given flight directions"})
                return
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }

        // Filter to ensure that the data given matches the data that was given.


        res.status(200).send(result);
    })
})

// • Endpoint 9 - POST /booking/:userid/:flightid
app.post('/booking/:userid/:flightid', verifyToken, (req, res) => {
    if (req.decodedToken == null) {
        return res.status(403).send("403 Forbidden");
    } else {
        var user_id = req.params.userid
        var flight_id = req.params.flightid
        var name = req.body.name
        var passport = req.body.passport
        var nationality = req.body.nationality
        var age = req.body.age
        var promotion_id = req.body.promotion_id

        Booking.insertBooking(user_id, flight_id, name, passport, nationality, age, promotion_id, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send("500 Internal Server Error");
                return
            }
            res.status(201).send({"booking_id": result});
        })
    }
})

// • Endpoint 10 - DELETE /flight/:id
app.delete('/flight/:id', verifyToken, (req, res) => {
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
app.post('/promotion', verifyToken, (req, res) => {
    if (req.decodedToken.role != "admin" || req.decodedToken == null) {
        return res.status(403).send("403 Forbidden");
    } else {
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
    }
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
app.delete('/promotion/:id', verifyToken, (req, res) => {
    if (req.decodedToken.role != "admin" || req.decodedToken == null) {
        return res.status(403).send("403 Forbidden");
    } else {
        var promotion_id = req.params.id;

        Promotion.deletePromotion(promotion_id, (err, result) => {
            if (err) {
                res.status(500).send("500 Internal Server Error");
                return;
            }
            res.status(200).send({"Message": "Deletion successful"});
        })
    }
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
app.post('/promotion/:promotionid/flight/:flightid', verifyToken, (req, res) => {
    if (req.decodedToken.role != "admin" || req.decodedToken == null) {
        return res.status(403).send("403 Forbidden");
    } else {
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
    }
})

// • Endpoint 17 - DELETE /promotion/flight/:flightid
// Delete flight from flight_promotions
app.delete('/promotion/flight/:flightid', verifyToken, (req, res) => {
    if (req.decodedToken.role != "admin" || req.decodedToken == null) {
        return res.status(403).send("403 Forbidden");
    } else {
        var flight_id = req.params.flightid;

        Promotion.deleteFlightPromotion(flight_id, (err, result) => {
            if (err) {
                res.status(500).send("500 Internal Server Error");
                return;
            }
            res.status(200).send({"Message": "Deletion successful"});
        })
    }
})

// # Review API

// • Endpoint 18 - POST /review/:flightid/:userid
app.post('/review/:flightid/:userid', verifyToken, (req, res) => {
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
                res.status(200).send({"Message": "No reviews for this flight"})
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

// • Endpoint 21 - GET /review/
app.get('/review/', (req, res) => {

    Review.getAllReview((err, result) => {
        if (err) {

            if (err == "No reviews") {
                res.status(200).send({"Message": "No reviews for this flight"})
                return;
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})


// • Endpoint 22 - GET /booking
app.get('/booking', verifyToken, (req, res) => {
    Booking.getAllBookings((err, result) => {
        if (err) {
            if (err == "No bookings") {
                res.status(200).send({"Message": "No bookings in database"})
                return
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

// • Endpoint 23 - GET /promotion/flight
app.get('/promotion/flight', verifyToken, (req, res) => {
    Promotion.getAllFlightPromotion((err, result) => {
        if (err) {
            if (err == "No promotions") {
                res.status(200).send({"Message": "No promotions in database"})
                return
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})


// • Endpoint 24 - DEL /user/:userid
app.delete("/user/:userid", verifyToken, (req, res) => {
    var user_id = req.params.userid;

    if (req.decodedToken.role != "admin" || req.decodedToken == null) {
        return res.status(403).send("403 Forbidden");
    } else {
        var user_id = req.params.userid;

        User.deleteUser(user_id, (err, result) => {
            if (err) {
                if (err == "Cannot delete admin") {
                    res.status(400).send({"Message": "Cannot delete admin"})
                    return;
                }
                res.status(500).send("500 Internal Server Error");
                return;
            }
            
            res.status(200).send({"Message": "Deletion successful"});
        })
    }
})

// • Endpoint 25 - DEL /airport/:airportid
app.delete('/airport/:airportid', verifyToken, (req, res) => {
    var airport_id = req.params.airportid;
    
    Airport.deleteAirport(airport_id, (err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send({"Message": "Deletion successful"});
    })
})

// • Endpoint 26 - DEL /booking/:bookingid
app.delete('/booking/:bookingid', verifyToken, (req, res) => {
    var booking_id = req.params.bookingid;

    Booking.deleteBooking(booking_id, (err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send({"Message": "Deletion successful"});
    })
})

// • Endpoint 27 - DEL /review/:reviewid
app.delete('/review/:reviewid', verifyToken, (req, res) => {
    var review_id = req.params.reviewid;

    Review.deleteReview(review_id, (err, result) => {
        if (err) {
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send({"Message": "Deletion successful"});
    })
})

// • Endpoint 28 - GET /airport/:airportid
app.get("/airport/:airportid", (req, res) => {
    var airport_id = req.params.airportid;

    Airport.getAirportById(airport_id, (err, result) => {
        if (err) {
            if (err == "No airport") {
                res.status(200).send({"Message": "No airport in database"})
                return
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

// • Endpoint 29 - GET /flight/:flightid
app.get("/flight/:flightid", (req, res) => {
    var flight_id = req.params.flightid;

    Flight.getFlightById(flight_id, (err, result) => {
        if (err) {
            if (err == "No flight") {
                res.status(200).send({"Message": "No flight in database"})
                return
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

// • Endpoint 30 - GET /promotion/:promotionid
app.get("/promotion/:promotionid", (req, res) => {
    var promotion_id = req.params.promotionid;

    Promotion.getPromotionById(promotion_id, (err, result) => {
        if (err) {
            if (err == "No promotion") {
                res.status(200).send({"Message": "No promotion in database"})
                return
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

// • Endpoint 31 - GET /booking/:bookingid
app.get("/booking/:userid", verifyToken, (req, res) => {
    var user_id = req.params.userid;

    Booking.getBookingById(user_id, (err, result) => {
        if (err) {
            if (err == "No booking") {
                res.status(200).send({"Message": "No booking in database"})
                return
            }
            res.status(500).send("500 Internal Server Error");
            return;
        }
        res.status(200).send(result);
    })
})

// #########################################################################################################################

// If user goes to an undefined route, send them to 404
// • Error page
app.get('*', (req, res) => {
    res.status(404).sendFile(path.resolve("./public/404.html"));
});


module.exports = app