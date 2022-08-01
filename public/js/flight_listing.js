/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

$(document).ready(() => {
    if (localStorage.getItem("travelDest") != null) {
        loadFlights()
    } else {
        // Show something if there is no flight
    }
})

// Loading of flights from localStorage
var loadFlights = async () => {
    // Checks the values stored in localStorage
    travelDest_response = JSON.parse(localStorage.getItem("travelDest"))
    travelBack_response = JSON.parse(localStorage.getItem("travelBack"))

    // Check if the flight list is empty
    if (travelDest_response.Message) {
        if (travelDest_response.Message == "No flights for given flight directions") {
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
    await travelDest_response.forEach((e) => {
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
                                        <div class="col-2">
                                            <div class="mt-3 ps-2">
                                                <i class="fa-solid fa-plane fa-3x"></i>
                                            </div>
                                        </div>
                
                                        <div class="col-2">
                                            <div class="float-end">
                                                <h1>
                                                ${moment(e.embarkDate).format('HH:mm')}
                                                </h1>
                                                <h4 class="float-end">SIN</h4>
                                            </div>
                                        </div>
                                        <div class="col-4 my-auto">
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
                                        <div class="col-2">
                                            <div class="float-start ms-3">
                                                <h1>${moment(dateObj).format("HH:mm")}</h1>
                                                <h4>NRT</h4>
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
                            
                            <div class="col-2 my-auto">
                                <div class="text-center">
                                    <h4>
                                        SGD $${e.price}
                                    </h4>
                                    <button type="btn" class="btn btn-primary btn-lg w-100">
                                        Select 
                                    </button>
                                </div>
                            </div>
    
                        </div>
                    </div>
                </div>
            </div>`)
    });
}