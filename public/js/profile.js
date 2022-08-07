/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

$(document).ready(() => {
    if (!localStorage.getItem("token")) {
        window.location.href = "/login";
    }

    loadProfile();
    getBookings();
});

// Note the user can still type the characer "e" or "E"
// Source: https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
var loadProfile = async () => {
    var {user_id, role} = await axios
        .get(`${baseURL}/verifyHeader`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            console.log(response.data)
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })

    await axios
        .get(`${baseURL}/users/${user_id}}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            $("#profilePic").attr(
                "src",
                `${baseURL}/${response.data.profile_pic_url}`
            );
            $("#userInfo").prepend(`
            <h1>${response.data.username}</h1>
            <h5>${response.data.role}</h5>
            <h5>Account created at ${response.data.created_at}</h5>
            `);
            $("#profileInfo").prepend(`
            <table class="table table-borderless w-sm-100 w-25">
                <tbody>
                    <tr>
                        <td>Username</td>
                        <td class="group">
                            <input type="text" name="username" id="username" value="${response.data.username}" readonly required>
                        </td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td class="group">
                            <input type="text" name="email" id="email" value="${response.data.email}" readonly required>
                        </td>
                    </tr>
                    <tr>
                        <td>Contact</td>
                        <td class="group">
                            <input type="number" name="contact" id="contact" value="${response.data.contact}" readonly required>
                        </td>
                    </tr>
                    <tr id="passDiv" class="invisible collapse">
                        <td>Password</td>
                        <td class="group">
                            <input type="password" name="password" id="password" value="" required>
                        </td>
                    </tr>
                    <tr id="confirmPassDiv" class="invisible collapse">
                        <td>Confirm </td>
                        <td class="group">
                            <input type="password" name="confirmPass" id="confirmPass" value="" required>
                        </td>
                    </tr>
                </tbody>
            </table>
            `);

            if (response.data.role == "Admin") {
                // Show the admin panel
                console.log("User is admin");
            } else {
                // Show the user panel
            }
        })
        .catch((err) => {
            console.log(err);
        });
    await $("#placeholder").remove()
    await $("#placeholder2").remove()
    await $("#profilePic").removeClass("skeleton")
};

var getBookings = async () => {
    var {user_id, role} = await axios
        .get(`${baseURL}/verifyHeader`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
    
    // Get the bookings of the user
    await axios
        .get(`${baseURL}/booking/${user_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            if (response.data.Message == "No booking in database") {
                $("#booking").append(`
                <div class="alert alert-info text-center">
                    You have no bookings.
                </div>
                `);
            } else {
                response.data.forEach((booking) => {
                    // Request for flight details
                    axios
                        .get(`${baseURL}/flight/${booking.flight_id}`)
                        .then((response) => {
                            flight = response.data[0]
                            console.log("test")
                            console.log(flight)
                            
                            if (booking.promotion_id == null) {
                                $("#booking").append(`
                                <div class="col-4">
                                    <div class="card text-center mt-2">
                                        <div class="card-body">
                                            <h5 class="card-title"><b>${flight.originAirport}</b> to <b>${flight.destinationAirport}</b></h5>
                                            <p class="card-text"><b>Embark Date</b> ${moment(flight.embarkDate).format("ddd DD MMM YYYY, HH:mm a")}</h6>
                                            <p class="card-text"><b>Booked at</b> ${moment(booking.created_at).format("ddd DD MMM YYYY, HH:mm a")}</h6>
                                            <p class="card-text"><b>Passport:</b> *****${booking.passport.slice(booking.passport.length - 4)}</p>
                                            <p class="card-text"><b>Price:</b> SGD ${flight.price}</p>
                                        </div>
                                    </div>
                                </div>
                                `);
                            } else {
                                // Get the promotion details
                                axios
                                    .get(`${baseURL}/promotion/${booking.promotion_id}`)
                                    .then((response) => {
                                        console.log(response.data[0])
    
                                        $("#booking").append(`
                                        <div class="col-4">
                                            <div class="card text-center mt-2">
                                                <div class="card-body">
                                                    <h5 class="card-title"><b>${flight.originAirport}</b> to <b>${flight.destinationAirport}</b></h5>
                                                    <p class="card-text"><b>Embark Date</b> ${moment(flight.embarkDate).format("ddd DD MMM YYYY, HH:mm a")}</h6>
                                                    <p class="card-text"><b>Booked at</b> ${moment(booking.created_at).format("ddd DD MMM YYYY, HH:mm a")}</h6>
                                                    <p class="card-text"><b>Passport:</b> *****${booking.passport.slice(booking.passport.length - 4)}</p>
                                                    <p class="card-text"><b>Price:</b> SGD ${flight.price}</p>
                                                    <p class="card-text"><b>Discount:</b> ${response.data[0].discount_percent}%</p>
                                                </div>
                                            </div>
                                        </div>
                                        `);
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

// Make fields editable
// Password field is hidden by default
$("#editBtn").on("click", () => {
    // Change buttons to update and cancel
    $("#saveBtn").removeClass("invisible collapse");
    $("#cancelBtn").removeClass("invisible collapse");
    $("#editBtn").addClass("invisible collapse");
    $("#logoutBtn").addClass("invisible collapse");

    // Change password button
    $("#changePassBtn").addClass("invisible collapse");

    // Change the inputs to be editable
    $("#username").removeAttr("readonly");
    $("#email").removeAttr("readonly");
    $("#contact").removeAttr("readonly");
});

// This is for the saving and uploading of images to the database
$("#save").on("click", async () => {
    await axios
        .get(`${baseURL}/verifyHeader`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            // Checks if the user_id in local storage and jwt token are the same.
            if (response.data.user_id == user_id) {
                // Check if the username, email or contact are empty
                $("#saveBtn").addClass("invisible collapse");
                $("#cancelBtn").addClass("invisible collapse");
                $("#editBtn").removeClass("invisible collapse");
                $("#logoutBtn").removeClass("invisible collapse");

                updateProfile();
            } else {
                // Automatically logout the user
                localStorage.removeItem("remMe");
                localStorage.removeItem("email");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

// Save the profile information
$("#saveBtn").on("click", async () => {
    await axios
        .get(`${baseURL}/verifyHeader`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            // Checks if the user_id in local storage and jwt token are the same.
            if (response.data.user_id == user_id) {
                // Check if the username, email or contact are empty
                if ($("#username").val() == "" || $("#email").val() == "" || $("#contact").val() == "") {
                    alert("Please fill in all fields");
                    return
                }
                
                // Check if the user is trying to change the password
                // Breaks out of the function
                if ($("#passDiv").hasClass("invisible")) {
                    console.log("No password change");

                    // Change buttons to edit and logout
                    $("#saveBtn").addClass("invisible collapse");
                    $("#cancelBtn").addClass("invisible collapse");
                    $("#editBtn").removeClass("invisible collapse");
                    $("#logoutBtn").removeClass("invisible collapse");

                    // Change password button
                    $("#changePassBtn").removeClass("invisible collapse");

                    // Change the inputs to be editable
                    $("#username").attr("readonly", true);
                    $("#email").attr("readonly", true);
                    $("#contact").attr("readonly", true);

                    // ! Input Validation

                    updateProfile()
                    // window.location.reload()
                    return
                } 

                // If so, check if the password is empty
                if ($("#password").val() == $("#confirmPass").val() && $("#password").val() != "") {    
                    // Change buttons to edit and logout
                    $("#saveBtn").addClass("invisible collapse");
                    $("#cancelBtn").addClass("invisible collapse");
                    $("#editBtn").removeClass("invisible collapse");
                    $("#logoutBtn").removeClass("invisible collapse");

                    // Clears the error message
                    $(".errorFont").addClass("invisible collapse")

                    // Change password button
                    $("#changePassBtn").removeClass("invisible collapse");

                    // Change the inputs to be editable
                    $("#username").attr("readonly", true);
                    $("#email").attr("readonly", true);
                    $("#contact").attr("readonly", true);

                    // Saves changes and updates it
                    updateProfile();
                    return
                } else {
                    // returns password and confirm password not matching
                    $(".errorFont").removeClass("invisible collapse")
                }


            } else {
                // Automatically logout the user
                localStorage.removeItem("remMe");
                localStorage.removeItem("email");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

// Make all fields editable again
// Show the password fields
$("#changePassBtn").on("click", () => {
    // Change buttons to update and cancel
    $("#saveBtn").removeClass("invisible collapse");
    $("#cancelBtn").removeClass("invisible collapse");
    $("#editBtn").addClass("invisible collapse");
    $("#logoutBtn").addClass("invisible collapse");

    // Change password button
    $("#changePassBtn").addClass("invisible collapse");

    // Change the inputs to be editable
    $("#username").removeAttr("readonly");
    $("#email").removeAttr("readonly");
    $("#contact").removeAttr("readonly");
    $("#passDiv").removeClass("invisible collapse");
    $("#confirmPassDiv").removeClass("invisible collapse");
});

$("#logoutBtn").on("click", () => {
    // localStorage.removeItem("remMe");
    // localStorage.removeItem("email");
    localStorage.removeItem("token");
    window.location.href = "/login";
});

$("#cancelBtn").on("click", () => {
    // Change buttons to edit and logout
    $("#saveBtn").addClass("invisible collapse");
    $("#cancelBtn").addClass("invisible collapse");
    $("#editBtn").removeClass("invisible collapse");
    $("#logoutBtn").removeClass("invisible collapse");

    // Change password button
    $("#changePassBtn").removeClass("invisible collapse");

    // Change the inputs to be editable
    $("#username").attr("readonly", true);
    $("#email").attr("readonly", true);
    $("#contact").attr("readonly", true);
    
    // Remove the password fields
    $("#password").val('')
    $("#confirmPass").val('')
    $("#passDiv").addClass("invisible collapse");
    $("#confirmPassDiv").addClass("invisible collapse");

    $(".errorFont").addClass("invisible collapse")

    // Clear profile information
    $("#userInfo").clear()
    $("profileInfo").clear()
    // Reloads profile
    loadProfile()
});

// ! Uploading of images isn't working yet
var updateProfile = async () => {
    var {user_id, role} = await axios
        .get(`${baseURL}/verifyHeader`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        })
    console.log("Sent password")
    console.log($("#password").val())

    await axios
        .put(
            `${baseURL}/users/${user_id}`,
            {
                user_id: localStorage.getItem("user_id"),
                username: $("#username").val(),
                email: $("#email").val(),
                contact: $("#contact").val(),
                role: $("#role").val(),
                password: $("#password").val(),
                profile_pic_url: $("#imageFile")[0].files[0]
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        )
        .then((response) => {
            // Remove the password fields for next attempt after saving.
            $("#password").val('')
            $("#confirmPass").val('')
            $("#passDiv").addClass("invisible collapse");
            $("#confirmPassDiv").addClass("invisible collapse");

            // Update the information being displayed
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        });
    // Needs to wait for data to be processed before reloads
    await window.location.reload()
};
