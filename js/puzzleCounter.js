let foundPuzzles = 0;
const totalPuzzles = 10;

document.addEventListener("DOMContentLoaded", () => {

    const counterElement =
        document.getElementById("puzzle-counter");

    function updatePuzzleCounter() {
        counterElement.textContent =
            `${foundPuzzles}/${totalPuzzles}`;
    }

    window.puzzleFound = function () {
        if (foundPuzzles < totalPuzzles) {
            foundPuzzles++;
            updatePuzzleCounter();
        }
    }

    window.syncPuzzleCount = function (count) {
        if (count > foundPuzzles) {
            foundPuzzles = count;
            updatePuzzleCounter();
        }
    }

    // Sinkronizacija progresa između igrača
    setInterval(() => {
        fetch('/progress')
            .then(r => r.json())
            .then(data => window.syncPuzzleCount(data.count))
            .catch(() => {});
    }, 4000);

    updatePuzzleCounter();
});