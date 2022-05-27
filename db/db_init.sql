-- ! The tables below will be the actual tables that will be used in the application
CREATE DATABASE sp_air;

use sp_air;

CREATE TABLE user (
	  user_id INT NOT NULL AUTO_INCREMENT,
    username varchar(100) NOT NULL UNIQUE,
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
    name VARCHAR(45) NOT NULL,
    country VARCHAR(45) NOT NULL,
    description VARCHAR(255) NOT NULL
);

-- Can't trunate the table if booking table is already made
CREATE TABLE flight (
    flight_id INT NOT NULL AUTO_INCREMENT
    flightCode VARCHAR(45) NOT NULL,
    aircraft VARCHAR(45) NOT NULL,
    originAirport INT NOT NULL,
    destinationAirport INT NOT NULL,
    embarkDate VARCHAR(45) NOT NULL,
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
    flight_id INT NOT NULL,
    promotion_start_date VARCHAR(45) NOT NULL,
    promotion_end_date VARCHAR(45) NOT NULL,
    discount_percent INT NOT NULL,
    PRIMARY KEY (promotion_id),
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- # Used for storing of airline logos
CREATE TABLE image (
    image_id INT NOT NULL AUTO_INCREMENT,
    flight_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    PRIMARY KEY (image_id),
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE CASCADE ON UPDATE CASCADE
);
