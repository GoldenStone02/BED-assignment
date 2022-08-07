/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

$(document).ready(() => {

    // Check if there is a new user that signed up
    // Stores token onto local storage
    if (localStorage.getItem("remMe") == "true") {
        $("#email").val(localStorage.getItem("email"));
        $("#remMe").prop("checked", true);
    } else {
        $("#remMe").prop("checked", false);
    }

});

// For the sign up page
var input = () => {
    rememberMe();
    hide();
}

var hide = () => {
    // If error is detected, hide the error message
    if (!$("#error").hasClass("invisible")) {
        $("#error").addClass("invisible collapse")
    }
}

var rememberMe = () => {
    if ($("#remMe").is(":checked")) {
        localStorage.setItem("email", $("#email").val());
        localStorage.setItem("remMe", true)
    } else {
        localStorage.setItem("email", "");
        localStorage.setItem("remMe", false)
    }
};

var loginFunction = async () => {

    var email = $("#email").val();
    var password = $("#password").val();

    // POST request
    await axios.post(`${baseURL}/login`, {
        email: email, 
        password: password
    })
    .then((response) => {
        console.log(response.data)
        var { token, user_id } = response.data
        localStorage.setItem("token", token)
        if ($("#remMe").is(":checked")) {
            localStorage.setItem("email", email);
            localStorage.setItem("remMe", true)
        }
        window.location.href = `${baseURL}/profile`
        return response
    })
    .catch((err) => {
        if (err.response.status == 401) {
            $("#error").removeClass("invisible collapse")
        }
        console.log(err)
        return err
    })

};

var loadPage = async () => {
    await axios
        .get(`/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((response) => {
            console.log("test")
            console.log(response)
        })
        .catch((err) => {
            console.log(err)
        })
}


// Checks if data has been tampered with
const token = localStorage.getItem("token");
window.addEventListener("storage", () => {
    const newToken = localStorage.getItem("token");
    if (newToken != token) {
        localStorage.setItem("token", token);
        window.location.reload();
    }
}, false);