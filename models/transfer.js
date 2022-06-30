/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const pool = require('../models/databaseConfig')

const transferDB = {
    // .. GET all transfer flights
    getTransferFlights: function (origin_airport_id, destination_airport_id, callback) {
        console.log("Connected! Getting transfer flights...");
        var params = [origin_airport_id, destination_airport_id, destination_airport_id, origin_airport_id];
        var sql = `
        SELECT f.*, a1.name as originName, a2.name as transferName FROM flight as f, airport as a1, airport as a2 
        WHERE originAirport = ? AND destinationAirport != ?
        AND f.originAirport = a1.airport_id AND f.destinationAirport = a2.airport_id; 

        SELECT f.*, a1.name as transferName, a2.name as destName FROM flight as f, airport as a1, airport as a2 
        WHERE destinationAirport = ? AND originAirport != ?
        AND f.originAirport = a1.airport_id AND f.destinationAirport = a2.airport_id; `;

        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            
            // # Details such as embarkDate and travelTime will be a factor in the actual build

            // Gets the flight_id for the transfers airports from the second query.
            var transfer_arr = result[1].map((element) => {
                return element.originAirport
            })
            console.log(transfer_arr)
            
            var output = []

            // forEach is like a python for loop, where every element in the array is iterated through.
            // Except without the index value.

            // For every element within the first query,
            // check if the flight_id is in the transfer_arr
            result[0].forEach((e) => {
                let index = transfer_arr.indexOf(e.destinationAirport)
                // If flight_id isn't in transfer_arr, it'll return -1
                // else, push the data into output array
                if (index != -1) {
                    // Checks if the embarkDate for the second flight departs before the first flight arrives
                    if (transferDB.checkEmbarkDate(e.embarkDate, e.travelTime, result[1][index].embarkDate)) {
                        output.push({
                            "firstFlightID": e.flight_id,
                            "secondFlightID": result[1][index].flight_id,
                            "flightCode1": e.flightCode,
                            "flightCode2": result[1][index].flightCode,
                            "aircraft1": e.aircraft,
                            "aircraft2": result[1][index].aircraft,
                            "originAirport": e.originName,
                            "transferAirport": e.transferName,
                            "destinationAirport": result[1][index].destName,
                            "price": e.price + result[1][index].price
                        })
                    }
                }
            })

            console.log(output)
            
            // Checks if there are any transfer flights available.
            if (output.length == 0) {
                return callback(null, {"Message": "No transfer flights found"})
            }
            
            // Sorts the list based on pricing
            // First index is the cheapest transfer flight
            // Last index is the most expensive transfer flight
            output.sort((a, b) => {return a['price'] - b['price']});

            return callback(null, output)
        })
    },
    /**
     * Checks if the first flight arrival date is before the second flight departure date
     * @param {string} firstFlightArrivalDate - The first flight arrival date
     * @param {string} firstFlightTravelTime - The first flight travel time
     * @param {string} secondFlightDepartureDate - The second flight departure date
     * @returns {boolean} True if the first flight arrival date is before the second flight departure date
     * */ 
    checkEmbarkDate: (firstEmbarkDate, firstFlightTime, secondEmbarkDate) => {
        let timing = firstFlightTime.match(/(\d+)[a-zA-Z\s]+(\d+)/);
        
        // Add travel time to the first flight
        var dateObj = new Date(firstEmbarkDate)
        dateObj.setHours(dateObj.getHours() + parseInt(timing[1]))
        dateObj.setMinutes(dateObj.getMinutes() + parseInt(timing[2]))
        var arrival_time = dateObj                          // Arrival to transfer airport
        var departure_time = new Date(secondEmbarkDate) // Departure from transfer airport
        
        // Select a flight based on embarkDate and travelTime
        // Check if the second flights leaves before the first flight arrives
        if (arrival_time > departure_time) {
            // If there is a conflict, then the flights won't be added to the list
            console.log("Transfer flight route not possible, second flight leaves before the first flight arrives")
            return false
        }
        console.log("Transfer flight route possible")
        return true
    }
}

module.exports = transferDB 