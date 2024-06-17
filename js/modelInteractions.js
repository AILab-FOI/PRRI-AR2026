
document.addEventListener('DOMContentLoaded', (event) => {
  const headphonesMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Headphones_pattern.patt"]');
  const radioMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Radio_pattern.patt"]');
  const kalkulatorMarker= document.querySelector('a-marker[type="pattern"][url="Patterns/Kalkulator_pattern.patt"]');
  headphonesMarker.addEventListener('markerFound', function () {

    Swal.fire({
      position: 'top-start',
      title: 'Puzzle 1',
      text: "Code: .-. .- -.. .. .--- .- - --- .-. ",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#4CAF50',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel'
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
      }
    })


  });

  radioMarker.addEventListener('markerFound', function () {
    Swal.fire({
      position: 'top-start',
      title: 'Puzzle 1-2',
      text: "Code: 1010110 1000101 1000100 1010100 1000101",
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#4CAF50',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel'
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
    })

  });
});

//kada se marker skenira šalje se potvrda skena na beckend
//updejta se json na beckendu
//kada su oba skenirana, prikazuje se poruka na ekranu korisnika da je zadatak završen
//flag = true