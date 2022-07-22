$(document).ready(() => {
    if (!localStorage.getItem("token")) {
        window.location.href = "/login";
    }
    loadProfile();
});

var loadProfile = async () => {
    await axios
        .get(`${baseURL}/users/${localStorage.getItem("user_id")}`, {
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
                            <input type="text" name="contact" id="contact" value="${response.data.contact}" readonly required>
                        </td>
                    </tr>
                    <tr id="passDiv" class="invisible collapse">
                        <td>Password</td>
                        <td class="group">
                            <input type="password" name="password" id="password" value="" readonly required>
                        </td>
                    </tr>
                    <tr id="confirmPassDiv" class="invisible collapse">
                        <td>Confirm </td>
                        <td class="group">
                            <input type="password" name="password2" id="confirmPass" value="" required>
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
};

// Show the password fields
$("#editBtn").on("click", () => {
    // Change buttons to update and cancel
    $("#updateBtn").removeClass("invisible collapse");
    $("#cancelBtn").removeClass("invisible collapse");
    $("#editBtn").addClass("invisible collapse");
    $("#logoutBtn").addClass("invisible collapse");

    // Change the inputs to be editable
    $("#username").removeAttr("readonly");
    $("#email").removeAttr("readonly");
    $("#contact").removeAttr("readonly");
    $("#passDiv").removeClass("invisible collapse");
    $("#confirmPassDiv").removeClass("invisible collapse");
});

$("#save").on("click", async () => {
    await axios
        .get(`${baseURL}/verifyHeader`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            // Checks if the user_id in local storage and jwt token are the same.
            if (response.data.user_id == localStorage.getItem("user_id")) {
                // Check if the username, email or contact are empty
                $("#updateBtn").addClass("invisible collapse");
                $("#cancelBtn").addClass("invisible collapse");
                $("#editBtn").removeClass("invisible collapse");
                $("#logoutBtn").removeClass("invisible collapse");

                updateProfile();
                window.location.reload()

            } else {
                // Automatically logout the user
                localStorage.removeItem("remMe");
                localStorage.removeItem("email");
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                window.location.href = "/login";
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

// Update the profile information
$("#updateBtn").on("click", async () => {
    await axios
        .get(`${baseURL}/verifyHeader`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
            // Checks if the user_id in local storage and jwt token are the same.
            if (response.data.user_id == localStorage.getItem("user_id")) {
                // Check if the username, email or contact are empty
                if ($("#username").val() == "" || $("#email").val() == "" || $("#contact").val() == "") {
                    console.log(typeof($("#username").val()));
                    alert("Please fill in all fields");
                    return
                }

                console.log($("#password").val())
                console.log($("#confirmPass").val())
                if ($("#password").val() == $("#confirmPass").val() && $("#password").val() != "") {                
                    // Change buttons to edit and logout
                    $("#updateBtn").addClass("invisible collapse");
                    $("#cancelBtn").addClass("invisible collapse");
                    $("#editBtn").removeClass("invisible collapse");
                    $("#logoutBtn").removeClass("invisible collapse");

                    // Change the inputs to be editable
                    $("#username").attr("readonly", true);
                    $("#email").attr("readonly", true);
                    $("#contact").attr("readonly", true);

                    // Remove the password fields
                    $("#password").val('')
                    $("#password2").val('')
                    $("#passDiv").addClass("invisible collapse");
                    $("#confirmPassDiv").addClass("invisible collapse");

                    updateProfile();
                    // window.location.reload()
                } else {
                    console.log("Passwords do not match");
                }

            } else {
                // Automatically logout the user
                localStorage.removeItem("remMe");
                localStorage.removeItem("email");
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                window.location.href = "/login";
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

$("#logoutBtn").on("click", () => {
    localStorage.removeItem("remMe");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/login";
});

$("#cancelBtn").on("click", () => {
    // Change buttons to edit and logout
    $("#updateBtn").addClass("invisible collapse");
    $("#cancelBtn").addClass("invisible collapse");
    $("#editBtn").removeClass("invisible collapse");
    $("#logoutBtn").removeClass("invisible collapse");

    // Change the inputs to be editable
    $("#username").attr("readonly", true);
    $("#email").attr("readonly", true);
    $("#contact").attr("readonly", true);
    
    // Remove the password fields
    $("#password").val('')
    $("#password2").val('')
    $("#passDiv").addClass("invisible collapse");
    $("#confirmPassDiv").addClass("invisible collapse");
});

// ! Uploading of images isn't working yet
var updateProfile = async () => {
    await axios
        .put(
            `${baseURL}/users/${localStorage.getItem("user_id")}`,
            {
                user_id: localStorage.getItem("user_id"),
                username: $("#username").val(),
                email: $("#email").val(),
                contact: $("#contact").val(),
                role: $("#role").val(),
                password: $("#password").val(),
                // profile_pic_url: $("#imageFile").files[0]
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        )
        .then((response) => {
            // Update the information being displayed
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        });
};
