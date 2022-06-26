# SP Air
This my CA1 assignment for my backend development module where we're supposed to layout the backend foundations for a fullstack web application using Express and MySQL.

## Features
These are the features that are included in the project.
### Basic Endpoints
- `Endpoint 1 - POST /users`
- `Endpoint 2 - GET /users`
- `Endpoint 3 - GET /users/:id`
- `Endpoint 4 - PUT /users/:id`
- `Endpoint 5 - POST /airport`
- `Endpoint 6 - GET /airport`
- `Endpoint 7 - POST /flight`
- `Endpoint 8 - GET /flightDirect/:originAirportId/:destinationAirportId`
- `Endpoint 9 - POST /booking/:userid/:flightid`
- `Endpoint 10 - DELETE /flight/:id`
- `Endpoint 11 - GET /transfer/flight/:originAirportId/:destinationAirportId`


### Advanced Features
- Filters the optimal transfer flight with criterias such as `embarkDate` and `price` from the database.
- Additional Validation within endpoints
- Image Uploading and Storage
    - `Endpoint 1 - POST /users`
    - `Endpoint 4 - PUT /users/:id`
- Promotion for flights
    - `Endpoint 12 - POST /promotion`
    - `Endpoint 13 - GET /promotion/`
    - `Endpoint 14 - DELETE /promotion/:id`
    - `Endpoint 15 - GET /promotion/flight/:flightid`
    - `Endpoint 16 - POST /promotion/:promotionid/flight/:flightid`
    - `Endpoint 17 - DELETE /promotion/flight/:flightid `
- Review for flights
    - `Endpoint 18 - POST /review/:flightid/:userid`
    - `Endpoint 19 - GET /review/:flightid`
- Additional Endpoints
    - `Endpoint 20 - GET /flight (Gets all flights)`

## File Structure
```
BED Project/
├── controller/                 # App Routes
│   └── app.js
├── db/                         # Database Setup
│   └── db_init.sql
├── img/                        # Image Storage
├── models/                     # Models to query the DB
│   ├── airport.js
│   ├── booking.js
│   ├── databaseConfig.js
│   ├── flight.js
│   ├── image.js                # Image Checker
│   ├── promotion.js            # Bonus Requirement
│   ├── review.js               # Advanced Feature
│   ├── transfer.js
│   └── user.js
├── node_modules/
├── .gitignore
├── notes.txt                   # Notes taken during the project
├── package-lock.json
├── package.json
├── README.md
└── server.js                   # File to run
```

## Setting Up
- Run `db_init.sql` to build the database schema
- Run `npm i` to install all dependencies in terminal
- `node server.js` to start the server
