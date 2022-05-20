# SP Air
An assignment for my backend development module where we're supposed to layout the backend foundations for a fullstack web application using Express and MySQL.


## Features
### Extra Features


## File Structure
```
BED Project/
├── controller/                 # App Routes
│   └── app.js
├── db/                         # Database Setup
│   └── db_init.sql
├── models/                     # Models to query the DB
│   ├── airport.js
│   ├── booking.js
│   ├── databaseConfig.js
│   ├── flight.js
│   ├── promotion.js            # Advanced Feature
│   ├── transfer.js
│   └── user.js
├── node_modules/
├── .gitignore
├── notes.txt
├── package-lock.json
├── package.json
├── README.md
└── server.js                   # File to run
```

## Setting Up
- Run `db_init.sql` to build the database schema
- `node server.js` to start the server
