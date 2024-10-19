function checkUserLoggedIn() {
    const user = localStorage.getItem("currentUser"); 
    if (user) {
        console.log("User is logged in:", JSON.parse(user));
        document.body.style.visibility = "visible";
    } else {
        console.log("No user is logged in.");
        window.location.href = "index.html";
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    console.log("User logged out.");
    window.location.href = "index.html";
    document.body.style.visibility = "hidden";
}
