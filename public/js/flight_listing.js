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

if (flightType == "one-way") {
    // Form setup
    // ! not so sure for showing airport inputs
    // $("#departureAirport").val(parseInt(originAirportId))
    // $("#arrivalAirport").attr("value", parseInt(destinationAirportId))
    // $("#departureAirport").children(`option[value="${originAirportId}"]`).attr('selected', true);
    var departDate_obj = new Date(departureDate)
    var returnDate_obj = new Date(departDate_obj.setDate(departDate_obj.getDate() + 1))

    $(`option[value="${originAirportId}"]`).prop("selected", true);
    $("#flight-type").val(flightType)
    $("#departureDate").attr("value", departureDate)
    $("#returnDate").attr("disabled", true)
    $("#returnDate").attr("min", returnDate_obj.toISOString().split("T")[0])
    

        // Search for destination flights
        axios
            .get(`${baseURL}/flightDirect/${departureDate}/${originAirportId}/${destinationAirportId}`)
            .then((response) => {
                console.log(response.data)
                
    
                loadFlights(response.data, "1")
            })
            .catch((err) => {
                console.log(err)
            })


} else if (flightType == "return") {
    getFlightList = async () => {
        // Search for destination flights
        await axios
            .get(`${baseURL}/flightDirect/${departureDate}/${originAirportId}/${destinationAirportId}`)
            .then((response) => {
                console.log(response.data)

                // Form setup
                // ! not so sure for select airport inputs
                $("#flight-type").val(flightType)
                $("#departureDate").attr("value", departureDate)
                $("#returnDate").attr("value", returnDate)

                // Load destination flights
                loadFlights(response.data, "1")
            })
            .catch((err) => {
                console.log(err)
            })

        // Search for return flights
        // ! Destination and origin are switched
        await axios
            .get(`${baseURL}/flightDirect/${returnDate}/${destinationAirportId}/${originAirportId}`)
            .then((response) => {
                console.log(response.data)

                // Load return flights
                loadFlights(response.data, "2")
            })
            .catch((err) => {
                console.log(err)
            })
    }
        getFlightList()
} else {
    console.log("Invalid flight type")
}


// Searching and Loading of flights
var loadFlights = async (db_response, numbering) => {
    
    // Load airports
    if (numbering == "1") {
        // Flights remains the same
        var originAirport = await getAirportById(originAirportId)
        var destinationAirport = await getAirportById(destinationAirportId)
    } else {
        // Flights are switched
        var originAirport = await getAirportById(destinationAirportId)
        var destinationAirport = await getAirportById(originAirportId)
    }

    // ! Still need to redirect the user to the correct flight details page
    $("#flight_list").append(`
    <div class="row mt-4">
        <h2>
            <b>Flight List</b>
        </h2>
    </div>
    <div class="row mt-2">
        <h2>
            ${numbering}. ${originAirport[0].name} - ${destinationAirport[0].name}
        </h2>
    </div>
    `)
    
    // Check if the flight list is empty
    if (db_response.Message == "No flights for given flight directions") {
        $("#flight_list").append(`
        <h3 class="alert alert-danger w-50 mx-auto my-3">
        No flights found for given flight directions
        </h3>
        `)
        return
    }

    // Shows the response flight list from the server
    await db_response.forEach((flight) => {
        // Add travel time to the flight
        let timing = flight.travelTime.match(/(\d+)[a-zA-Z\s]+(\d+)/);
        var dateObj = new Date(flight.embarkDate)
        dateObj.setHours(dateObj.getHours() + parseInt(timing[1]))
        dateObj.setMinutes(dateObj.getMinutes() + parseInt(timing[2]))

        // Check if flight_id is travelling to or from the destination airport.

        // Href to the flight details page
        flight_href = "/flight-details?flight_id=" + flight.flight_id + "&origin=" + originAirportId + "&dest=" + destinationAirportId +"&departDate=" + departureDate + "&returnDate=" + returnDate + "&type=" + flightType 

        $("#flight_list").append(`
            <div class="container">
                <div class="row  mt-4 mb-0">
                    <div class="container mt-0 border">
                    <div class="row">
                            <div class="col-10">
    
                                <div class="container">
                                    <div class="row mx-2 my-3">
                                        <h5>Board at ${moment(flight.embarkDate).format('ddd, DD/MM/YYYY, hh:mm:ss')}</h5>
                                    </div>
        
                                    <div class="row m-3">                
                                        <div class="col-4">
                                            <div class="text-center">
                                                <h1>${moment(flight.embarkDate).format('HH:mm')}</h1>
                                                <h3>${flight.originCountry}</h3>
                                                <p>${flight.originAirport}</p>
                                            </div>
                                        </div>
                                        <div class="col-4 mt-3">
                                            <div class="text-center">
                                                <h5>
                                                ${flight.travelTime}</h5>
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
                                        <div class="col-4">
                                            <div class="text-center ms-3">
                                                <h1>${moment(dateObj).format("HH:mm")}</h1>
                                                <h3>${flight.destinationCountry}</h3>
                                                <p>${flight.destinationAirport}</p>
                                            </div>
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
                                    <div class="row mt-3 mb-4">
                                        <div class="text-center">
                                            <h5>From SGD</h5>
                                            <h2 class="fw-bold">
                                                $${flight.price.toFixed(2)}
                                            </h2>
                                            <h5>
                                                Per Adult
                                            </h5>
                                            <a type="btn" id="flightid_${flight.flight_id}" class="btn btn-primary btn-lg w-100 flight_btn" 
                                            href="${flight_href}">
                                                More Details
                                            </a>
                                        </div>
                                    </div>
                            </div>
    
                        </div>
                    </div>
                </div>
            </div>`)
    });

}


// Get Airport by ID
var getAirportById = async (airportId) => {
    return await axios
        .get(`${baseURL}/airport/${airportId}`)
        .then((response) => {
            return response.data
        })
        .catch((err) => {
            console.log(err)
        })
}