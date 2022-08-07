# SP Air
This my CA2 assignment for my backend development module where we're supposed to layout the backend foundations for a fullstack web application using Express and MySQL.
We would then create our frontend using HTML, CSS and Bootstrap, and connect it to our database using JQuery and Axios.

## Setting Up
- Run `npm i` to install all dependencies in terminal
- Run `db_init.sql` to build the database schema
- Update `.env` with your desired hosting port, DB user and password
- `node server.js` to start the server

## Modules and Libraries Used
- Bootstrap
- Axios
- JQuery
- Font Awesome
- VantaJS
- MomentJS

## Endpoints
These are the features that are included in the project.
### Basic Endpoints
- `Endpoint 1 - POST /users`
- `Endpoint 2 - GET /users`
- `Endpoint 3 - GET /users/:id`
- `Endpoint 4 - PUT /users/:id`
- `Endpoint 5 - POST /airport`
- `Endpoint 6 - GET /airport`
- `Endpoint 7 - POST /flight`
- `Endpoint 8 - GET /flightDirect/:date/:originAirportId/:destinationAirportId`
- `Endpoint 9 - POST /booking/:userid/:flightid`
- `Endpoint 10 - DELETE /flight/:id`
- `Endpoint 11 - GET /transfer/flight/:originAirportId/:destinationAirportId`


### Additional Endpoints
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
    - `Endpoint 17 - DELETE /promotion/flight/:flightid`
- Review for flights
    - `Endpoint 18 - POST /review/:flightid/:userid`
    - `Endpoint 19 - GET /review/:flightid`
- Additional Endpoints
    - `Endpoint 20 - GET /flight (Gets all flights)`
- Additional APIs for Admin Panel
    - `Endpoint 21 - GET /admin/users`
    - `Endpoint 21 - GET /review/`
    - `Endpoint 22 - GET /booking`
    - `Endpoint 23 - GET /promotion/flight`
    - `Endpoint 24 - DEL /user/:userid`
    - `Endpoint 25 - DEL /airport/:airportid`
    - `Endpoint 26 - DEL /booking/:bookingid`
    - `Endpoint 27 - DEL /review/:reviewid`
- Additional APIs for Flight Details 
    - `Endpoint 28 - GET /airport/:airportid`
    - `Endpoint 29 - GET /flight/:flightid`
    - `Endpoint 30 - GET /promotion/:promotionid`
    - `Endpoint 31 - GET /booking/:bookingid`

## File Structure
```
BED Project/
├── auth/                       # Authentication [CA2]
│   └── verifyToken.js
├── controller/                 # App Endpoints and Routing [CA2]
│   └── app.js
├── db/                         # Database Setup
│   └── db_init.sql
├── img/                        # Server-side Image Storage
├── models/                     # Models to query the DB
│   ├── airport.js
│   ├── booking.js
│   ├── databaseConfig.js
│   ├── flight.js
│   ├── image.js                # Image Checker
│   ├── promotion.js            # Bonus Requirement [CA1]
│   ├── review.js               # Advanced Feature [CA1]
│   ├── transfer.js
│   └── user.js
├── node_modules/
├── public/                     # Folder that is served publicly [CA2]
│   ├── css/
│   ├── img/                    # Static website images
│   ├── js/                     # JQuery and Axios API calls
│   ├── admin.html
│   ├── ...
│   └── index.html              # HTML files in /public
├── .env                        # Environmental Variables
├── .env.sample                 # Instructions for setting up .env
├── .gitignore
├── notes.txt                   # Notes taken during the project
├── package-lock.json
├── package.json
├── README.md
└── server.js                   # File to startup server
```


## Test Accounts
| Email | Password | Role
| --- | --- | --- |
| admin@sp_air.com | password123 | Admin |
| user@sp_air.com | password123 | customer |
| ultraraptor@sp_air.com | password123 | customer |
