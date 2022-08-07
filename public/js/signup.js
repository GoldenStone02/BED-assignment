/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

// For the sign up page
var input = () => {
    // If error is detected, hide the error message
    if (!$("#error").hasClass("invisible")) {
        $("#error").addClass("invisible collapse")
    }
}


var signupFunction = async () => {
    console.log("test")
    var username = $("#username").val()
    var email = $("#email").val()
    var contact = $("#contact").val()
    var password = $("#password").val()
    var confirmPassword = $("#confirm-password").val()

    // Check if fields are empty
    if (username == "" || email == "" || contact == "") {
        $("#error").html("Please fill in all the fields")
        $("#error").removeClass("invisible collapse")
        return
    }

    // Check if contact is valid
    if (contact.length != 8) {
        $("#error").html("Please enter a valid contact number")
        $("#error").removeClass("invisible collapse")
        return
    }

    // Check if the password and confirm password are the same and not empty
    if (password != confirmPassword || password == "") {
        $("#error").html("Password does not match/is empty")
        $("#error").removeClass("invisible collapse")
        return
    }

    await axios
        .post(`${baseURL}/users`, {
            username: username,
            email: email,
            password: password,
            contact: contact,
            role: "customer",
            profile_pic_url: $("#imageFile")[0].files[0]
        })
        .then((response) => {
            console.log(response.data)
            window.location.href = `${baseURL}/login`
            return response
        })
        .catch((err) => {
            if (err.response.status == 422) {
                $("#error").html("Username/Email already exists")
                $("#error").removeClass("invisible collapse")
            }
            $("#error").removeClass("invisible collapse")
            console.log(err)
        })
}