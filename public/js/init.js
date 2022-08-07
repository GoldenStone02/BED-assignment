/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const baseURL = "http://localhost:8080";
var user_id;

$(document).ready(() => {
    // Check if the user is logged in
    if (localStorage.getItem("token") != null) {
        // Returns user_id and role from the server token
        getRole()
    } else {
        console.log("Everyone can access panel")
        $("#accHandler").prepend(`
        <div class="nav-item">
            <a href="/signup" class="nav-link mx-4">
            <b>Sign up</b>
            </a>
        </div>
        <div class="nav-item">
            <a href="/login" class="nav-link mx-4">
                <span data-toggle="tooltip" data-placement="bottom" title="Log In">
                <i class="fa-solid fa-right-to-bracket"></i>
                </span>
            </a>
        </div>
        `)
    }
})

var logout = () => {
    if (localStorage.getItem("remMe") == "true") {
        localStorage.removeItem("token");
    } else {
        localStorage.removeItem("remMe")
        localStorage.removeItem("email")
        localStorage.removeItem("token");
    }
    window.location.href = "/login";
};

// Change the navbar depending on if the user is signed in or not
var getRole = async () => {
    await axios
        .get(`${baseURL}/verifyHeader`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((response) => {
            role = response.data.role
            user_id = response.data.user_id
            if (role == "admin") {
                // Show the admin control panel
                // Ensure that the admin routes are protected
                console.log("Admin Panel")
                $("#accHandler").prepend(`
                <div class="nav-item">
                    <a href="/admin-panel" class="nav-link mx-3">
                        <span data-toggle="tooltip" title="Admin Panel">
                        <i class="fa-solid fa-gear"></i>
                        </span>
                    </a>
                </div>                
                <div class="nav-item">
                    <a href="/profile" class="nav-link mx-2">
                        <span data-toggle="tooltip" data-placement="bottom" title="Account Settings">
                        <i class="fa-solid fa-user"></i>
                        </span>
                    </a>
                </div>
                <div class="nav-item">
                    <button class="btn btn-light mx-3" onclick="logout()">
                        <span data-toggle="tooltip" data-placement="bottom" title="Logout">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        </span>
                    </button>
                </div>
                `)
            } else if (role == "customer") {
                console.log("User panel")
                // Show the user profile and logout
                $("#accHandler").prepend(`
                <div class="nav-item">
                    <a href="/profile" class="nav-link mx-4">
                        <span data-toggle="tooltip" data-placement="bottom" title="Account Settings">
                        <i class="fa-solid fa-user"></i>
                        </span>
                    </a>
                </div>
                <div class="nav-item">
                    <button class="btn btn-light mx-4" onclick="logout()">
                        <span data-toggle="tooltip" data-placement="bottom" title="Logout">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        </span>
                    </button>
                </div>
                `)
            } else {
                console.log("Nothing to see here")
            }
        })
        .catch((err) => {
            console.log(err)
        })
}
