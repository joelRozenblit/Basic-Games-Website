const cells = document.querySelectorAll(".cell");
const statusDisplay = document.querySelector("#statusDisplay");
const resultDisplay = document.querySelector("#resultDisplay");
const restart = document.querySelector("#restart");
const playerVsPlayer = document.querySelector("#playerVsPlayer");
const playerVsComputer = document.querySelector("#playerVsComputer");
const gameModeDiv = document.querySelector("#gameMode");
const winCondisions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let gameMode = "PvP";

const initGame = () => {
    cells.forEach(cell => cell.addEventListener("click", cellClicked))
    restart.addEventListener("click", restartGame)
    statusDisplay.textContent = `${currentPlayer}'s choice`
    running = true;
}

const cellClicked = (event) => {
    const cell = event.target;
    const cellIndex = cell.getAttribute("index")

    if (options[cellIndex] != "" || !running) {
        return;
    }

    updateCell(cell, cellIndex);
    checkWin()

    if (gameMode === "PvC" && running) {
        setTimeout(computerMove, 500);
    }
}

const updateCell = (cell, index) => {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);
}

const changePlayer = () => {
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusDisplay.textContent = `${currentPlayer}'s choice`
}

const checkWin = () => {
    let roundWon = false;

    for (let i = 0; i < winCondisions.length; i++) {
        const condision = winCondisions[i];
        const cellA = options[condision[0]];
        const cellB = options[condision[1]];
        const cellC = options[condision[2]];

        if (cellA === "" || cellB === "" || cellC === "") {
            continue;
        }
        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `${currentPlayer} Wins!!!`
        running = false;
    }
    else if (!options.includes("")) {
        statusDisplay.textContent = "Draw!";
        running = false;
    } else {
        changePlayer();
    }
}

const restartGame = () => {
    currentPlayer = "X"
    options = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.textContent = `${currentPlayer}'s choice`
    cells.forEach(cell => cell.textContent = "");
    cells.forEach(cell => cell.classList.remove("X", "O"));
    running = true;
}

const chooseGameMode = () => {
    playerVsPlayer.addEventListener("click", () => {
        gameMode = "PvP";
        startGame();
    });

    playerVsComputer.addEventListener("click", () => {
        gameMode = "PvC";
        startGame();
    });
};

const computerMove = () => {
    const availableCells = options.map((val, index) => (val === "" ? index : null)).filter(index => index !== null);
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    const cell = cells[randomIndex];

    updateCell(cell, randomIndex);
    checkWin();
};

const startGame = () => {
    gameModeDiv.style.display = "none";
    container.style.display = "grid";
    restart.style.display = "block";
    statusDisplay.style.display = "block";
    initGame();
};

chooseGameMode();