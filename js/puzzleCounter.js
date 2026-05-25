const TOTAL_PUZZLES = 10;

document.addEventListener("DOMContentLoaded", () => {
    const counterElement = document.getElementById("puzzle-counter");
    let gameOverShown = false;
    function fetchAndUpdate() {
        const url = window.LOBBY_NAME ? `/lobby/${window.LOBBY_NAME}/progress` : '/progress';
        fetch(url)
            .then(r => r.json())
            .then(data => {
                const count = data.count ?? 0;
                const total = data.total ?? TOTAL_PUZZLES;
                counterElement.textContent = `${count}/${total}`;
                window._puzzleCount = count;
                window._puzzleTotal = total;

                if (data.game_completed && !window._gameEnded) {
                    window._gameEnded = true;
                    gameOverShown = true;
                    Swal.fire({
                        title: '🏆 Igra završena!',
                        text: 'Vaš tim je riješio sve zagonetke!',
                        icon: 'success',
                        confirmButtonText: 'Povratak na početak',
                        timer: 10000,
                        timerProgressBar: true,
                        allowOutsideClick: false
                    }).then(() => {
                        window.location.href = '/';
                    });
                }
                const timeLeft = data.time_remaining ?? 1;
                if (data.time_up && !gameOverShown && !data.game_completed) {
                    gameOverShown = true;

                    let countdown = 10;
                    Swal.fire({
                        title: '⛔ GAME OVER',
                        html: `
                            <p>Vrijeme je isteklo. Niste uspjeli pobjeći iz Neon Escapea.</p>
                            <p style="margin-top: 16px; font-size: 14px; color: #888;">
                                Povratak na početak za
                                <strong id="gameover-countdown">${countdown}</strong> sekundi...
                            </p>
                        `,
                        icon: 'error',
                        confirmButtonText: 'Idi na početak',
                        confirmButtonColor: '#c0392b',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            const el = document.getElementById('gameover-countdown');
                            const interval = setInterval(async () => {
                                countdown--;
                                if (el) el.textContent = countdown;
                                if (countdown <= 0) {
                                    clearInterval(interval);
                                    if (window.LOBBY_NAME) {
                                        try {
                                            await fetch('/delete_lobby/' + window.LOBBY_NAME, { method: 'DELETE' });
                                        } catch (e) {}
                                    }
                                    Swal.close();
                                    window.location.href = '/';
                                }
                            }, 1000);
                        }
                    }); 
                }
            })
            .catch(() => { });
    }

    window.refreshPuzzleCount = fetchAndUpdate;

    // no-op — lokalni inkrement više ne postoji
    window.puzzleFound = function () { };
    window.syncPuzzleCount = function () { };

    fetchAndUpdate();
    setInterval(fetchAndUpdate, 3000);
});
