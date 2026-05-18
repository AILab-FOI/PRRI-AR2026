const TOTAL_PUZZLES = 10;

document.addEventListener("DOMContentLoaded", () => {
    const counterElement = document.getElementById("puzzle-counter");

    function fetchAndUpdate() {
        fetch('/progress')
            .then(r => r.json())
            .then(data => {
                const count = data.count ?? 0;
                const total = data.total ?? TOTAL_PUZZLES;
                counterElement.textContent = `${count}/${total}`;
                window._puzzleCount = count;
                window._puzzleTotal = total;
            })
            .catch(() => {});
    }

    window.refreshPuzzleCount = fetchAndUpdate;

    // no-op — lokalni inkrement više ne postoji
    window.puzzleFound = function () {};
    window.syncPuzzleCount = function () {};

    fetchAndUpdate();
    setInterval(fetchAndUpdate, 3000);
});
