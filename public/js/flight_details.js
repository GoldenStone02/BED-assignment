var promo_id

$(document).ready(function () {
    getFlightDetails(flightId)
    getPromotion(flightId)
    getReviews(flightId)
})

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
const flightId = $.urlParam("flight_id");
const originAirportId = $.urlParam("origin");
const destinationAirportId = $.urlParam("dest");
const departureDate = $.urlParam("departDate");
const returnDate = $.urlParam("returnDate");
const flightType = $.urlParam("type");

if (flightType == "one-way") {
    // Form setup
    var departDate_obj = new Date(departureDate)
    var returnDate_obj = new Date(departureDate)

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
            // Loads the selected flight
        })
        .catch((err) => {
            console.log(err)
        })
}

$("#add-review").on("click", () => {
    if (!localStorage.getItem("token")) {
        $("#confirmLogin").modal("show")
        $("#login").on("click", () => {
            window.location.href = "/login";
        })
    } else {
        axios
            .get(`${baseURL}/verifyHeader`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
                console.log(response.data)
                addReviews(response.data.user_id)
            })
            .catch((error) => {
                console.log(error)
            })
    }
})

$("#addToBooking").on("click", () => {
    if (!localStorage.getItem("token")) {
        $("#confirmLogin").modal("show")
        $("#login").on("click", () => {
            window.location.href = "/login";
        })
    } else {
        $("#form-data").empty()
        $("#add-data-form").modal("show")
        $("#form-data").prepend(`
        <div class="form-floating my-3">
            <input type="text" class="form-control" placeholder="Name" id="name" required>
            <label>Name</label>
        </div>
        <div class="form-floating my-3">
        <input type="text" class="form-control" placeholder="Passport" id="passport" required>
        <label>Passport</label>
        </div>
        <div class="form-floating my-3">
            <input type="text" class="form-control" placeholder="Nationality" id="nationality" required>
            <label>Nationality</label>
        </div>
        <div class="form-floating my-3">
            <input type="number" class="form-control" placeholder="Age" id="age" required>
            <label>Age</label>
        </div>
        <div class="form-group my-3 text-center">
            <button type="button" class="btn btn-success btn-block btn-lg" id="add-data">Book Now</button>
        </div>
        `)
        
        $("#add-data").on("click", () => {
            $("#add-data-form").modal('toggle')
            axios
                .get(`${baseURL}/verifyHeader`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                .then((response) => {
                    console.log(response.data)
                    addToBooking(response.data.user_id)
                })
                .catch((error) => {
                    console.log(error)
                })
            $('#successModal').modal('show')
            })
        }
})

// Get flight details
var getFlightDetails = async (flight_id) => {
    await axios
        .get(`${baseURL}/flight/${flight_id}`)
        .then((response) => {
            for (var i = 0; i < response.data.length; i++) {
                console.log(response.data)
                var flight = response.data[i]

                // Add travel time to the flight
                let timing = flight.travelTime.match(/(\d+)[a-zA-Z\s]+(\d+)/);
                var dateObj = new Date(flight.embarkDate)
                dateObj.setHours(dateObj.getHours() + parseInt(timing[1]))
                dateObj.setMinutes(dateObj.getMinutes() + parseInt(timing[2]))
    
                // Loads the selected flight
                $("#flight-details").append(`
                <div class="container">
                    <div class="accordion w-100">
    
                        <div class="accordion-item">
                                <p class="accordion-header" id="flightPanel_${i}">
                                    <button 
                                        class="accordion-button collapsed text-dark" 
                                        type="button" 
                                        data-bs-toggle="collapse" 
                                        data-bs-target="#flightPanelCollapse_${i}" 
                                        aria-expanded="false" 
                                        aria-controls="flightPanelCollapse_${i}"
                                    >
                                    <div class="container w-100">
                                        <div class="row mt-4 mb-0">
                                            <div>
                                                <h2>
                                                    <b>Date:</b> ${moment(flight.embarkDate).format("ddd, DD MMM YYYY")}
                                                </h2>
                                            </div>
                                        </div>
    
                                        <div class="row">
                                            <div class="container mt-0">
                                                <div class="row m-3">
                                                    <div class="col-2">
                                                        <div class="mt-3 ps-1 text-center">
                                                            <i class="fa-solid fa-plane fa-3x mb-4"></i>
                                                            <p><b>Flight Code:</b> <b class="text-primary">${flight.flightCode}</b></p>
                                                            <p><b>Aircraft:</b> <b class="text-primary">${flight.aircraft}</b></p>
                                                        </div>
                                                    </div>
                                                    <div class="col-10">
                                                        <div class="container">
                                                            <div class="row">
                                                                <div class="col-4">
                                                                    <div class="text-center">
                                                                        <h1>${moment(flight.embarkDate).format('HH:mm')}</h1>
                                                                        <h3>${flight.originCountry}</h3>
                                                                        <p>${flight.originAirport}</p>
                                                                    </div>
                                                                </div>
                                                                <div class="col-4 my-auto">
                                                                    <div class="text-center">
                                                                        <h5>${flight.travelTime}</h5>
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
                                                                    <div class="text-center">
                                                                        <h1>${moment(dateObj).format("HH:mm")}</h1>
                                                                        <h3>${flight.destinationCountry}</h3>
                                                                        <p>${flight.destinationAirport}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
    
    
                                        </div>
                                    </div>
                                    </button>
                                </p>
                            <div 
                                id="flightPanelCollapse_${i}" 
                                class="accordion-collapse collapse" 
                                aria-labelledby="flightPanel_${i}"
                            >
                                <div class="accordion-body">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-1 me-0 timeline_circles">
                                                <div class="timeline_track"></div>                                
                                            </div>
                                            <div class="col-2 ps-0">
                                                <div class="row">
                                                    <h5>${moment(flight.embarkDate).format('HH:mm')}</h5>
                                                </div>
                                                <div class="row mt-3 mb-2 text-muted">
                                                    <p><i class="fa-regular fa-clock"></i> ${flight.travelTime}</p>
                                                </div>
                                                <div class="row">
                                                    <h5>${moment(dateObj).format("HH:mm")}</h5>
                                                </div>
                                            </div>
                                            <div class="col-8 container">
                                                <div class="row mb-3">
                                                    <h5>${flight.originCountry}, ${flight.originAirport}</h5>
                                                </div>
                                                <div class="row my-3 invisible">
                                                    test
                                                </div>
                                                <div class="row mt-3">
                                                <h5>${flight.destinationCountry}, ${flight.destinationAirport}</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row mt-4">
                                            <div class="col-3">
    
                                                <p><b>Arrives:</b> ${moment(dateObj).format("ddd, D MMM YYYY, HH:mm")} </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
            
            
                    </div>
                </div>
                `)
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

var getPromotion = async (flightId) => {
    await axios
        .get(`${baseURL}/promotion/flight/${flightId}`)
        .then((response) => {
            console.log(response.data)
            if (response.data.length == 0) {
                $("#promotion").html(`
                <div class="text-center">
                    <h1>Promotions</h1>
                </div>
                `)
                $("#promotion").append(`
                    <div class="row">
                        <div class="col-12">
                            <h5 class="text-muted text-center">No promotion found</h5>
                        </div>
                    </div>
                `)
            } else {
                promotion_list = response.data
                promotion_list.forEach((promotion) => {
                    $("#promotion-table tbody").append(`
                    <tr>
                        <td class="invisible collapse">${promotion.promotion_id}</td>
                        <td>${promotion.promotion_name}</td>
                        <td>${promotion.promotion_description}</td>
                        <td>${moment(promotion.promotion_start_date).format("DD/MM/YYYY")}</td>
                        <td>${moment(promotion.promotion_end_date).format("DD/MM/YYYY")}</td>
                        <td>${promotion.discount_percent}</td>
                        <td>
                            <button class="btn btn-primary promo">
                                Select
                            </button>
                        </td>
                    </tr>
                    `)
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

var getReviews = async (flightId) => {
    await axios
        .get(`${baseURL}/review/${flightId}`)
        .then((response) => {
            console.log(response.data)
            if (response.data.Message == "No reviews for this flight") {
                $("#review-box").append(`
                    <div class="row">
                        <div class="col-12">
                            <h5 class="text-muted text-center">No review found</h5>
                        </div>
                    </div>
                `)
            } else {
                response.data.forEach((review) => {
                    $("#review-box").append(`
                    <div class="col-4 g-3">
                        <div class="card">
                            <div class="card-body">
                                <p class="card-text text-muted">Posted on ${moment(review.created_at).format("DD/MM/YYYY, HH:mm a")}</p>
                                <h5 class="card-title">Rating: <b>${review.rating}/5</b></h5>
                                <h6 class="card-subtitle mb-2">
                                    <b>${review.username}</b>
                                </h6>
                                <p class="card-text">
                                ${review.review_text}
                                </p>
                            </div>
                        </div>
                    </div>
                    `)
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

var addReviews = async (user_id) => {
    await axios
        .post(`${baseURL}/review/${flightId}/${user_id}`, {
            rating: $("#rating-input").val(),
            review: $("#review-input").val(),
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            console.log(response)
            window.location.reload()
        })
        .catch((err) => {
            console.log(err)
        })
}

$(document).on("click", ".promo", (event) => {
    extracted_row = event.target.closest("tr")
    promo_id = extracted_row.cells[0].innerHTML
    // Temporary store the promotion id
    localStorage.setItem("promo_id", promo_id)
    // Enables all promo buttons
    $(".promo").attr("disabled", false)
    $(".promo").text("Select")

    // Selects and disables current promo button
    extracted_btn = event.target.closest("button")
    extracted_btn.disabled = true
    extracted_btn.innerHTML = "Selected"
})

var addToBooking = async (user_id) => {
    // if (localStorage.getItem("promo_id") == null) {
    //     localStorage.setItem("promo_id", 0)
    // }
    await axios
        .post(`${baseURL}/booking/${user_id}/${flightId}`, {
            name: $("#name").val(),
            passport: $("#passport").val(),
            nationality: $("#nationality").val(),
            age: $("#age").val(),
            promotion_id: localStorage.getItem("promo_id")
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((response) => {
            console.log(response.data)
            localStorage.removeItem("promo_id")
        })
        .catch((err) => {
            console.log(err)
        })
}