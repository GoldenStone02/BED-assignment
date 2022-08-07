/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/


$(document).ready(function(){
    getData()

    $("#flight-type").change(() => {
        if ($("#flight-type").val() == "one-way") {
            $("#returnDate").attr("disabled", true)
        } else {
            $("#returnDate").attr("disabled", false)
        }
    })

    // Need to fix the timezones
    // As its right now using USA timings. Not localtime.
    // $ Could use Moment.js for this if got time
    $("#departureDate").attr("min", new Date().toISOString().split("T")[0])
});

// Ensures that the return flight does not happen before the departure flight.
$("#departureDate").on("change", () => {
    if ( $("#departureDate").val() != "" && $("#flight-type").val() == "return") {
        // Init values
        var departDate = new Date($("#departureDate").val())
        var returnDate = new Date(departDate.setDate(departDate.getDate() + 1))
        // Set the min date for the return date
        $("#returnDate").attr("min", returnDate.toISOString().split("T")[0])
    }
})

// Get the airports and put then into the list.
var getData = async () => {
    await axios
        .get(`${baseURL}/airport`)
        .then((response) => {
            var unsorted_list = response.data
            for (let i = 0; i < unsorted_list.length; i++) {
                var airport = unsorted_list[i]
                $("#departureAirport").append(`
                <option value="${airport.airport_id}">
                    ${airport.name}
                </option>
                `)
                $("#arrivalAirport").append(`
                <option value="${airport.airport_id}">
                    ${airport.name}
                </option>
                `)
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

// Ensures that there the form has valid inputs
$("#flight-search").on("click", () => {

    // Check if there the originAirport and destinationAirport are there
    if ($("#departureAirport").val() == "nothing_selected"|| $("#arrivalAirport").val() == "nothing_selected") {
        $("#errorModal").modal('toggle')
        $(".modal-text-body").text("Please select an airport")
        return
    }

    // Need to check what airport is being returned
    var originAirport_id = $('#departureAirport').children("option:selected").val()
    var destinationAirport_id = $('#arrivalAirport').children("option:selected").val()

    var flight_type = $("#flight-type").val()

    // Check if the airports are the same
    if (originAirport_id == destinationAirport_id) {
        $("#errorModal").modal('toggle')
        $(".modal-text-body").text("Searching from and to the same city is not possible.")
        return
    }
    
    
    // Check what type of flight it is
    if (flight_type == "one-way") {
        var departureDate = $("#departureDate").val()
        // Check if the date is valid
        if (departureDate == "") {
            $("#errorModal").modal('toggle')
            $(".modal-text-body").text("Please fill in your departure date.")
            return
        }


        // Redirects to the browse-flights
        window.location.href = "/browse-flights?origin=" + originAirport_id + 
        "&dest=" + destinationAirport_id + 
        "&departDate=" + departureDate + 
        "&type=" + flight_type
    } else {
        var departureDate = $("#departureDate").val()
        var returnDate = $("#returnDate").val()
        
        // Check if the date is valid
        if (departureDate == "" || returnDate == "") {
            $("#errorModal").modal('toggle')
            $(".modal-text-body").text("Please fill in your departure AND return dates.")
            return
        }
        
        window.location.href = "/browse-flights?origin=" + originAirport_id + "&dest=" + destinationAirport_id + "&departDate=" + departureDate + "&returnDate=" + returnDate
        + "&type=" + flight_type
    }
})
