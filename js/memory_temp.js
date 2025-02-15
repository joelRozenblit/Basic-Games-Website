const difficultyChoosing = document.querySelector("#difficultyChoosing");
const easy = document.querySelector("#easy");
const medium = document.querySelector("#medium");
const hard = document.querySelector("#hard");
const game_container = document.querySelector("#game_container");
const cardsDiv = document.querySelector("#cardsDiv");
const successMessage = document.querySelector(".successMessage");

const difficultyBtn = document.querySelector("#difficultyBtn");
const statusDisplay = document.querySelector("#statusDisplay");


let difficulty = ""
let cardsArr = [];
let flippedCards = [];
let matchedCards = 0;
let timeElapsed = 0;
let attempts = 0;
let timerInterval;

const chooseGameMode = () => {
    easy.addEventListener("click", () => {
        difficulty = "easy";
        startGame()
    });
    medium.addEventListener("click", () => {
        difficulty = "medium";
        startGame()
    });
    hard.addEventListener("click", () => {
        difficulty = "hard";
        startGame()
    });

    
}

const startGame = () => {
    difficultyChoosing.classList.add("hidden"); // הסתרת מסך בחירת הקושי
    cardsDiv.classList.remove("hidden"); // הצגת לוח המשחק
    difficultyBtn.classList.remove("hidden"); // הצגת כפתור בחירת הקושי
    statusDisplay.classList.remove("hidden");

    drawGame(difficulty);
    startTimer();
}

const drawGame = (difficulty) => {
    switch (difficulty) {
        case "easy":
            createSomeCards(2)
            break;
        case "medium":
            createSomeCards(8)
            break;
        case "hard":
            createAllCards(18)
            break;
        default:
            break;
    }
    drawCards()
    drawStatus()
}

const createSomeCards = (cardsNum) => {
    cardsArr = [];
    const uniqueNumbers = new Set();
    // יצירת מספרים ייחודיים
    while (uniqueNumbers.size < cardsNum) {
        const randomNum = Math.floor(Math.random() * 23) + 1;
        uniqueNumbers.add(randomNum);
        console.log(randomNum);
    }
    // יצירת מערך עם כפילויות
    cardsArr = [...uniqueNumbers].flatMap(num => [num, num]);
    // ערבוב המערך
    cardsArr = fisherYatesShuffle(cardsArr);
};

const createAllCards = (cardsNum) => {
    cardsArr = [];
    for (let i = 1; i <= cardsNum; i++) {
        cardsArr.push(i, i)
    }
    cardsArr = fisherYatesShuffle(cardsArr);
}

const drawCards = () => {
    cardsDiv.innerHTML = ""
    cardsDiv.style.gridTemplateColumns = `repeat(${Math.sqrt(cardsArr.length)}, 1fr)`;

    for (let i = 0; i < cardsArr.length; i++) {
        let card = document.createElement("div");
        let cardInner = document.createElement("div");
        let cardFront = document.createElement("div");
        let cardBack = document.createElement("div");

        card.classList.add("card");
        cardInner.classList.add("card-inner");
        cardFront.classList.add("card-front");
        cardBack.classList.add("card-back");

        card.id = i;
        cardBack.innerHTML = `<img src="/img/memory/${cardsArr[i]}.png" alt="Card">`;
        card.dataset.cardValue = cardsArr[i]; // ערך ייחודי לכל קלף

        card.append(cardInner);
        cardInner.append(cardFront, cardBack);
        cardsDiv.append(card);

        // הוספת אירוע לחיצה
        card.addEventListener("click", () => {
            
            if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
                card.classList.add("flipped");
                flippedCards.push(card);
                playSound("/sounds/flip.mp3");

                checkMatch(); // בדיקת התאמה
            }
        });
    }
}

const drawStatus = () => {
    statusDisplay.innerHTML = `
        <p>Time: ${formatTime(timeElapsed)}
        Tries: ${attempts}</p>
    `;
};


const fisherYatesShuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        // בוחרים אינדקס אקראי בין 0 ל-i (כולל)
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // מחליפים בין האיבר הנוכחי לאיבר באינדקס האקראי
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}

const checkMatch = () => {
    if (flippedCards.length < 2) return;

    attempts++; 
    const [card1, card2] = flippedCards;
    // בדיקה אם הערכים של שני הקלפים תואמים
    if (card1.dataset.cardValue === card2.dataset.cardValue) {
        matchedCards++;
        flippedCards = []; // איפוס המערך הזמני
        playSound("/sounds/success.mp3");

        // בדיקה אם כל הזוגות נמצאו
        if (matchedCards === cardsArr.length / 2) {
            playSound("/sounds/cheering.mp3");

            setTimeout(() => {
                showSuccessMessage();
            }, 500);
        }
    } else {
        // החזרת הקלפים למצב מכוסה לאחר השהייה קצרה
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = []; // איפוס המערך הזמני
        }, 1000);
    }
};


const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
};

const showSuccessMessage = () => {
    cardsDiv.classList.add("blur"); // הוספת המחלקה
    successMessage.classList.remove("hidden"); // הצגת ההודעה
    difficultyBtn.classList.add("hidden"); // הסתרת כפתור בחירת הקושי
    clearInterval(timerInterval);
    statusDisplay.classList.add("hidden")

    successMessage.innerHTML = `
    <p>Time Passed:${formatTime(timeElapsed)} tries:${attempts}</p>
    <h2>Well Done!! You Found All Cards!</h2>
          <button onclick="resetGame()" id="newGameBtn">New Game</button>
    `
};



difficultyBtn.addEventListener("click", () => {
    difficultyBtn.classList.add("hidden"); // הסתרת כפתור בחירת הקושי
    resetGame();
});

const resetGame = () => {
    successMessage.classList.add("hidden"); // הסתרת הודעת הצלחה
    successMessage.classList.remove("successMessage"); // הסתרת מחלקה
    cardsDiv.classList.remove("blur"); // ביטול הטשטוש

    // מעבר למסך בחירת הקושי
    difficultyChoosing.classList.remove("hidden"); // הצגת מסך בחירת הקושי
    cardsDiv.classList.add("hidden"); // הסתרת לוח המשחק
    statusDisplay.classList.add("hidden")

   // איפוס משתני המשחק
   matchedCards = 0;
   flippedCards = [];
   cardsArr = [];
   difficulty = "";
   attempts = 0; // איפוס הנסיונות
   timeElapsed = 0; // איפוס הזמן
   clearInterval(timerInterval); // עצירת הטיימר אם המשחק מאופס
   cardsDiv.innerHTML = "";
};

const startTimer = () => {
    timeElapsed = 0; // איפוס זמן
    timerInterval = setInterval(() => {
        timeElapsed++;
        drawStatus();
    }, 1000); // כל שניה, הזמן יתעדכן
};

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};



chooseGameMode();


// document.addEventListener("DOMContentLoaded", () => {
//     chooseGameMode();
//     newGameBtn.addEventListener("click", () => {
//       successMessage.classList.add("hidden"); // הסתרת ההודעה
//       container.classList.remove("blurred"); // הסרת הטשטוש
//       resetGame(); // איפוס המשחק
//     });
//   });
