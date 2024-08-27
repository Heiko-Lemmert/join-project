// Für Template übegreifende JS Funktionen

// W3-HTML-Include
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            /* Remove the attribute, and call this function once more: */
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        /* Exit the function: */
        return;
      }
    }
  }

function init() {
    includeHTML();
    setTimeout(sidebarClicked, 1500);
}

  // Sidebar JS
  function sidebarClicked() {
    // Array mit den IDs der Elemente
    let ids = ['summary', 'addTask', 'board', 'contacts','privacyPolicy','legalNotice'];

    // Schleife durch die IDs der Menüelemente
    for (let i = 0; i < ids.length; i++) {
        // Wähle das Element anhand seiner ID aus
        let element = document.getElementById(ids[i]);

        // Weise dem Element einen Klick-Eventlistener zu
        element.onclick = function() {
            // Entferne die "clicked"-Klasse von allen Elementen
            for (let j = 0; j < ids.length; j++) {
                document.getElementById(ids[j]).classList.remove('clicked');
            }

            // Füge die "clicked"-Klasse nur dem geklickten Element hinzu
            this.classList.add('clicked');
        };
    }
  }