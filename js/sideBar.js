
document.addEventListener('DOMContentLoaded', function() {
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
});
