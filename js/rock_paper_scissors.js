
const choices = ["rock", "paper", "scissors"]
const playerDisplay = document.getElementById("player_display")
const computerDisplay = document.getElementById("computer_display")
const resultDisplay = document.getElementById("result_display")
const playerScoreDisplay = document.getElementById("player_score")
const computerScoreDisplay = document.getElementById("computer_score")

let playerScore = 0;
let computerScore = 0;


const playGame = (playerChoice) => {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)]
    let result = ""

    if (computerChoice === playerChoice) {
        result = "IT'S A TIE!"
    }
    else {
        switch (playerChoice) {
            case "rock":
                result = (computerChoice === "scissors") ? "YOU WIN!" : "YOU LOSE!"
                break;
            case "paper":
                result = (computerChoice === "rock") ? "YOU WIN!" : "YOU LOSE!"
                break;
            case "scissors":
                result = (computerChoice === "paper") ? "YOU WIN!" : "YOU LOSE!"
                break;
        }
    }

    playerDisplay.textContent = `
    Player: ${playerChoice}`

    computerDisplay.textContent = `
    Computer: ${computerChoice}`

    resultDisplay.textContent = `
    ${result}`

    resultDisplay.classList.remove("greenText", "redText" , "grayText")

    switch (result) {
        case "YOU WIN!":
            resultDisplay.classList.add("greenText");
            playerScore ++;
            break
        case "YOU LOSE!":
            resultDisplay.classList.add("redText");
            computerScore ++;
            break
        case "IT'S A TIE!":
            resultDisplay.classList.add("grayText");
            break
    }

    playerScoreDisplay.textContent = `${playerScore}`
    computerScoreDisplay.textContent = `${computerScore}`
}



