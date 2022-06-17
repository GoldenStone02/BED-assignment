/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const pool = require('../models/databaseConfig')

/**
 * Extracts the information from the database and returns a 
 * list of possible transfer flights.
 * @param {Array} [flight_input] - flight info to be compared and extracted.
 * @param {string} [compare_criteria] - the criteria to be compared.
 * @return {Array} [transfer_flights] - list of possible transfer flights.
 * */
function extractFlightInfo(flight_input, compare_criteria) {
    var transfer_arr = []
    // Selects the second transfer flights
    for (let i = 0; i < flight_input.length; i++) {
        // Each index is stored by [flight_id, originAirport, price]
        var flight_id = flight_input[i]["flight_id"]
        var airport_id = flight_input[i][compare_criteria]
        var price = flight_input[i]["price"]
        var embarkDate = (new Date(flight_input[i]["embarkDate"] + "Z")).toUTCString()
        var travelTime = flight_input[i]["travelTime"]
        var flight_code = flight_input[i]["flightCode"]
        var aircraft = flight_input[i]["aircraft"]
        console.table(flight_input[i])

        // Adds in the first flight to the transfer_arr
        if (transfer_arr.length == 0) {
            transfer_arr.push([flight_id, airport_id, price, embarkDate, travelTime, flight_code, aircraft])
        }
        else {
            // Temporary value for searching
            let cycle = 0
            // Ensures that there are no duplicate values for the compared criteria in the array
            for (let j = 0; j < transfer_arr.length; j++) {
                console.log(j, transfer_arr)
                // Checks if the origin airport is the same as the previous origin airport
                // AND if it has already been added
                if (transfer_arr[j][1] != airport_id) {
                    cycle++

                    // Adds the flight to the array only until it has checked through all flights
                    if (transfer_arr.length == cycle) {
                        transfer_arr.push([flight_id, airport_id, price, embarkDate, travelTime, flight_code, aircraft])
                    }
                }
                else {
                    // Select flight based on the price
                    // Checks if the price is lower than the previously added price
                    if (transfer_arr[j][2] > price) {
                        // Replace the previous flight with the new flight
                        transfer_arr[j] = [flight_id, airport_id, price, embarkDate, travelTime, flight_code, aircraft]
                        break
                    }
                }
            }
        }
    }
    return transfer_arr
}

const transferDB = {
    // .. GET all transfer flights
    // ! WORK IN PROGRESS
    // ! This function is not working properly
    getTransferFlights: function (origin_airport_id, destination_airport_id, callback) {
        console.log("Connected! Getting transfer flights...");
        var params = [origin_airport_id, destination_airport_id, destination_airport_id, origin_airport_id];
        var sql = `
        SELECT * FROM flight WHERE originAirport = ? AND destinationAirport != ?; 
        SELECT * FROM flight WHERE destinationAirport = ? AND originAirport != ?`;
        pool.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }

            // .. Selector function to select 1 common transfer flight between the 2 airports specified

            // # Details such as embarkDate and travelTime will be a factor in the actual build

            // Extracts the first transfer flights
            var first_transfer_arr = extractFlightInfo(result[0], "destinationAirport")
            console.log(first_transfer_arr)
            
            // Extracts the second transfer flights
            var second_transfer_arr = extractFlightInfo(result[1], "originAirport")
            
            console.log("Origin flights")
            console.table(result[0])
            console.log("Destination flights")
            console.table(result[1])

            console.log("Transfer Flights:")
            console.log(first_transfer_arr)
            console.log(second_transfer_arr)

            // Select a flight based on distance
            // Reference from this csv database https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat

            compare_arr = []    // Used to compare data from each set of flights
            final_result = []   // Final result to be returned

            // Check if the first transfer flights are the same as the second transfer flights
            for (let i = 0; i < first_transfer_arr.length; i++) {
                for (let j = 0; j < second_transfer_arr.length; j++) {
                    // Matches if the transfer airports are the same
                    if (first_transfer_arr[i][1] == second_transfer_arr[j][1]) {
                        console.log("Found a match!")
                        console.log(first_transfer_arr[i])
                        console.log(second_transfer_arr[j])
                        compare_arr.push([first_transfer_arr[i], second_transfer_arr[j]])
                        console.log(first_transfer_arr[i][3])
                    }
                }
            }

            // Filters transfer flights based on pricing and embarkDate
            for (let i = 0; i < compare_arr.length; i++) {
                console.log(compare_arr[i])
                console.log(compare_arr[i][0][3])
                console.log(compare_arr[i][1][3])
                
                // extract the hours and minutes from the string
                // Group 1: hours
                // Group 2: minutes
                let timing = compare_arr[i][0][4].match(/(\d+)[a-zA-Z\s]+(\d+)/);
                // console.log(timing[1])
                // console.log(timing[2])
                
                // Add time to the first flight
                var dateObj = new Date(compare_arr[i][0][3])
                dateObj.setHours(dateObj.getHours() + parseInt(timing[1]))
                dateObj.setMinutes(dateObj.getMinutes() + parseInt(timing[2]))
                var arrival_time = dateObj                          // Arrival to transfer airport
                var departure_time = new Date(compare_arr[i][1][3]) // Departure from transfer airport
                console.log(arrival_time)
                console.log(departure_time)

                // Select a flight based on embarkDate and travelTime
                // Check if the second flights leaves before the first flight arrives
                if (arrival_time > departure_time) {
                    // If there is a conflict, then the flights won't be added to the list
                    console.log("Transfer flight route not possible, second flight leaves before the first flight arrives")
                    continue
                }
                console.log("Transfer flight route possible")
                final_result.push(compare_arr[i])
            }
            
            console.log(final_result)
            // Select a flight based on pricing

            // Format the values to return to the client

            return callback(null, result)
        })
    }
}

module.exports = transferDB 