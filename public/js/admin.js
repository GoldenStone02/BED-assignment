/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

$(document).ready(() => {

    // Redirects when user is not logged into admin
    if (!localStorage.getItem("token")) {
        window.location.href = "/login";
    } else {
        axios
        .get(`${baseURL}/verifyHeader`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((response) => {
            if (response.data.role != "admin") {
                window.location.href = "/";
            } else {
                // Load all admin panels
                getFlights()
                getAirport()
                getUser()
                getBookings()
                getPromotion()
                getFlightPromotion()
                getReviews()
                $(".container").removeClass("invisible");
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }
});

// FLIGHTS
//  ######################################################################################################################


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


$("#add-flight").on("click", () => {
    // Clears div
    $("#form-data").empty()
    $("#add-data-form").modal('toggle')
    $(".modal-title-data").text("Add Flight")
    // Adds form
    $("#form-data").prepend(`
    <div class="form-floating my-3">
        <input type="text" class="form-control" placeholder="flightCode" id="flightCode" required>
        <label>flightCode</label>
    </div>
    <div class="form-floating my-3">
        <input type="text" class="form-control" placeholder="aircraft" id="aircraft" required>
        <label>aircraft</label>
    </div>
    <div class="form-floating my-3">
        <select class="form-select" placeholder="originAirport" id="departureAirport" required>
            <option value="nothing_selected">-</option>
        </select>
        <label>originAirport</label>
    </div>
    <div class="form-floating my-3">
        <select class="form-select" placeholder="destinationAirport" id="arrivalAirport" required>
            <option value="nothing_selected">-</option>
        </select>
        <label>destinationAirport</label>
    </div>
    <div class="form-floating my-3">
        <input type="datetime-local" class="form-control" id="embarkDate" required>
        <label>embarkDate</label>
        <div class="valid-feedback">
            Looks good!
        </div>
    </div>
    <div class="form-floating my-3">
        <input type="text" class="form-control" placeholder="travelTime (e.g. '6 hours 10 mins')" id="travelTime" required>
        <label>travelTime (e.g. '6 hours 10 mins')</label>
    </div>
    <div class="form-floating my-3">
        <input type="number" class="form-control" placeholder="travelTime" id="price" required>
        <label>price</label>
    </div>
    <div class="form-group my-3 text-center">
        <button type="button" class="btn btn-primary btn-block btn-lg" id="add-data">Add Flight</button>
    </div>
    `)
    getData()
    $("#add-data").on("click", () => {
        // ! Do form validation
        if ($("#flightCode").val() == "" || $("#aircraft").val() == "" || $("#departureAirport").val() == "nothing_selected" || $("#arrivalAirport").val() == "nothing_selected" || $("#embarkDate").val() == "" || $("#travelTime").val() == "" || $("#price").val() == "") {
            alert("Please fill out all fields")
        } 
        
        console.log(moment($("#embarkDate").val()).format("YYYY-MM-DD HH:mm:ss"))
        axios
            .post(`${baseURL}/flight`, {
                flightCode: $("#flightCode").val(),
                aircraft: $("#aircraft").val(),
                originAirport: $("#departureAirport").val(),
                destinationAirport: $("#arrivalAirport").val(),
                embarkDate: moment($("#embarkDate").val()).format("YYYY-MM-DD HH:mm:ss"),
                travelTime: $("#travelTime").val(),
                price: $("#price").val()
            }, 
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
                console.log(response.data)
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)
            })

    })
})

$(document).on("click", ".deleteFlight", (event) => {
    extracted_row = event.target.closest("tr")
    flight_id = extracted_row.cells[0].innerHTML
    console.log(flight_id)
    $("#confirmDelete").modal('toggle')
    $(".delete-text").text("This flight will be permanently deleted.")

    $("#delete").on("click", () => {
        console.log(flight_id)
        axios
            .delete(`${baseURL}/flight/${flight_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
                console.log(response.data)
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})


var getFlights = async () => {
    await axios
        .get(`${baseURL}/flight`)
        .then((response) => {
            $('#flight-table').DataTable( {
                data: response.data,
                columns: [
                    { data: 'flight_id' },
                    { data: 'flightCode' },
                    { data: 'aircraft' },
                    { data: 'originAirport' },
                    { data: 'destinationAirport' },
                    { data: 'embarkDate' },
                    { data: 'travelTime' },
                    { data: 'price' },
                    { 
                        data: null, 
                        defaultContent: `
                        <button class="btn btn-danger deleteFlight">
                            Delete Flight
                        </button>`
                    }
                ]
            } );
        })
        .catch((err) => {
            console.log(err)
        })
}

// AIRPORT
// ########################################################################################################################

$("#add-airport").on("click", () => {
    // Clears div
    $("#form-data").empty()
    $("#add-data-form").modal('toggle')
    $(".modal-title-data").text("Add Airport")
    // Adds form
    $("#form-data").prepend(`
    <div class="form-floating my-3">
        <input type="text" class="form-control" placeholder="name" id="name" required>
        <label>name</label>
    </div>
    <div class="form-floating my-3">
        <input type="text" class="form-control" placeholder="country" id="country" required>
        <label>country</label>
    </div>
    <div class="form-floating my-3">
        <input type="text" class="form-control" placeholder="description" id="description" required>
        <label>description</label>
    </div>
    <div class="form-group my-3 text-center">
        <button type="button" class="btn btn-primary btn-block btn-lg" id="add-data">Add Airport</button>
    </div>
    `)
    $("#add-data").on("click", () => {
        // ! Do form validation
        if ($("#name").val() == "" || $("#country").val() == "" || $("#description").val() == "") {
            alert("Please fill out all fields")
            return
        }
        axios
            .post(`${baseURL}/airport`, {
                name: $("#name").val(),
                country: $("#country").val(),
                description: $("#description").val()
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
                console.log(response)

                $("#name").removeClass("is-invalid")
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)

                if (err.response.status == 422) {
                    $("#name").addClass("is-invalid")
                    alert("Airport Name already exists in the database")
                }
            })
    })
})


$(document).on("click", ".deleteAirport", (event) => {
    extracted_row = event.target.closest("tr")
    airport_id = extracted_row.cells[0].innerHTML
    console.log(airport_id)
    $("#confirmDelete").modal('toggle')
    $(".delete-text").text("This airport will be permanently deleted.")

    $("#delete").on("click", () => {
        console.log(airport_id)
        axios
            .delete(`${baseURL}/airport/${airport_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
                console.log(response.data)
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})


var getAirport = async () => {
    await axios
        .get(`${baseURL}/airport`)
        .then((response) => {
            $("#airport-table").DataTable( {
                data: response.data,
                columns: [
                    { data: 'airport_id' },
                    { data: 'name' },
                    { data: 'country' },
                    { data: 'description' },
                    { 
                        data: null, 
                        defaultContent: `
                        <button class="btn btn-danger deleteAirport">
                            Delete Airport
                        </button>`
                    }
                ]
            })
        })
        .catch((err) => {
            console.log(err)
        })
}

// USER
// ########################################################################################################################


$(document).on("click", ".deleteUser", (event) => {
    extracted_row = event.target.closest("tr")
    user_id = extracted_row.cells[0].innerHTML
    console.log(user_id)
    $("#confirmDelete").modal('toggle')
    $(".delete-text").text("This user will be permanently deleted.")

    $("#delete").on("click", () => {
        console.log(user_id)
        axios
            .delete(`${baseURL}/user/${user_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
                console.log(response.data)
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)
                if (err.response.data.Message == "Cannot delete admin") {
                    alert("You can't delete yourself")
                }
            })
    })
})


var getUser = async () => {
    await axios
        .get(`${baseURL}/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((response) => {
            $("#user-table").DataTable( {
                data: response.data,
                columns: [
                    { data: 'user_id' },
                    { data: 'username' },
                    { data: 'email' },
                    { data: 'contact' },
                    { data: 'role' },
                    { data: 'profile_pic_url' },
                    { data: 'created_at' },
                    { 
                        data: null, 
                        defaultContent: `
                        <button class="btn btn-danger deleteUser">
                            Delete User
                        </button>`
                    }
                ]
            })
        })
        .catch((err) => {
            console.log(err)
        })
}
    
// BOOKINGS
// ########################################################################################################################


$(document).on("click", ".deleteBooking", (event) => {
    extracted_row = event.target.closest("tr")
    booking_id = extracted_row.cells[0].innerHTML
    console.log(booking_id)
    $("#confirmDelete").modal('toggle')
    $(".delete-text").text("This booking will be permanently deleted.")

    $("#delete").on("click", () => {
        console.log(booking_id)
        axios
            .delete(`${baseURL}/booking/${booking_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
                console.log(response.data)
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})


var getBookings = async () => {
    await axios
        .get(`${baseURL}/booking`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((response) => {
            $("#booking-table").DataTable( {
                data: response.data,
                columns: [
                    { data: 'booking_id' },
                    { data: 'user_id' },
                    { data: 'flight_id' },
                    { data: 'name' },
                    { data: 'passport' },
                    { data: 'nationality' },
                    { data: 'age' },
                    { data: 'created_at' },
                    { data: 'promotion_id' },
                    { 
                        data: null, 
                        defaultContent: `
                        <button class="btn btn-danger deleteBooking">
                            Delete Booking
                        </button>`
                    }
                ]
            })
        })
        .catch((err) => {
            console.log(err)
        })
}

// PROMOTIONS
// ########################################################################################################################


$(document).on("click", ".deletePromotion", (event) => {
    extracted_row = event.target.closest("tr")
    promotion_id = extracted_row.cells[0].innerHTML
    console.log(promotion_id)
    $("#confirmDelete").modal('toggle')
    $(".delete-text").text("This promotion will be permanently deleted.")

    $("#delete").on("click", () => {
        console.log(promotion_id)
        axios
            .delete(`${baseURL}/promotion/${promotion_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
                console.log(response.data)
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})


var getPromotion = async () => {
    await axios
        .get(`${baseURL}/promotion`)
        .then((response) => {
            $("#promotion-table").DataTable( {
                data: response.data,
                columns: [
                    { data: 'promotion_id' },
                    { data: 'promotion_name' },
                    { data: 'promotion_description' },
                    { data: 'promotion_start_date' },
                    { data: 'promotion_end_date' },
                    { data: 'discount_percent' },
                    { 
                        data: null, 
                        defaultContent: `
                        <button class="btn btn-danger deletePromotion">
                            Delete Promotion
                        </button>`
                    }
                ]
            })
        })
        .catch((err) => {
            console.log(err)
        })
}

// FLIGHT PROMOTIONS
// ########################################################################################################################


$(document).on("click", ".deleteFlightPromotion", (event) => {
    extracted_row = event.target.closest("tr")
    flight_promotion_id = extracted_row.cells[0].innerHTML
    console.log(flight_promotion_id)
    $("#confirmDelete").modal('toggle')
    $(".delete-text").text("This flight promotion will be permanently deleted.")

    $("#delete").on("click", () => {
        console.log(flight_promotion_id)
        axios
            .delete(`${baseURL}/promotion/flight/${flight_promotion_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
                console.log(response.data)
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})


var getFlightPromotion = async () => {
    await axios
        .get(`${baseURL}/promotion/flight`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((response) => {
            $("#flight-promotion-table").DataTable( {
                data: response.data,
                columns: [
                    { data: 'flight_id' },
                    { data: 'promotion_id' },
                    { 
                        data: null, 
                        defaultContent: `
                        <button class="btn btn-danger deleteFlightPromotion">
                            Delete Flight Promotion
                        </button>`
                    }
                ]
            })
        })
        .catch((err) => {
            console.log(err)
        })
}

// REVIEWS
// ########################################################################################################################


$(document).on("click", ".deleteReview", (event) => {
    extracted_row = event.target.closest("tr")
    review_id = extracted_row.cells[0].innerHTML
    console.log(review_id)
    $("#confirmDelete").modal('toggle')
    $(".delete-text").text("This review will be permanently deleted.")

    $("#delete").on("click", () => {
        console.log(review_id)
        axios
            .delete(`${baseURL}/review/${review_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
                console.log(response.data)
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})


var getReviews = async () => {
    await axios
        .get(`${baseURL}/review`)
        .then((response) => {
            $("#review-table").DataTable( {
                data: response.data,
                columns: [
                    { data: 'review_id' },
                    { data: 'user_id' },
                    { data: 'username' },
                    { data: 'flight_id' },
                    { data: 'rating' },
                    { data: 'review_text' },
                    { 
                        data: null, 
                        defaultContent: `
                        <button class="btn btn-danger deleteReview">
                            Delete Review
                        </button>`
                    }
                ]
            })
        })
        .catch((err) => {
            console.log(err)
        })
}