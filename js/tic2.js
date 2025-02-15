const cells = document.querySelectorAll(".cell");
const statusDisplay = document.querySelector("#statusDisplay");
const resultDisplay = document.querySelector("#resultDisplay");
const restart = document.querySelector("#restart");
const container = document.querySelector("#container");

const winConditions = [
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

const initGame = () => {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restart.addEventListener("click", restartGame);
    statusDisplay.textContent = `${currentPlayer}'s choice`;
    running = true;
};

const cellClicked = (event) => {
    const cell = event.target;
    const cellIndex = cell.getAttribute("index");

    if (options[cellIndex] !== "" || !running) {
        return;
    }

    updateCell(cell, cellIndex);
    checkWin();
};

const updateCell = (cell, index) => {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);
};

const changePlayer = () => {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusDisplay.textContent = `${currentPlayer}'s choice`;
};

const checkWin = () => {
    let roundWon = false;
    let winIndex = 0;

    for (; winIndex < winConditions.length; winIndex++) {
        const [a, b, c] = winConditions[winIndex];
        if (options[a] !== "" && options[a] === options[b] && options[a] === options[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `${currentPlayer} Wins!!!`;
        running = false;
        drawLine(winIndex);
    } else if (!options.includes("")) {
        statusDisplay.textContent = "Draw!";
        running = false;
    } else {
        changePlayer();
    }
};

const restartGame = () => {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.textContent = `${currentPlayer}'s choice`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("X", "O");
    });
    // Remove the line after restarting
    const line = document.querySelector(".line");
    if (line) {
        line.remove();
    }
    running = true;
};

// Draw the winning line
const drawLine = (winningIndex) => {
    const line = document.createElement("div");
    line.classList.add("line");

    const [a, b, c] = winConditions[winningIndex];
    const cellA = cells[a];
    const cellB = cells[b];
    const cellC = cells[c];

    const row = Math.floor(a / 3);
    const col = a % 3;

    if (winningIndex <= 2) {
        line.classList.add("horizontal");
        line.style.setProperty("--row", row);
    } else if (winningIndex <= 5) {
        line.classList.add("vertical");
        line.style.setProperty("--col", col);
    } else if (winningIndex === 6) {
        line.classList.add("diagonal1");
    } else if (winningIndex === 7) {
        line.classList.add("diagonal2");
    }

    container.appendChild(line);
};

initGame();
