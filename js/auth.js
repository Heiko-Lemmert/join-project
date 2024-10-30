function checkUserLoggedIn() {
    const user = localStorage.getItem("currentUser"); 
    if (user) {
        document.body.style.visibility = "visible";
    } else {
        window.location.href = "index.html";
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
    document.body.style.visibility = "hidden";
}
