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

    updatePuzzleCounter();
});