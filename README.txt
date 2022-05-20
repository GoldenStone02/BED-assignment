# Items to do
.. Create the database first
.. Ensure that the tables are linked properly
.. Create the APIs to retrieve the data via POSTMAN
.. be happy

> Requirements
.. Create a MYSQL database with necessary tables
    - Tables include (examples)
        • user
        • flight
        • airport
        • bookings

.. Database design with correct use of primary and foreign keys constraints
.. Create an Expresss server that comply with specs
.. Consume data from MYSQL using the mysql library

> Grading Guidlines
.. Web API endpoints functionalities to access/update and return data upon success or failure (75%)
    • Note: 11 API, with each api awarding 4-10 marks
.. Proper database design (5%)
.. Advanced features (10%)
.. Proper Documentation (10%)

> Components
11 APIs
2 Bonus APIS

* 1st Bonus
• Create endpoint for image uploading/storage and retrieval of product listing from the server. 
• Server should only accept jpg or png images below 1 MB.
! Need to find sources for this method, or referencing it from Hong Yu's work
? Seems likely to be a POST request


* 2nd Bonus
• Create endpoints related to the offering of discounts for promotional periods.
• Your endpoints should include GET, POST, and DELETE. GET endpoints should provide 
• info of promotion period and discount offered for particular flights. 
• Note that the appropriate table(s) should be created in the database and 
• that a flight can have multiple promotional periods.

# Documentation

> File Structure

• BED Project/
    • controller/
        * app.js
    • db/
        * db_init.sql
    • models/
        * airport.js
        * booking.js
        * databaseConfig.js
        * flight.js
       .. promotion.js (Advanced)
        * transfer.js
        * user.js
    • node_modules/
    * package-lock.json
    * package.json
    * server.js
    * README.txt