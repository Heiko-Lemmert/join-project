const currentDate = new Date();
let currentHour = currentDate.getHours();

function init() {
    setWelcomeText();
}

function setWelcomeText() {
    const welcomeText = document.getElementById('welcomeText');
    if (currentHour >= 6 && currentHour <= 11) {
        welcomeText.innerText = 'Good Morning,'
    } else if (currentHour >= 12 && currentHour <= 17) {
        welcomeText.innerText = 'Good Afternoon,'
    } else if (currentHour >= 18 && currentHour <= 22) {
        welcomeText.innerText = 'Good Evening,'
    } else {
        welcomeText.innerText = 'Good Night,'
    }
}