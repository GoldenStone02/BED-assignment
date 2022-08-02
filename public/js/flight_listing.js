/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

// Function used to read url params
// Source for following function: Sitepoint (https://www.sitepoint.com/url-parameters-jquery/)
$.urlParam = function (name) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
};

// decodeURIComponent($.urlParam("to"))
const originAirportId = $.urlParam("origin");
const destinationAirportId = $.urlParam("dest");
const departureDate = $.urlParam("departDate");
const returnDate = $.urlParam("returnDate");
const flightType = $.urlParam("type");

console.log(originAirportId)
console.log(destinationAirportId)
console.log(departureDate)
console.log(returnDate)
console.log(flightType)

if (flightType == "one-way") {
    // Search for destination flights
    axios
        .get(`${baseURL}/flightDirect/${originAirportId}/${destinationAirportId}`, {
            body: {
                date: departureDate
            }
        })
        .then((response) => {
            console.log(response.data)
            loadFlights(response.data)
        })
        .catch((err) => {
            console.log(err)
        })
} else {
    // Search for destination flights
    searchForFlight(originAirportId, destinationAirportId, departureDate)

    // Search for return flights
    searchForFlight(destinationAirportId, originAirportId, returnDate)
}


// Searching and Loading of flights
var loadFlights = async (db_response) => {

    // Check if the flight list is empty
    if (db_response) {
        if (db_response == "No flights for given flight directions") {
            $("#flight_list").append(`
            <h3 class="alert alert-danger w-50 mx-auto my-3">
            No flights found for given flight directions
            </h3>
            `)
            return
        }
    }

    // ! Still need to redirect the user to the correct flight details page
    $("#flight_list").append(`
    <div class="row">
        <h2>
            <b>Flight List</b>
        </h2>
    </div>
    `)
    // Shows the response flight list from the server
    await db_response.forEach((e) => {
        // Add travel time to the flight
        let timing = e.travelTime.match(/(\d+)[a-zA-Z\s]+(\d+)/);
        var dateObj = new Date(e.embarkDate)
        dateObj.setHours(dateObj.getHours() + parseInt(timing[1]))
        dateObj.setMinutes(dateObj.getMinutes() + parseInt(timing[2]))

        $("#flight_list").append(`
            <div class="container">
                <div class="row  mt-4 mb-0">
                    <div class="container mt-0 border">
                    <div class="row">
                            <div class="col-10">
    
                                <div class="container">
                                    <div class="row mx-2 my-3">
                                        <h5>Board at ${moment(e.embarkDate).format('ddd, DD/MM/YYYY, hh:mm:ss')}</h5>
                                    </div>
        
                                    <div class="row m-3">                
                                        <div class="col-3">
                                            <div class="float-end">
                                                <h1 class="float-end">${moment(e.embarkDate).format('HH:mm')}</h1>
                                                <h3>${e.originCountry}</h3>
                                                <p class="float-end">${e.originAirport}</p>
                                            </div>
                                        </div>
                                        <div class="col-4 mt-3">
                                            <div class="text-center">
                                                <h5>
                                                ${e.travelTime}</h5>
                                            </div>
                                            <div class="row">
                                                <div class="col-11 me-0">
                                                <hr>
                                                </div>
                                                <div class="col-1 float-end ms-0 mt-1">
                                                    <i class="fa-solid fa-plane"></i>
                                                </div>
                                            </div>
                                            <div class="text-center">
                                                <p>Direct</p>
                                            </div>
                                        </div>
                                        <div class="col-3">
                                            <div class="float-start ms-3">
                                                <h1>${moment(dateObj).format("HH:mm")}</h1>
                                                <h3>${e.destinationCountry}</h3>
                                                <p>${e.destinationAirport}</p>
                                            </div>
                                        </div>
                                        <div class="col-2 text-center my-auto">
                                                <a href="#" class="text-muted links" id="flightid_${e.flight_id}">
                                                    <div class="container">
                                                        <div class="row">
                                                            <i class="fa-solid fa-circle-info fa-2x"></i>
                                                        </div>
                                                        <div class="row">
                                                            <p>More details</p>   
                                                        </div>
                                                    </div>
                                                </a>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            
                            <div class="col-2 container border border-2 mx-0">
                                    <div class="row eco-green">
                                        <div class="mt-2 text-center text-light">
                                            <h4 class="fw-bold">Economy</h4>
                                        </div>
                                    </div>
                                    <div class="row mt-4">
                                        <div class="text-center">
                                            <h4>
                                                SGD $${e.price.toFixed(2)}
                                            </h4>
                                            <button type="btn" class="btn btn-primary btn-lg w-100">
                                                Select 
                                            </button>
                                        </div>
                                    </div>
                            </div>
    
                        </div>
                    </div>
                </div>
            </div>`)
    });

}


// // Get the flights, put them into local storage, then redirect the page to flight listings.
// /** Queries for flight Direction
//  * @param {string} storage_name - Naming for queried values to be stored in localStorage.
//  * @param {number} first_airport_id - The origin airport within the search
//  * @param {number} second_airport_id - The destination airport within the search
//  * @param {Date} givenDate - Date to start from.
//  * */ 
// var searchForFlight = async (first_airport_id, second_airport_id, givenDate) => {
//     await axios
//         .get(`${baseURL}/flightDirect/${first_airport_id}/${second_airport_id}`, {
//             body: {
//                 date: givenDate
//             }
//         })
//         .then((response) => {
//             console.log(response.data)
//             // Add the flights to local storage
//         })
//         .catch((err) => {
//             console.log(err)
//         })
// }