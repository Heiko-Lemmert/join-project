
  
  function openInfBox() {
    let content = document.getElementById('infoBox');
    content.innerHTML = `
      <div class="infoBox">
        <span>Legal Notice</span>
        <span>Privacy Policy</span>
        <span>Log Out</span>
      </div>
    `;
    content.style.display = 'block';
  
    // Füge den Event-Listener zum Dokument hinzu
    document.addEventListener('click', function closeOnClickOutside(event) {
      // Überprüfe, ob der Klick außerhalb der Info-Box stattfindet
      if (!event.target.closest('.infoBox') && !event.target.closest('.header-user')) {
        closeViewList();
        document.removeEventListener('click', closeOnClickOutside); // Entferne den Event-Listener, wenn geschlossen wird
      }
    });
  }
  
  function closeViewList() {
    let content = document.getElementById('infoBox');
    content.style.display = 'none';
    content.innerHTML = ''; // Entferne den Inhalt der Info-Box
  }
  