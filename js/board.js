let loadAllTasks = [];
let currentTaksName = [];



/*
async function getTasks() {
    //von der Api daten ziehen und im array speichern

    setTimeout(async () => {
        for (let i = 1; i <= 20; i++) {
            let url = ``;//url einfügen
            let response = await fetch(url);
            let currentTask = await response.json();
            loadAllTasks.push(currentTask);
        }

    }, 500);

}


*/
function renderCode() {
    dagAndDrop();
    checkForEmptyLists();
    checkForList();
    initializeImageHover();
    includeHTML();
}

/*
function filterAndShowNames() { //suchfunktion
    let filterWord = document.getElementById('filterTaskInput').value.toLowerCase();
    currentTaksName = loadAllTasks.filter( => .toLowerCase().includes(filterWord));
    renderTasks();
}


function renderTasks() { //rendern von gefilterten Tasks
    let container = document.getElementById('taskArea');
    container.innerHTML = '';
    for (let i = 0; i < currentTaksName.length; i++) {
        let task = currentTaksName[i];
        container.innerHTML += `
            <div class="list" draggable="true">
                <h3>${task.name}</h3>
                <p>${task.description}</p>
            </div>
          
        `;
    }
}

*/



// Funktion zur Überprüfung der Listen auf leere Inhalte
function checkForEmptyLists() {         //Diese Funktion dient dazu, die Anzeige der Meldung "No tasks" zu steuern, je nachdem, ob in den jeweiligen Containern (div-Elementen) Aufgaben (list-Elemente) vorhanden sind oder nicht.
    let boxIds = ["left", "leftNum2", "right", "rightNum2"];  //: Eine Variable, die ein Array von IDs speichert
    for (let i = 0; i < boxIds.length; i++) { //wir iterieren über die länge der variable
        let box = document.getElementById(boxIds[i]); //definieren eine variable , und holen uns das jeweilige id name des divs
        let lists = box.querySelectorAll(".list");//Findet alle Elemente innerhalb des aktuellen Containers (box), die die Klasse .list haben, und speichert sie als NodeList in der Variablen lists.

        let noTaskSpanList = box.querySelectorAll(".noTaskSpan");//struktur : let element = document.querySelectorAll('selector'); Erklärung : sucht innerhalb des Containers (box) nach alle Elemente, das die Klasse .noTaskSpan hat.
        //querySelector wird auf ein Dokument (document) oder ein bestimmtes Element angewendet und akzeptiert einen String als Parameter. Dieser String ist ein CSS-Selektor, der verwendet wird, um das gewünschte Element zu finden.
        if (lists.length === 0) { //Überprüft, ob die NodeList lists keine Aufgaben (list-Elemente) enthält (lists.length === 0).
            if (noTaskSpanList.length > 0) { //Was macht es?    Überprüft, ob es mindestens ein span-Element mit der Klasse .noTaskSpan im aktuellen Container gibt (noTaskSpanList.length > 0).
                noTaskSpanList[0].style.display = "block"; // Wenn ja, greift es auf das erste dieser Elemente zu (noTaskSpanList[0]) und setzt dessen CSS-Eigenschaft display auf "block", um die Meldung anzuzeigen.
            }
        } else { // Wenn Listen-Elemente vorhanden sind
            if (noTaskSpanList.length > 0) { // Überprüfe erneut, ob es mindestens ein "No tasks"-Element gibt
                noTaskSpanList[0].style.display = "none"; // Wenn ja, greift es auf das erste dieser Elemente zu (noTaskSpanList[0]) und setzt dessen CSS-Eigenschaft display auf "none", um die Meldung auszublenden.
            }
        }
    }

}
function checkForList() {
    // Wählen Sie alle Elemente mit der Klasse "scroll-div"
    let scrollDivs = document.querySelectorAll(".scroll-div");

    // Iterieren Sie über die ausgewählten Elemente
    for (let i = 0; i < scrollDivs.length; i++) {
        let scrollDiv = scrollDivs[i]; // Greifen Sie auf das aktuelle Element zu
        let lists = scrollDiv.querySelectorAll(".list"); // Suchen Sie nach '.list'-Elementen innerhalb dieses 'div'

        // Überprüft, ob keine '.list'-Elemente vorhanden sind
        if (lists.length === 0) {
            scrollDiv.style.overflowY = "hidden"; // Scrollleiste entfernen
        } else {
            scrollDiv.style.overflowY = "scroll"; // Scrollleiste hinzufügen
        }
    }
}

function dagAndDrop() {
    let lists = document.getElementsByClassName("list");
    let rightBox = document.getElementById("right");
    let leftBox = document.getElementById("left");
    let rightBoxNum2 = document.getElementById("rightNum2");
    let leftBoxNum2 = document.getElementById("leftNum2");
    let selected = null;

    for (let list of lists) {
        list.addEventListener("dragstart", function (e) {
            selected = e.target;
        });
    }

    function setupDropArea(box) {
        box.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        box.addEventListener("drop", function (e) {
            box.appendChild(selected);
            selected = null;
            checkForList();//die Funktion checkForList() nach dem Verschieben der Liste erneut aufrufen, damit die Scrollleisten in beiden div-Elementen aktualisiert werden
            checkForEmptyLists();
        });
    }

    setupDropArea(rightBox);
    setupDropArea(rightBoxNum2);
    setupDropArea(leftBox);
    setupDropArea(leftBoxNum2);
}


function openList() {
    let content = document.getElementById('bigViewList');
    content.innerHTML = `
     <div class="background-bigListView">
               <div class="inner-bigListView">
                  <div class="content-bigListView">
                  <div class="top-content-bigListView">
                           <span > text </span>
                    <span class="close-bigListView-button" onclick="closeViewList()"> X </span>
       
                   </div>
                  </div>
               </div>
            </div>    
    `;
}

function closeViewList() {
    document.getElementById('bigViewList').innerHTML = '';
}
function initializeImageHover() {
    // Finde alle Bild-Elemente mit der Klasse 'hover-image'
    const hoverImages = document.querySelectorAll('.hover-image');
  
    // Durchlaufe alle gefundenen Bild-Elemente
    hoverImages.forEach(function (hoverImage) {
      // Füge einen Event-Listener hinzu, der auf das "mouseenter" Event hört
      hoverImage.addEventListener('mouseenter', function () {
        hoverImage.src = 'img/plusButton.transiction.png'; // Bildquelle ändern, wenn die Maus darüber schwebt
      });
  
      // Füge einen Event-Listener hinzu, der auf das "mouseleave" Event hört
      hoverImage.addEventListener('mouseleave', function () {
        hoverImage.src = 'img/plusButton.png'; // Ursprüngliche Bildquelle wiederherstellen, wenn die Maus das Bild verlässt
      });
    });
  }
  
  // Stelle sicher, dass die Funktion beim Laden der Seite aufgerufen wird
  window.onload = function () {
    renderCode(); // Deine vorhandene Funktion, die bereits beim Laden der Seite aufgerufen wird
    initializeImageHover(); // Die neue Funktion, die den Hover-Effekt hinzufügt
  };
  
  