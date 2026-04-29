let markerStatus = {
  "headphonesMarker": false,
  "radioMarker": false,
  "kalkulatorMarker": false,
  "laptopMarker": false,
  "consoleMarker": false,
  "disketaMarker": false,
  "phoneMarker": false,
  "wallScreenMarker": false,
  "keypadMarker": false,
  "walkmanMarker": false,
  "awakenedPC": false,
  "pagerMarker": false,
  "antennaMarker": false,
  "numbersMarker": false,
  "neonApollo": false
};

document.addEventListener('DOMContentLoaded', (event) => {
  const headphonesMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Headphones_pattern.patt"]');
  const radioMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Radio_pattern.patt"]');
  const kalkulatorMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Calculator_pattern.patt"]');
  const laptopMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Laptop_pattern.patt"]');
  const consoleMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Hand_scanner_pattern.patt"]');
  const disketaMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Game_cartridge_pattern.patt"]');
  const walkmanMarker = document.querySelector('a-marker[id="walkmanMarker"]');
  const awakenedPC = document.querySelector('a-marker[id="awakenedPC"]');
  const pagerMarker = document.querySelector('a-marker[id="pagerMarker"]');
  const antennaMarker = document.querySelector('a-marker[id="antennaMarker"]');
  const wallScreenMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Wall_screen_pattern.patt"]');
  const keypadMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Keypad_pattern.patt"]');
  const numbersMarker = document.querySelector('a-marker[id="numbersMarker"]');
  const neonApollo = document.querySelector('a-marker[type="pattern"][url="Patterns/Zagonetka4_G.patt"]');
  const wallClock = document.querySelector('a-marker[type="pattern"][url="Patterns/Zagonetka5_C.patt"]');

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

  walkmanMarker.addEventListener('markerFound', function () {
    if (markerStatus["walkmanMarker"]) return;
    Swal.fire({
      position: 'top-start',
      title: 'Zadatak 1A!',
      html: 'Pronašao si Walkman! <br> Pritisni Play za reproduciranje poruke...',
      confirmButtonColor: '#4CAF50',
      confirmButtonText: 'Play',
      showCancelButton: false
    }).then((result) => {
      if (result.isConfirmed) {
        const audio = document.getElementById('walkmanAudio');
        audio.play();
      }
    });
  });

  awakenedPC.addEventListener('markerFound', function () {
    if (markerStatus["awakenedPC"]) return;
    Swal.fire({
      position: 'top-start',
      title: 'Zadatak 1B',
      html: 'Pronašao si Računalo! <br> Poslušaj ponovno i rješenje je slovo koje se najviše puta ponavlja!',
    });
  });

  pagerMarker.addEventListener('markerFound', function () {
    if (markerStatus["pagerMarker"]) return;
    Swal.fire({
      position: 'top-start',
      title: 'Zadatak 2A',
      html: '📟 INCOMING SIGNAL...<br><br><b>DATA</b><br><br>⚠️ SIGNAL DISTORTED<br><br>Signal je oštećen. Prenesi informaciju drugom igraču!',
      confirmButtonColor: '#4CAF50',
      confirmButtonText: 'Ok'
    });
  });

  antennaMarker.addEventListener('markerFound', function () {
    if (markerStatus["antennaMarker"]) return;
    Swal.fire({
      position: 'top-start',
      title: 'Zadatak 2B',
      html: '📡 SIGNAL RECEIVED<br><br>Uputa: <b>SHIFT EACH CHARACTER -2</b><br><br>Primijeni pravilo na signal koji ti je prenio drugi igrač.<br>Uzmi <b>drugo</b> slovo iz dobivenog niza.',
      confirmButtonColor: '#4CAF50',
      confirmButtonText: 'Ok'
    });
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

  numbersMarker.addEventListener('markerFound', function () {
    if (markerStatus["numbersMarker"]) return;
    Swal.fire({
      position: 'top-start',
      title: 'Zadatak 3',
      html: '🔢 Uzmi prva dva broja iz modela.<br><br><b>CONVERT TO HEX</b><br><br>Koji je heksadecimalni zapis tog broja?',
      confirmButtonColor: '#4CAF50',
      confirmButtonText: 'Ok'
    });
  });

  /* Zadatak 4 */

  neonApollo.addEventListener('markerFound', function () {
    if (markerStatus["neonApollo"]) return;
    Swal.fire({
      position: 'top-start',
      title: 'Zadatak 4',
      html: '<div style="font-size:18px;"><i>STARO LICE U NOVOM SJAJU</i><br><br><i>UZMI SAMO GLASOVE BUDUĆNOSTI</i><br><br><span style="font-size:26px; color:#00ffff;"><b>NEONSKE</b></span></div>',
      confirmButtonColor: '#4CAF50',
      confirmButtonText: 'Ok'
    });
  });

  wallClock.addEventListener('markerFound', function () {
    if (markerStatus["wallClock"]) return;
    Swal.fire({
      position: 'top-start',
      title: 'Zadatak 5',
      html: 'Pomakni manju kazaljku za 12 mjesta unaprijed. <br> Koristi slova engleske abecede počevši od A=1. <br> Bez ponavljanja slova.',
      confirmButtonColor: '#4CAF50',
      confirmButtonText: 'Ok'
    });
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
      if (result.isConfirmed) {
        fetch('/check_answer', {
          method: 'POST',
          body: JSON.stringify({ answer: result.value }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.status == 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Congratulations!',
                text: data.message,
                confirmButtonColor: '#4CAF50',
                confirmButtonText: 'Ok'
              });
            } else if (data.status == 'error') {
              Swal.fire({
                icon: 'error',
                title: 'Wrong answer!',
                text: data.message,
                confirmButtonColor: '#4CAF50',
                confirmButtonText: 'Ok'
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    });
  });
});