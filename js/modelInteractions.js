let markerStatus = {
  "headphonesMarker": false,
  "radioMarker": false,
  "kalkulatorMarker": false,
  "laptopMarker": false,
};

document.addEventListener('DOMContentLoaded', (event) => {
  const headphonesMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Headphones_pattern.patt"]');
  const radioMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Radio_pattern.patt"]');
  const kalkulatorMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Calculator_pattern.patt"]');
  const laptopMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Laptop_pattern.patt"]');
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
      title: 'Puzzle 3',
      text: "A + B + C = ?",
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
    

});

//kada se marker skenira šalje se potvrda skena na beckend
//updejta se json na beckendu
//kada su oba skenirana, prikazuje se poruka na ekranu korisnika da je zadatak završen
//flag = true