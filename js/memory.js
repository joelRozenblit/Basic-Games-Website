const difficultyChoosing = document.querySelector("#difficultyChoosing");
const easy = document.querySelector("#easy");
const medium = document.querySelector("#medium");
const hard = document.querySelector("#hard");
const game_container = document.querySelector("#game_container");
const cardsDiv = document.querySelector("#cardsDiv");
const successMessage = document.querySelector(".successMessage");

const difficultyBtn = document.querySelector("#difficultyBtn");
const statusDisplay = document.querySelector("#statusDisplay");


let cardsArr = [];
let flippedCards = [];
let matchedCards = 0;
let timeElapsed = 0;
let attempts = 0;
let timerInterval;

// מאזין לכפתור בחירת קושי
difficultyBtn.addEventListener("click", () => {
    difficultyBtn.classList.add("hidden"); // הסתרת כפתור בחירת הקושי
    resetGame();
});

// פונקציה ראשונית 
// מאזינה לכפתורי בחירת קושי ומתחילה משחק בהתאם 
const chooseGameMode = () => {
    easy.addEventListener("click", () => {
        createCards(2)
        startGame()
    });
    medium.addEventListener("click", () => {
        if (window.innerWidth > 600) {
            createCards(8);
        }
        else {
            createCards(9)
        }
        startGame()
    });
    hard.addEventListener("click", () => {
        createCards(18)
        startGame()
    });
}

// התחלת משחק
const startGame = () => {
    difficultyChoosing.classList.add("hidden"); // הסתרת מסך בחירת הקושי
    cardsDiv.classList.remove("hidden"); // הצגת לוח המשחק
    difficultyBtn.classList.remove("hidden"); // הצגת כפתור בחירת הקושי
    statusDisplay.classList.remove("hidden"); // הצגת סטטוס משחק

    drawCards(); // ציור הקלפים והאזנה ללחיצות עליהם
    drawStatus(); // ציור תצוגת סטטוס משחק
    startTimer(); // הפעלת טיימר
}

// יצירת מערך קלפים
const createCards = (cardsNum) => {
    cardsArr = [];
    // יצירת מספרים ייחודיים
    const uniqueNumbers = new Set();
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

// יצירת מערך קלפים
const drawCards = () => {
    cardsDiv.innerHTML = ""

    // 
    if (window.innerWidth >= 600 || cardsArr.length <= 4) {
        //  הגדרת עמודות בסך שורש ריבועי של מספר הקלפים לתצוגה ריבועית
        cardsDiv.style.gridTemplateColumns = `repeat(${Math.sqrt(cardsArr.length)}, 1fr)`;
    } else {
        cardsDiv.style.gridTemplateColumns = `repeat(3, 1fr)`;
    }

    // הגדרת עמודות בסך המסך הנוכחי
    // cardsDiv.style.gridTemplateColumns = `repeat(${columns}, 1fr)`; 

    for (let i = 0; i < cardsArr.length; i++) {
        // יצירת אלמנטים
        let card = document.createElement("div");
        let cardInner = document.createElement("div");
        let cardFront = document.createElement("div");
        let cardBack = document.createElement("div");

        // הוספת קלאסים
        card.classList.add("card");
        cardInner.classList.add("card-inner");
        cardFront.classList.add("card-front");
        cardBack.classList.add("card-back");

        // תמונת רקע לקלף הפוך
        cardBack.innerHTML = `<img src="img/memory/${cardsArr[i]}.png" alt="Card">`;
        // ערך ייחודי לכל קלף
        card.dataset.cardValue = cardsArr[i];

        if (window.innerWidth < 600) {
            console.log("card.style.width");

            card.style.width = "80px"
            card.style.height = "80px"
            console.log(card.style.width);
        }

        // הוספת האלמטים
        card.append(cardInner);
        cardInner.append(cardFront, cardBack);
        cardsDiv.append(card);

        // הוספת אירוע לחיצה
        card.addEventListener("click", () => {
            // מניעת לחיצה על יותר מ2 קלפים ולחיצה על קלף הפוך
            if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
                // שינוי קלף להפוך והוספה למערך קלפים הפוכים
                card.classList.add("flipped");
                flippedCards.push(card);

                playSound("sounds/flip.mp3"); // השמעת צליל הפיכת קלף
                checkMatch(); // בדיקת התאמה
            }
        });
    }
}

// ציור תצוגת סטטוס
const drawStatus = () => {
    statusDisplay.innerHTML = `
        <p>Time: ${formatTime(timeElapsed)}
        Tries: ${attempts}</p>
    `;
};

// ערבוב מערך - פישר יטס
const fisherYatesShuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        // בוחרים אינדקס אקראי בין 0 ל-i (כולל)
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // מחליפים בין האיבר הנוכחי לאיבר באינדקס האקראי
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}

// בדיקת התאמת זוג
const checkMatch = () => {
    if (flippedCards.length < 2) return;

    attempts++;
    const [card1, card2] = flippedCards;

    // בדיקה אם הערכים של שני הקלפים תואמים
    if (card1.dataset.cardValue === card2.dataset.cardValue) {
        matchedCards++;
        flippedCards = []; // איפוס המערך הזמני

        playSound("sounds/success.mp3");

        // בדיקה אם כל הזוגות נמצאו
        if (matchedCards === cardsArr.length / 2) {
            playSound("sounds/cheering.mp3");

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

// השמעת צליל
const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
};

// הצגת הודעת ניצחון
const showSuccessMessage = () => {
    cardsDiv.classList.add("blur"); // הוספת המחלקה
    successMessage.classList.remove("hidden"); // הצגת ההודעה
    difficultyBtn.classList.add("hidden"); // הסתרת כפתור בחירת הקושי
    statusDisplay.classList.add("hidden")
    clearInterval(timerInterval);

    successMessage.innerHTML = `
    <p>Time Passed:${formatTime(timeElapsed)} tries:${attempts}</p>
    <h2>Well Done!! You Found All Cards!</h2>
          <button onclick="resetGame()" id="newGameBtn">New Game</button>
    `
};

// איפוס משחק
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

//
const startTimer = () => {
    timeElapsed = 0; // איפוס זמן
    timerInterval = setInterval(() => {
        timeElapsed++;
        drawStatus();
    }, 1000); // כל שניה, הזמן יתעדכן
};

// 
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// קריאת להאזנה לבחירת מצב משחק
chooseGameMode();


// document.addEventListener("DOMContentLoaded", () => {
//     chooseGameMode();
//     newGameBtn.addEventListener("click", () => {
//       successMessage.classList.add("hidden"); // הסתרת ההודעה
//       container.classList.remove("blurred"); // הסרת הטשטוש
//       resetGame(); // איפוס המשחק
//     });
//   });


// יצירת מערך בגודל כל מאגר קלפים
// פונקציה שניה לייעול וחיסכון באיטרציות
// const createAllCards = (cardsNum) => {
//     cardsArr = [];
//     for (let i = 1; i <= cardsNum; i++) {
//         cardsArr.push(i, i)
//     }
//      // ערבוב המערך
//     cardsArr = fisherYatesShuffle(cardsArr);
// }
