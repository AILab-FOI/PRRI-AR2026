
document.addEventListener('DOMContentLoaded', (event) => {
    const headphonesMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Headphones_pattern.patt"]');
    const radioMarker=document.querySelector('a-marker[type="pattern"][url="Patterns/Radio_pattern.patt"]');

    headphonesMarker.addEventListener('markerFound', function() {
      window.confirm("Code: .-. .- -.. .. .--- .- - --- .-. ");
      
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
      
    });
  
    headphonesMarker.addEventListener('markerLost', function() {
    });

    radioMarker.addEventListener('markerFound', function() {
      console.log('Radio marker found!');
      window.confirm("1010110 1000101 1000100 1010100 1000101");

    });
  });

  //kada se marker skenira šalje se potvrda skena na beckend
  //updejta se json na beckendu
  //kada su oba skenirana, prikazuje se poruka na ekranu korisnika da je zadatak završen
  //flag = true