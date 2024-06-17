
document.addEventListener('DOMContentLoaded', (event) => {
    const headphonesMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Headphones_pattern.patt"]');
    const radioMarker=document.querySelector('a-marker[type="pattern"][url="Patterns/Radio_pattern.patt"]');

    headphonesMarker.addEventListener('markerFound', function() {
      console.log('Headphones marker found!');
      window.confirm("Code: .-. .- -.. .. .--- .- - --- .-. ");

    });
  
    headphonesMarker.addEventListener('markerLost', function() {
      console.log('Headphones marker lost!');
      // Here you can implement the action you want to perform when the headphones marker is lost
    });

    radioMarker.addEventListener('markerFound', function() {
      console.log('Radio marker found!');
      window.confirm("1010110 1000101 1000100 1010100 1000101");

    });
  });