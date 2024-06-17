let markerStatus = {
  "headphonesMarker": false,
  "radioMarker": false,
  "kalkulatorMarker": false,
  "laptopMarker": false,
  "consoleMarker": false,
  "disketaMarker": false,
  "phoneMarker": false,
  "wallScreenMarker": false,
  "keypadMarker": false
};

document.addEventListener('DOMContentLoaded', (event) => {
  const headphonesMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Headphones_pattern.patt"]');
  const radioMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Radio_pattern.patt"]');
  const kalkulatorMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Calculator_pattern.patt"]');
  const laptopMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Laptop_pattern.patt"]');
  const consoleMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Hand_scanner_pattern.patt"]');
  const disketaMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Game_cartridge_pattern.patt"]');
  const phoneMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Phone_pattern.patt"]');
  const wallScreenMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Wall_screen_pattern.patt"]');
  const keypadMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Keypad_pattern.patt"]');

  headphonesMarker.addEventListener('markerFound', function () {
    if (markerStatus["headphonesMarker"]) return;

    Swal.fire({
      position: 'top-start',
      title: 'Puzzle 1',
      text: "Code: .-. .- -.. .. .--- .- - --- .-. ",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#4CAF50',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Do not show again'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/scan', {
          method: 'POST',
          body: JSON.stringify({ marker_id: "headphones", player: 'player1' }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response from the backend
            console.log(data);
          })
          .catch(error => {
            console.error(error);
          });
      } else if (result.isDismissed) {
        markerStatus["headphonesMarker"] = true;
      }
    })
  });

  radioMarker.addEventListener('markerFound', function () {
    if (markerStatus["radioMarker"]) return;
    Swal.fire({
      position: 'top-start',
      title: 'Puzzle 1-2',
      text: "Code: 1010110 1000101 1000100 1010100 1000101",
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#4CAF50',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Do not show again'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/scan', {
          method: 'POST',
          body: JSON.stringify({ marker_id: "radio", player: 'player1' }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response from the backend
            console.log(data);
          })
          .catch(error => {
            console.error(error);
          });
      }
      else if (result.isDismissed) {
        markerStatus["radioMarker"] = true;
      }
    })

  });

  kalkulatorMarker.addEventListener('markerFound', function () {
    if (markerStatus["kalkulatorMarker"]) return;
    Swal.fire({
      position: 'top-start',
      icon: 'question',
      title: 'Puzzle 2-1',
      text: "A + B + C + D = ?",
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#4CAF50',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Do not show again'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/scan', {
          method: 'POST',
          body: JSON.stringify({ marker_id: "kalkulator", player: 'player1' }),
          headers: {
            'Content-Type': 'application/json'
          }

        })
          .then(response => response.json())
          .then(data => {
            // Handle the response from the backend
            console.log(data);
          })
          .catch(error => {
            console.error(error);
          });
      }
      else if (result.isDismissed) {
        markerStatus["kalkulatorMarker"] = true;
      }
    })


  }
  );

  laptopMarker.addEventListener('markerFound', function () { 
    if (markerStatus["laptopMarker"]) return;
    Swal.fire({
      position: 'top-start',
      icon: 'question',
      title: 'Puzzle 2-2',
      text: "Pronalaziš laptop, šta ćeš uraditi?",
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#4CAF50',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Do not show again'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/scan', {
          method: 'POST',
          body: JSON.stringify({ marker_id: "laptop", player: 'player1' }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response from the backend
            console.log(data);
          })
          .catch(error => {
            console.error(error);
          });
      }
      else if (result.isDismissed) {
        markerStatus["laptopMarker"] = true;
      }
    })
  
  });

  consoleMarker.addEventListener('markerFound', function () {
    if (markerStatus["consoleMarker"]) return;
    Swal.fire({
      position: 'top-start',
      icon: 'question',
      title: 'Puzzle 3-1',
      text: "U igraćoj konzoli je zaglavljena disketa, koja je šifra da ona izađe vanka?",
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#4CAF50',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Do not show again'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/scan', {
          method: 'POST',
          body: JSON.stringify({ marker_id: "terminal", player: 'player1' }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response from the backend
            console.log(data);
          })
          .catch(error => {
            console.error(error);
          });
      }
      else if (result.isDismissed) {
        markerStatus["consoleMarker"] = true;
      }
    })
  });

  disketaMarker.addEventListener('markerFound', function () {
    if (markerStatus["disketaMarker"]) return;
    Swal.fire({
      position: 'top-start',
      icon: 'question',
      title: 'Puzzle 3-2',
      text: "Slika govori više od tisuću riječi...",
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#4CAF50',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Do not show again'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/scan', {
          method: 'POST',
          body: JSON.stringify({ marker_id: "disketa", player: 'player1' }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response from the backend
            console.log(data);
          })
          .catch(error => {
            console.error(error);
          });
      }
      else if (result.isDismissed) {
        markerStatus["disketaMarker"] = true;
      }
    })
  });
  
  phoneMarker.addEventListener('markerFound', function () {
    if (markerStatus["phoneMarker"]) return;
    Swal.fire({
      position: 'top-start',
      icon: 'question',
      title: 'Puzzle 6-1',
      text: "444 9999 2 7 555 666 222 33",
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#4CAF50',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Do not show again'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/scan', {
          method: 'POST',
          body: JSON.stringify({ marker_id: "phone", player: 'player1' }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response from the backend
            console.log(data);
          })
          .catch(error => {
            console.error(error);
          });
      }
      else if (result.isDismissed) {
        markerStatus["phoneMarker"] = true;
      }
    })
  });

  wallScreenMarker.addEventListener('markerFound', function () {
    if (markerStatus["wallScreenMarker"]) return;
    Swal.fire({
      position: 'top-start',
      icon: 'question',
      title: 'Puzzle 6-2',
      text: "Riješi zagonetku na zidnom ekranu!",
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#4CAF50',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Do not show again'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/scan', {
          method: 'POST',
          body: JSON.stringify({ marker_id: "wallScreen", player: 'player1' }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response from the backend
            console.log(data);
          })
          .catch(error => {
            console.error(error);
          });
      }
      else if (result.isDismissed) {
        markerStatus["wallScreenMarker"] = true;
      }
    })
  });

  keypadMarker.addEventListener('markerFound', function () {
    Swal.fire({
      position: 'top-start',
      icon: 'question',
      title: 'Final puzzle',
      text: "Kombinacijom svih prethodnih šifri na kraju zagonetki, otključaj vrata!",
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Do not show again'
    }).then((result) => {
      if(result.isConfirmed && result.value=="NEURON") {
        Swal.fire({
          icon: 'success',
          title: 'Congratulations!',
          text: 'Čestitamo, uspješno ste riješili sve zagonetke i otključali vrata!',
          confirmButtonColor: '#4CAF50',
          confirmButtonText: 'Ok'
        });
      }
      else if(result.isConfirmed && result.value!="NEURON") {
        Swal.fire({
          icon: 'error',
          title: 'Wrong answer!',
          text: 'Pokušajte ponovo!',
          confirmButtonColor: '#4CAF50',
          confirmButtonText: 'Ok'
        });
      }
      else{
        return;
      }
    })
  });
});