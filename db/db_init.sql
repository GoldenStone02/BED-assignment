-- ! The tables below will be the actual tables that will be used in the application
DROP SCHEMA IF EXISTS `sp_air`;

CREATE DATABASE sp_air;

use sp_air;

CREATE TABLE user (
	user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    contact VARCHAR(8) NOT NULL,
    password VARCHAR(45) NOT NULL,
    role VARCHAR(45) NULL,
    profile_pic_url VARCHAR(45) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id)
);

CREATE TABLE airport (
	airport_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL UNIQUE,
    country VARCHAR(45) NOT NULL,
    description VARCHAR(255) NOT NULL,
    PRIMARY KEY (airport_id)
);

-- Can't trunate the table if booking table is already made
CREATE TABLE flight (
    flight_id INT NOT NULL AUTO_INCREMENT,
    flightCode VARCHAR(45) NOT NULL,
    aircraft VARCHAR(45) NOT NULL,
    originAirport INT NOT NULL,
    destinationAirport INT NOT NULL,
    embarkDate DATETIME NOT NULL,
    travelTime VARCHAR(45) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (flight_id),
    FOREIGN KEY (originAirport) REFERENCES airport(airport_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (destinationAirport) REFERENCES airport(airport_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE booking (
    booking_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    flight_id INT NOT NULL,
    name VARCHAR(45) NOT NULL,
    passport VARCHAR(45) NOT NULL,
    nationality VARCHAR(45) NOT NULL,
    age INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (booking_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- .. Bonus Features to be added
CREATE TABLE promotion (
    promotion_id INT NOT NULL AUTO_INCREMENT,
    promotion_name VARCHAR(45) NOT NULL,
    promotion_description VARCHAR(255) NOT NULL,
    promotion_start_date DATETIME NOT NULL,
    promotion_end_date DATETIME NOT NULL,
    discount_percent INT NOT NULL,
    PRIMARY KEY (promotion_id)
);

-- # Flight Promo Many to Many table.
CREATE TABLE flight_promotion (
    flight_id INT NOT NULL,
    promotion_id INT NOT NULL,
    PRIMARY KEY (flight_id, promotion_id),
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (promotion_id) REFERENCES promotion(promotion_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ! Might use this for a later feature
-- # Review Flights
CREATE TABLE review (
    review_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    flight_id INT NOT NULL,
    rating INT NOT NULL,
    review_text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (review_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE NO ACTION ON UPDATE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- -- ! Not used currently
-- -- # Used for storing of airport logos
-- CREATE TABLE image (
--     image_id INT NOT NULL AUTO_INCREMENT,
--     flight_id INT NOT NULL,
--     image_url VARCHAR(255) NOT NULL,
--     PRIMARY KEY (image_id),
--     FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- .. Adding of dummy data
-- # Add users
INSERT INTO user (username, email, contact, password, role, profile_pic_url) 
VALUES ('admin', 'admin@sp_air.com', '12345678', 'password123', 'Admin', './img/default.png');
INSERT INTO user (username, email, contact, password, role, profile_pic_url)
VALUES ('user', 'user@sp_air.com', '12345678', 'password123', 'Customer', './img/default.png');
INSERT INTO user (username, email, contact, password, role, profile_pic_url)
VALUES ('UltraRaptor', 'ultraraptor@sp_air.com', '12345678', 'password123', 'Customer', './img/default.png');

-- # Add airports
INSERT INTO airport (name, country, description) VALUES ('Changi Airport', 'Singapore', 'Main International Airport of Singapore');
INSERT INTO airport (name, country, description) VALUES ('Penang International Airport', 'Malaysia', 'Main International Airport of the State of Penang');
INSERT INTO airport (name, country, description) VALUES ('San Francisco International Airport', 'USA', 'International Airport located in San Francisco, California');
INSERT INTO airport (name, country, description) VALUES ('Narita International Airport', 'Japan', 'International Airport located in Narita, Chiba, Tokyo');
INSERT INTO airport (name, country, description) VALUES ('Sydney Kingsford Smith Airport', 'Sydney', 'International Airport located in Mascot, New South Wales, Australia');

-- # Add flights
INSERT INTO flight (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price) 
VALUES ("SP110", "BOEING 737", 1, 2, STR_TO_DATE("22-12-2022 08:20", "%d-%m-%Y %H:%i:%s"), "6 hours 50 mins", 855.5);
INSERT INTO flight (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price) 
VALUES ("SP150", "BOEING 777", 2, 3, STR_TO_DATE("22-12-2022 22:00", "%d-%m-%Y %H:%i:%s"), "8 hours 50 mins", 1050.99);
INSERT INTO flight (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price) 
VALUES ("SP230", "BOEING 777", 1, 2, STR_TO_DATE("22-12-2022 10:00", "%d-%m-%Y %H:%i:%s"), "6 hours 50 mins", 800);
INSERT INTO flight (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price) 
VALUES ("SP250", "BOEING 777", 1, 4, STR_TO_DATE("22-12-2022 10:00", "%d-%m-%Y %H:%i:%s"), "6 hours 20 mins", 750.99);
INSERT INTO flight (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price) 
VALUES ("SP119", "BOEING 777", 4, 3, STR_TO_DATE("22-12-2022 10:00", "%d-%m-%Y %H:%i:%s"), "8 hours 20 mins", 800);
INSERT INTO flight (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price) 
VALUES ("SP119", "BOEING 777", 4, 3, STR_TO_DATE("22-12-2022 10:00", "%d-%m-%Y %H:%i:%s"), "8 hours 20 mins", 725);
INSERT INTO flight (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price) 
VALUES ("SP222", "BOEING 737", 2, 3, STR_TO_DATE("23-12-2022 10:00", "%d-%m-%Y %H:%i:%s"), "8 hours 20 mins", 1000);
INSERT INTO flight (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price) 
VALUES ("SP222", "BOEING 737", 1, 5, STR_TO_DATE("25-12-2022 21:00", "%d-%m-%Y %H:%i:%s"), "13 hours 30 mins", 1000);

-- # Add bookings
INSERT INTO booking (user_id, flight_id, name, passport, nationality, age) 
VALUES (2, 1, "Kenneth Tan", "E1234555Z", "Singaporean", 20);
INSERT INTO booking (user_id, flight_id, name, passport, nationality, age) 
VALUES (2, 1, "Soh Hong Yu", "T1234555Z", "Singaporean", 69);

-- # Add promotions
INSERT INTO promotion (promotion_name, promotion_description, promotion_start_date, promotion_end_date, discount_percent)
VALUES ("Christmas Sale","Sale that happens only on the month of Christmas", "2022-12-10", "2022-12-31", 30);
INSERT INTO promotion (promotion_name, promotion_description, promotion_start_date, promotion_end_date, discount_percent)
VALUES ("New Years Special!", "Enjoy a 50% Discount to your flights", "2023-1-1", "2023-1-31", 50);
INSERT INTO promotion (promotion_name, promotion_description, promotion_start_date, promotion_end_date, discount_percent)
VALUES ("Singapore National Day Offer","50% Discount on the month of National Day for Singapore", "2022-8-1", "2022-8-31", 50);

-- # Add flight_promotions
INSERT INTO flight_promotion (flight_id, promotion_id) VALUES (1, 1);
INSERT INTO flight_promotion (flight_id, promotion_id) VALUES (2, 1);

-- # Add reviews
INSERT INTO review (user_id, flight_id, rating, review_text) VALUES (2, 1, 5, "This is a great flight");
INSERT INTO review (user_id, flight_id, rating, review_text) VALUES (3, 1, 5, "It was amazing!");