let memoryState = {
    initialized: false,
    letters: [],
    matched: [],
    revealed: [],
    first: null,
    second: null,
    lock: false,
    tFound: false
};

function startMemoryGame() {

    if (!memoryState.initialized) {
        memoryState.letters = [
            "N", "E", "O", "C", "I",
            "T", "T",
            "Y", "A", "R", "X", "L"
        ];

        memoryState.letters.sort(() => Math.random() - 0.5);

        memoryState.matched = Array(12).fill(false);
        memoryState.revealed = Array(12).fill(false);

        memoryState.initialized = true;
    }

    Swal.fire({
        title: "🧠 MEMORY CORRUPTION",
        html: `
        <div id="memoryGrid" style="
            display:grid;
            grid-template-columns: repeat(4,1fr);
            gap:10px;
            margin-top:10px;
        "></div>
        `,
        showConfirmButton: false,
        width: 520,
        didOpen: renderMemoryGrid
    });
}

function renderMemoryGrid() {

    const grid = document.getElementById("memoryGrid");
    grid.innerHTML = "";

    memoryState.letters.forEach((letter, index) => {

        const card = document.createElement("div");

        const isMatched = memoryState.matched[index];
        const isRevealed = memoryState.revealed[index];

        card.innerHTML = (isMatched || isRevealed) ? letter : "?";

        card.style = `
            height:60px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:${isMatched ? "#003322" : "#111"};
            color:#00ffcc;
            border:1px solid #00ffcc;
            font-size:20px;
            cursor:pointer;
            user-select:none;
        `;

        card.addEventListener("click", () => memoryCardClick(index));

        grid.appendChild(card);
    });
}

function memoryCardClick(index) {

    if (memoryState.lock) return;
    if (memoryState.matched[index]) return;
    if (memoryState.revealed[index]) return;

    memoryState.revealed[index] = true;

    if (memoryState.first === null) {
        memoryState.first = index;
        startMemoryGame();
        return;
    }

    memoryState.second = index;
    memoryState.lock = true;

    const firstIndex = memoryState.first;
    const secondIndex = memoryState.second;

    const firstLetter = memoryState.letters[firstIndex];
    const secondLetter = memoryState.letters[secondIndex];

    if (firstLetter === secondLetter) {

        memoryState.matched[firstIndex] = true;
        memoryState.matched[secondIndex] = true;

        if (firstLetter === "T" && !memoryState.tFound) {
            memoryState.tFound = true;

            setTimeout(() => {
                Swal.fire({
                    icon: "success",
                    title: "✔ Stable Signal Found",
                    text: "Key fragment: T"
                }).then(() => {
                    startMemoryGame();
                });
            }, 400);
        }

        memoryState.first = null;
        memoryState.second = null;
        memoryState.lock = false;

        startMemoryGame();

    } else {

        startMemoryGame();

        setTimeout(() => {

            memoryState.revealed[firstIndex] = false;
            memoryState.revealed[secondIndex] = false;

            memoryState.first = null;
            memoryState.second = null;
            memoryState.lock = false;

            startMemoryGame();

        }, 700);
    }
}