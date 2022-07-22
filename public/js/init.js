const baseURL = "http://localhost:8080";
// Check if the user is logged in
$(document).ready(() => {
    $('[data-toggle="tooltip"]').tooltip();
    if (localStorage.getItem("token") != null) {
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
        localStorage.removeItem("user_id");
    } else {
        localStorage.removeItem("remMe")
        localStorage.removeItem("email")
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
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
            console.log(response)
            if (response.data.role == "admin") {
                // Show the admin control panel
                // Ensure that the admin routes are protected
                console.log("Admin Panel")
                $("#accHandler").prepend(`
                <div class="nav-item">
                    <a href="/admin-panel" class="nav-link mx-4">
                        <span data-toggle="tooltip" title="Settings">
                        <i class="fa-solid fa-gear"></i>
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
            } else if (response.data.role == "customer") {
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


// // Splitting array into segmented chunks
// // Resource: https://fedingo.com/how-to-split-array-into-chunks-in-javascript/
// array = [(1,2,7,7),(3,5,6,9)]
// array.forEach((e) => {
    
// })
