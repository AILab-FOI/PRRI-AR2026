let markerStatus = {
  "walkmanMarker": false,
  "awakenedPC": false,
  "pagerMarker": false,
  "antennaMarker": false,
  "numbersMarker": false,
  "neonApollo": false,
  "wallClock": false,
  "memoryMarker": false,
  "rebusMarker": false,
  "romanMarker": false
};

document.addEventListener('DOMContentLoaded', (event) => {
  const walkmanMarker = document.querySelector('a-marker[id="walkmanMarker"]');
  const awakenedPC = document.querySelector('a-marker[id="awakenedPC"]');
  const pagerMarker = document.querySelector('a-marker[id="pagerMarker"]');
  const antennaMarker = document.querySelector('a-marker[id="antennaMarker"]');
  const numbersMarker = document.querySelector('a-marker[id="numbersMarker"]');
  const neonApollo = document.querySelector('a-marker[type="pattern"][url="Patterns/Zagonetka4_G.patt"]');
  const wallClock = document.querySelector('a-marker[type="pattern"][url="Patterns/Zagonetka5_C.patt"]');
  const memoryMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Memory_pattern.patt"]');
  const rebusMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Rebus_pattern.patt"]');
  const romanMarker = document.querySelector('a-marker[type="pattern"][url="Patterns/Julius_Caesar_pattern.patt"]');


  /* Zadatak 1A */
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

  /* Zadatak 1B */
  awakenedPC.addEventListener('markerFound', function () {
    if (markerStatus["awakenedPC"]) return;
    Swal.fire({
      position: 'top-start',
      title: 'Zadatak 1B',
      html: 'Pronašao si Računalo! <br> Poslušaj ponovno i rješenje je slovo koje se najviše puta ponavlja!',
    });
  });

  /* Zadatak 2A */
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

  /* Zadatak 2B */
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

  /* Zadatak 3 */
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

  /* Zadatak 5 */
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

  /* Zadatak 6 */
  let memoryGameStarted = false;

  memoryMarker.addEventListener('markerFound', () => {
    if (memoryGameStarted) return;
    memoryGameStarted = true;

    showMemoryIntro();
  });

  function showMemoryIntro() {
    Swal.fire({
      title: 'Zadatak 6',
      html: `<div style="color:#00ffcc"><b>NEURONIC MEMORY GRID</b><br>Pronađi jedini stabilni par u sustavu.</div>`,
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        startMemoryGame();
      } else {
        memoryGameStarted = false;
      }
    });
  }

  /* Zadatak 7 */
  rebusMarker.addEventListener('markerFound', function () {
    if (markerStatus["rebusMarker"]) return;

    const validAnswers = ["in bewtween jobs", "izmedu posla", "izmedu dva posla", "posao u poslu", "poso u poslu"];

    Swal.fire({
      position: 'top-start',
      title: 'Zadatak 7',
      html: `
      <div style="font-size: 22px; font-weight: bold; letter-spacing: 4px; margin-bottom: 16px; font-family: monospace;">
        JOBINJOB
      </div>
      <p style="font-size: 14px; color: #666;">Što se nalazi između dviju riječi?</p>
      <input id="rebus-input" class="swal2-input" placeholder="Upiši odgovor..." autocomplete="off">
      <div id="rebus-feedback" style="min-height: 20px; font-size: 13px; margin-top: 8px;"></div>
    `,
      confirmButtonText: 'Provjeri',
      confirmButtonColor: '#7F77DD',
      showCancelButton: false,
      allowOutsideClick: false,
      preConfirm: () => {
        const val = document.getElementById('rebus-input').value.trim().toLowerCase();
        const fb = document.getElementById('rebus-feedback');

        if (validAnswers.includes(val)) {
          return true; // točno
        } else {
          fb.style.color = 'red';
          fb.textContent = 'Nije točno, pokušaj ponovo!';
          return false; // ostaje otvoren
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        markerStatus["rebusMarker"] = true;

        Swal.fire({
          title: 'Točno!',
          html: `
          <p>Nagrađuješ se slovom:</p>
          <div style="font-size: 64px; font-weight: bold; color: #3B6D11; letter-spacing: 8px;">N</div>
        `,
          confirmButtonText: 'Nastavi',
          confirmButtonColor: '#3B6D11',
          icon: 'success'
        });
      }
    });
  });

  /* Zadatak 8 */
  romanMarker.addEventListener('markerFound', function () {
    if (markerStatus["romanMarker"]) return;

    Swal.fire({
      position: 'top-start',
      title: 'Zadatak 8',
      html: `
            <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
                Pretvori rimske brojeve i zbroji ih
            </p>
            <div style="
                font-family: monospace;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 3px;
                background: #f5f5f5;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 16px;
            ">
                DCLXXV + MDXLIII = ???
            </div>
            <p style="font-size: 12px; color: #999; margin-bottom: 12px;">
                Upiši rezultat kao broj
            </p>
            <input
                id="roman-input"
                class="swal2-input"
                type="number"
                placeholder="Upiši broj..."
                style="text-align: center;"
            >
            <div id="roman-feedback" style="min-height: 20px; font-size: 13px; margin-top: 8px;"></div>
        `,
      confirmButtonText: 'Provjeri',
      confirmButtonColor: '#7F77DD',
      showCancelButton: false,
      allowOutsideClick: false,
      preConfirm: () => {
        const val = parseInt(document.getElementById('roman-input').value);
        const fb = document.getElementById('roman-feedback');

        if (isNaN(val)) {
          fb.style.color = 'red';
          fb.textContent = 'Upiši broj prije provjere!';
          return false;
        }

        if (val === 2218) {
          return true;
        } else {
          fb.style.color = 'red';
          fb.textContent = `${val} nije točno. Pokušaj ponovo!`;
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        markerStatus["romanMarker"] = true;

        fetch('/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ marker_id: 'romanMarker' })
        });

        window.dispatchEvent(new CustomEvent('markerSolved', {
          detail: { markerId: 'romanMarker' }
        }));

        Swal.fire({
          title: 'Točno!',
          html: `
                    <p>DCLXXV = 675, MDXLIII = 1543</p>
                    <p>675 + 1543 = <strong>2218</strong></p>
                    <p style="margin-top: 12px;">Nagrađuješ se slovom:</p>
                    <div style="font-size: 64px; font-weight: bold; color: #3B6D11; letter-spacing: 8px;">I</div>
                `,
          confirmButtonText: 'Nastavi',
          confirmButtonColor: '#3B6D11',
          icon: 'success'
        });
      }
    });
  });
});