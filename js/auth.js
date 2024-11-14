/**
 * Checks if a user is logged in by verifying the presence of a user token in localStorage.
 * If a user is logged in, the page is displayed; otherwise, it redirects to the login page.
 */
function checkUserLoggedIn() {
    const user = localStorage.getItem("currentUser");
    if (user) {
        document.body.style.visibility = "visible";
    } else {
        window.location.href = "index.html";
    }
}

/**
 * Logs out the current user by removing the user token from localStorage and redirecting to the login page.
 */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
    document.body.style.visibility = "hidden";
}