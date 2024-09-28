let score = 0;
let userData = { firstName: "", lastName: "" };

// Trivia Questions (Expand as needed)
const triviaQuestions = [
  {
    question: "What year were the Steelers founded?",
    options: ["1933", "1945", "1960", "1970"],
    answer: "1933",
  },
  {
    question:
      "Who was the first Pittsburgh Steelers player inducted into the Pro Football Hall of Fame?",
    options: ["Terry Bradshaw", "Ernie Stautner", "Joe Green", "Coach Cahr"],
    answer: "Ernie Stautner",
  },
  {
    question:
      "In an NFL game, if an offensive player moves or flinches before the ball is snapped, what is the penalty called?",
    options: ["Touchdown", "Pass Interference", "Delay of Game", "False Start"],
    answer: "False Start",
  },
  {
    question:
      "Who is the current Quarterbacks Coach for the Pittsburgh Steelers?",
    options: ["Tom Arth", "Kordell Stewart", "Matt Canada", "Coach Cahr"],
    answer: "Tom Arth",
  },
  {
    question:
      "What is the name of the front office position that Omar Khan holds for the Pittsburgh Steelers?",
    options: ["Scout", "General Manager", "Draft Specialist", "Running Back"],
    answer: "General Manager",
  },
  {
    question:
      "What happens if the ball carrier is tackled in their own end zone?",
    options: ["TouchDahn!", "TouchBACK!", "Safety", "Coach Cahr"],
    answer: "Hypocycloid",
  },
  {
    question: "What shape is featured on the Pittsburgh Steelers logo?",
    options: ["Rombous", "Hypocycloid", "Diamond", "Square"],
    answer: "Hypocycloid",
  },
  // Add more trivia questions here
];

// Current Trivia Question Index
let currentTriviaQuestionIndex = 0;

// Hangman Variables
const hangmanWords = ["renegade"];
let selectedWord = "";
let correctLetters = [];
let wrongLetters = [];
const hangmanParts = [
  "head",
  "body",
  "left-arm",
  "right-arm",
  "left-leg",
  "right-leg",
];

// Video Question Variables
const videoQuestion = {
  videoSrc: "Daily Double.mp4",
  question:
    "This Hall of Game coach is known for his innovative zone blitz scheme",
  options: [
    "Who is Chuck Noll?",
    "Who is Joe Green?",
    "Who is Dick Lebeau?",
    "Who is Coach Cahr?",
  ],
  answer: "Who is Dick Lebeau?", // Set the correct option
};

// Event Listener for Form Submission
document.getElementById("user-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  if (firstName && lastName) {
    userData.firstName = firstName;
    userData.lastName = lastName;
    score = 0; // Initialize score
    showLevel("trivia-level");
  }
});

// Function to Show a Specific Level
// Updated showLevel function to include Tic-Tac-Toe Level
function showLevel(levelId) {
  document.querySelectorAll(".level").forEach((level) => {
    level.classList.remove("active");
  });
  document.getElementById(levelId).classList.add("active");

  switch (levelId) {
    case "trivia-level":
      loadTriviaQuestion();
      break;
    case "hangman-level":
      startHangmanGame();
      break;
    case "find-ball-level":
      initializeFindBallGame();
      break;
    case "video-question-level":
      setupVideoQuestion();
      break;
    case "tic-tac-toe-level": // Initialize Tic-Tac-Toe level
      initializeTicTacToeGame();
      break;
    case "completion-screen":
      displayFinalScore();
      break;
  }
}

// Show a specific level
function showLevel(levelId) {
  console.log("Showing level:", levelId);
  if (levelId !== "tic-tac-toe-level") {
    return;
  }

  document.querySelectorAll(".level").forEach((level) => {
    level.classList.remove("active");
  });
  document.getElementById(levelId).classList.add("active");

  if (levelId === "tic-tac-toe-level") {
    initializeTicTacToeGame();
    console.log("Tic-Tac-Toe level initialized");
  }
}

// ===================== Trivia Level =====================
function loadTriviaQuestion() {
  if (currentTriviaQuestionIndex < triviaQuestions.length) {
    const currentQuestion = triviaQuestions[currentTriviaQuestionIndex];
    document.getElementById("trivia-question").innerText =
      currentQuestion.question;
    const optionsDiv = document.querySelector("#trivia-level .options");
    optionsDiv.innerHTML = ""; // Clear previous options
    currentQuestion.options.forEach((option) => {
      const button = document.createElement("button");
      button.innerText = option;
      button.onclick = () => checkTriviaAnswer(option);
      optionsDiv.appendChild(button);
    });
  } else {
    // If no more trivia questions, move to next level
    showLevel("hangman-level");
  }
}

function checkTriviaAnswer(selectedOption) {
  const currentQuestion = triviaQuestions[currentTriviaQuestionIndex];
  if (selectedOption === currentQuestion.answer) {
    score += 1;
    currentTriviaQuestionIndex += 1;
    loadTriviaQuestion();
  } else {
    currentTriviaQuestionIndex += 1;
    loadTriviaQuestion();
  }
}

// ===================== Hangman Level =====================
function startHangmanGame() {
  selectedWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
  correctLetters = [];
  wrongLetters = [];
  displayWord();
  displayLetters();
  document.getElementById("wrong-letters").innerText = "";
  hangmanParts.forEach((part) => {
    document.getElementById(part).style.display = "none";
  });
}

function displayWord() {
  const wordContainer = document.getElementById("word");
  wordContainer.innerHTML = `
        ${selectedWord
          .split("")
          .map(
            (letter) => `
                    <span class="letter">
                        ${correctLetters.includes(letter) ? letter : "_"}
                    </span>
                `
          )
          .join("")}
    `;
}

function displayWordLoss() {
  const wordContainer = document.getElementById("word");
  wordContainer.innerHTML = `
        ${selectedWord
          .split("")
          .map(
            (letter) => `
                    <span class="letter">
                        ${correctLetters.includes(letter) ? letter : letter}
                    </span>
                `
          )
          .join("")}
    `;
}

function displayLetters() {
  const lettersContainer = document.getElementById("letters");
  lettersContainer.innerHTML = "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map(
      (letter) => `
        <span class="letter" onclick="handleGuess('${letter}')">${letter}</span>
    `
    )
    .join("");
}

function handleGuess(letter) {
  if (selectedWord.includes(letter)) {
    if (!correctLetters.includes(letter)) {
      correctLetters.push(letter);
      displayWord();
      checkHangmanWin();
    }
  } else {
    if (!wrongLetters.includes(letter)) {
      wrongLetters.push(letter);
      document.getElementById(
        "wrong-letters"
      ).innerText = `Wrong Letters: ${wrongLetters.join(", ")}`;
      const part = hangmanParts[wrongLetters.length - 1];
      if (part) {
        document.getElementById(part).style.display = "block";
      }
      checkHangmanLoss();
    }
  }
  // Disable the clicked letter
  document.querySelectorAll(`#letters .letter`).forEach((el) => {
    if (el.innerText.toLowerCase() === letter) {
      el.style.pointerEvents = "none";
      el.style.color = "gray";
    }
  });
}

function checkHangmanWin() {
  const wordContainer = document.getElementById("word");
  const innerWord = wordContainer.innerText.replace(/\s/g, "");
  if (innerWord === selectedWord) {
    document.getElementById("hangman-message").innerHTML =
      '<img src="correct-that-is-correct.gif" alt="Correct" />';
    score += 1;
    setTimeout(() => {
      showLevel("find-ball-level");
    }, 5000);
  }
}

function checkHangmanLoss() {
  if (wrongLetters.length === hangmanParts.length) {
    document.getElementById("hangman-message").innerHTML =
      '<img src="wrong-not.gif" alt="WRONG" />';
    displayWordLoss();
    setTimeout(() => {
      showLevel("find-ball-level");
    }, 3000);
  }
}

// ===================== Video Question Level =====================
function setupVideoQuestion() {
  const video = document.getElementById("video-question");
  const optionsDiv = document.getElementById("video-question-options");
  optionsDiv.classList.add("hidden");

  // Reset options content
  optionsDiv.innerHTML = "";

  // Set video source
  video.src = videoQuestion.videoSrc;

  // Listen for video end
  video.onended = () => {
    optionsDiv.classList.remove("hidden");
    // Populate options
    const questionText = document.createElement("p");
    questionText.innerText = videoQuestion.question;
    optionsDiv.appendChild(questionText);
    videoQuestion.options.forEach((option) => {
      const button = document.createElement("button");
      button.innerText = option;
      button.onclick = () => checkVideoAnswer(option);
      optionsDiv.appendChild(button);
    });
  };
}

function checkVideoAnswer(selectedOption) {
  if (selectedOption === videoQuestion.answer) {
    score += 2;
  } else {
  }
  showLevel("completion-screen");
  submitScore();
  //getLeaderboardData()
  document.getElementById("leaderboard-table").classList.add("hidden");
  setInterval(getLeaderboardData, 10000); // Refresh leaderboard every second
}

// ===================== Completion Screen =====================
function displayFinalScore() {
  document.getElementById("final-score").innerText = score;
}

function moveToNextLevel() {
  // Placeholder for potential future levels
  showLevel("completion-screen");
}

// ===================== Submit Score to Google Sheets =====================
// Google Apps Script Web App URL
const GOOGLE_SHEET_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwdcC0CTXGt8tq_zP6kvxriGTvEJDy7N7uxeq7xX0RuWk3NEmNS2frKz5L-iGf1qHagTA/exec";

function submitScore() {
  const data = {
    name: userData.firstName + " " + userData.lastName,
    score: score,
  };

  fetch(GOOGLE_SHEET_WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

function getLeaderboardData() {
  fetch(GOOGLE_SHEET_WEB_APP_URL)
    .then((response) => response.json())
    .then((data) => {
      const leaderboardElement = document.getElementById("leaderboard-body");
      leaderboardElement.innerHTML = ""; // Clear previous leaderboard data

      // Sort data by score in descending order
      data.sort((a, b) => b.score - a.score);

      // Calculate ranks
      let rank = 1;
      let prevScore = data[0].score;
      data.forEach((entry, index) => {
        if (entry.score < prevScore) {
          rank = index + 1;
        }
        entry.rank = rank;
        prevScore = entry.score;
      });

      // Populate table with data
      data.forEach((entry) => {
        const entryRow = document.createElement("tr");
        const rankCell = document.createElement("td");
        rankCell.style.border = "5px solid gray"; // Add gray border
        console.log(entry.rank);
        if (entry.rank === 1) {
          const trophyImg = document.createElement("img");
          trophyImg.src = "trophy.gif";
          trophyImg.alt = "Trophy";
          rankCell.appendChild(trophyImg);
        }
        rankCell.innerText = entry.rank;
        const nameCell = document.createElement("td");
        nameCell.innerText = entry.name;
        nameCell.style.border = "5px solid gray"; // Add gray border
        const scoreCell = document.createElement("td");
        scoreCell.innerText = entry.score;
        scoreCell.style.border = "5px solid gray"; // Add gray border
        entryRow.appendChild(rankCell);
        entryRow.appendChild(nameCell);
        entryRow.appendChild(scoreCell);
        leaderboardElement.appendChild(entryRow);
      });
      document.getElementById("spinner").style.display = "none";
      document.getElementById("leaderboard-table").classList.remove("hidden");
    })
    .catch((error) => {
      console.error("Error fetching leaderboard data:", error);
      document.getElementById("spinner").style.display = "none";
    });
}

// ===================== Find the Ball Under the Helmet Level =====================
// Helmet Game Variables
let ballPosition = null;
let findBallGameInProgress = false;
const helmetPositions = [
  { left: 10, top: 25 },
  { left: 140, top: 25 },
  { left: 280, top: 25 },
];

function initializeFindBallGame() {
  document.getElementById("find-ball-message").textContent =
    'Click "Start Game" to begin!';
  document.getElementById("find-ball-start-button").style.display =
    "inline-block";
  findBallGameInProgress = false;

  // Reset helmets to initial positions
  const helmets = document.querySelectorAll(".helmet-container");
  helmets.forEach((helmet, index) => {
    helmet.style.left = `${helmetPositions[index].left}px`;
    helmet.style.top = `${helmetPositions[index].top}px`;
    helmet.querySelector(".helmet").style.top = "-15px"; // Start with helmets lifted
    helmet.style.transition = "none";
    helmet.querySelector(".helmet").style.transition = "none";
    helmet.querySelector(".helmet").style.pointerEvents = "none";
  });

  // Remove any existing ball
  const existingBall = document.getElementById("ball");
  if (existingBall) {
    existingBall.remove();
  }

  // Place the ball
  ballPosition = Math.floor(Math.random() * 3);
  console.log("Ball position:", ballPosition);
  const ball = document.createElement("img");
  ball.src = "football.png";
  ball.id = "ball";
  document
    .getElementById(`helmet-container-${ballPosition + 1}`)
    .appendChild(ball);

  // Allow time for setup before enabling the start button
  setTimeout(() => {
    document.getElementById("find-ball-start-button").disabled = false;
  }, 500);
}

function startFindBallGame() {
  document.getElementById("find-ball-start-button").style.display = "none";
  document.getElementById("find-ball-message").textContent = "Shuffling...";
  findBallGameInProgress = true;

  // Set the helmets to a "raised" position before lowering
  const ballHelmet = document.getElementById(`helmet${ballPosition + 1}`);
  const otherHelmet1 = document.getElementById(
    `helmet${ballPosition === 0 ? 2 : 1}`
  );
  const otherHelmet2 = document.getElementById(
    `helmet${ballPosition === 2 ? 1 : 3}`
  );

  // Initially set helmets to raised position (offscreen)
  ballHelmet.style.top = "-15px";
  otherHelmet1.style.top = "-15px";
  otherHelmet2.style.top = "-15px";

  // Force reflow to ensure the "raised" position is applied
  ballHelmet.offsetHeight; // Trigger reflow
  otherHelmet1.offsetHeight; // Trigger reflow
  otherHelmet2.offsetHeight; // Trigger reflow

  // Add transition to move helmets down
  ballHelmet.style.transition = "top 0.5s ease-in-out";
  otherHelmet1.style.transition = "top 0.5s ease-in-out";
  otherHelmet2.style.transition = "top 0.5s ease-in-out";

  // Set the helmets to move down to cover the ball after a short delay
  setTimeout(() => {
    ballHelmet.style.top = "65px";
    otherHelmet1.style.top = "65px";
    otherHelmet2.style.top = "65px";
  }, 100); // Add a small delay to allow the raised position to apply

  // Begin shuffling after the helmets lower
  setTimeout(() => {
    shuffleHelmets();
  }, 600); // Wait for the helmets to lower before shuffling
}

function shuffleHelmets() {
  const helmets = document.querySelectorAll(".helmet-container");
  let shuffleCount = 10; // Increase shuffles for more randomness
  let i = 0;

  const shuffleInterval = setInterval(() => {
    // Move each helmet to a random position
    helmets.forEach((helmet) => {
      moveHelmetToRandomPosition(helmet);
    });

    i++;
    if (i >= shuffleCount) {
      clearInterval(shuffleInterval);
      // Return helmets to three across but in random order
      setTimeout(() => {
        arrangeHelmetsInLine(helmets);
        document.getElementById("find-ball-message").textContent =
          "Guess which helmet has the ball!";
        helmets.forEach((helmet) => {
          helmet.querySelector(".helmet").style.pointerEvents = "auto";
        });
      }, 500);
    }
  }, 500);
}

function moveHelmetToRandomPosition(helmet) {
  const gameArea = document.getElementById("find-ball-game-area");
  const maxLeft = gameArea.offsetWidth - helmet.offsetWidth; // Ensure helmet stays inside the container
  const maxTop = gameArea.offsetHeight - helmet.offsetHeight;

  // Randomly calculate new positions, ensuring they don't exceed the container's bounds
  const randomLeft = Math.floor(Math.random() * maxLeft);
  const randomTop = Math.floor(Math.random() * maxTop);

  // Apply the calculated random positions
  helmet.style.position = "absolute"; // Ensure the helmet is absolutely positioned
  helmet.style.transition = "left 0.4s, top 0.4s";
  helmet.style.left = `${randomLeft}px`;
  helmet.style.top = `${randomTop}px`;
}

function arrangeHelmetsInLine(helmets) {
  // Shuffle the helmetPositions array to randomize the order
  const shuffledPositions = helmetPositions
    .slice()
    .sort(() => Math.random() - 0.5);
  helmets.forEach((helmet, index) => {
    helmet.style.transition = "left 0.4s, top 0.4s";
    helmet.style.left = `${shuffledPositions[index].left}px`;
    helmet.style.top = `${shuffledPositions[index].top}px`;
  });
}

document.querySelectorAll(".helmet").forEach((helmet, index) => {
  helmet.addEventListener("click", () => {
    if (findBallGameInProgress) {
      revealBall(index);
    }
  });
});

function revealBall(playerChoice) {
  findBallGameInProgress = false;
  document.getElementById("ball-instructions").style.display = "none";
  const helmets = document.querySelectorAll(".helmet-container");
  helmets.forEach((helmetContainer, index) => {
    helmetContainer.querySelector(".helmet").style.pointerEvents = "none";
    if (index === ballPosition) {
      // Lift the helmet to reveal the ball
      const helmetImg = helmetContainer.querySelector(".helmet");
      helmetImg.style.transition = "top 0.5s";
      helmetImg.style.top = "-50px"; // Helmet lifts up out of view
    }
  });
  if (playerChoice === ballPosition) {
    document.getElementById("find-ball-message").textContent = "Nailed It!";
    const ballGif = document.getElementById("ball-gif");
    ballGif.style.display = "block";
    ballGif.innerHTML = '<img src="nicCage.gif" alt="Correct" />';
    score += 1; // Update the score
  } else {
    document.getElementById("find-ball-message").textContent = "NOPE!";
    const ballGif = document.getElementById("ball-gif");
    ballGif.style.display = "block";
    ballGif.innerHTML = '<img src="ss_nope.gif" alt="Wrong" />';
  }
  // Proceed to the next level after a delay
  setTimeout(() => {
    // Uncomment if moving to next level
    showLevel("video-question-level");
  }, 3000);
}

let gameId = null; // Unique game ID
let ticTacToeBoard = ["", "", "", "", "", "", "", "", ""];
let isGameOver = false;
let playerSymbol = "X"; // Player is 'X', GPT is 'O'

function initializeTicTacToeGame() {
  console.log("Initializing Tic-Tac-Toe game...");
  // Generate a unique game ID
  gameId = generateGameId();

  // Reset the board and status
  ticTacToeBoard = ["", "", "", "", "", "", "", "", ""];
  isGameOver = false;
  document.getElementById("status").textContent = "Your move!";

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.addEventListener("click", handlePlayerMove);
  });
}

function generateGameId() {
  return Math.random().toString(36).substring(2, 15); // Simple unique game ID generator
}

function handlePlayerMove(e) {
  const index = e.target.getAttribute("data-cell");

  if (ticTacToeBoard[index] !== "" || isGameOver) return;

  // Player moves as 'X'
  ticTacToeBoard[index] = "X";
  e.target.textContent = "X";

  if (checkWinner("X")) {
    document.getElementById("status").textContent = "You win!";
    isGameOver = true;
    const coachPic = document.getElementById("coach-cahr");
    coachPic.style.display = "inline-block";
    coachPic.innerHTML = '<img src="angry_cowher.jpg" alt="You Win" />';
    document
      .getElementById("tic-tac-toe-next-button")
      .classList.remove("hidden");
    return;
  }

  if (ticTacToeBoard.every((cell) => cell !== "")) {
    document.getElementById("status").textContent = "It's a tie!";
    document
      .getElementById("tic-tac-toe-next-button")
      .classList.remove("hidden");
    return;
  }

  // GPT's turn
  document.getElementById("status").textContent = "Coach is thinking...";
  setTimeout(() => {
    callGPTForMove();
  }, 1000);
}

function callGPTForMove() {
  // Send the current board state and the unique gameId to the backend
  fetch("http://localhost:3000/api/tailgate/tictactoe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameId, board: ticTacToeBoard }), // Send gameId and board
  })
    .then((response) => {
      // Get the response code (status code)
      const statusCode = response.status;

      if (statusCode === 200) {
        // If the status code is 200 (OK), proceed with parsing the response
        return response.json(); // Parse the response body as JSON
      } else {
        console.error("Error: ", statusCode);
        isGameOver = true;
        const coachPic = document.getElementById("coach-cahr");
        coachPic.style.display = "inline-block";
        coachPic.innerHTML = '<img src="angry_cowher.jpg" alt="You Win" />';
        document
          .getElementById("tic-tac-toe-next-button")
          .classList.remove("hidden");
        document.getElementById("status").textContent =
          "Error: Coach fell asleep and couldn't make a move. You win!";;
      }
    })
    .then((data) => {
      console.log("GPT response:", data);
      const gptMoveIndex = data.move; // Get the move index from the backend response
      makeGPTMove(gptMoveIndex); // Perform GPT's move
    })
    .catch((error) => {
      console.error("Error:", error);
      isGameOver = true;
      const coachPic = document.getElementById("coach-cahr");
      coachPic.style.display = "inline-block";
      coachPic.innerHTML = '<img src="angry_cowher.jpg" alt="You Win" />';
      document
        .getElementById("tic-tac-toe-next-button")
        .classList.remove("hidden");
      document.getElementById("status").textContent =
        "Error: Coach couldn't make a move. You win!";
    });
}

function makeGPTMove(index) {
  console.log("GPT move:", index);
  if (ticTacToeBoard[index] !== "" || isGameOver) return;

  ticTacToeBoard[index] = "O";
  document.querySelector(`.cell[data-cell="${index}"]`).textContent = "O";

  if (checkWinner("O")) {
    document.getElementById("status").textContent = "Coach Cahr wins!";
    isGameOver = true;
    const coachPic = document.getElementById("coach-cahr");
    coachPic.style.display = "block";
    coachPic.innerHTML = '<img src="happy_cowher.jpg" alt="Coach Wins" />';
    document
      .getElementById("tic-tac-toe-next-button")
      .classList.remove("hidden");
    return;
  }

  if (ticTacToeBoard.every((cell) => cell !== "")) {
    document.getElementById("status").textContent = "It's a tie!";
    document
      .getElementById("tic-tac-toe-next-button")
      .classList.remove("hidden");
  } else {
    document.getElementById("status").textContent = "Your move!";
  }
}

function checkWinner(player) {
  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  return winningPatterns.some((pattern) => {
    return pattern.every((index) => ticTacToeBoard[index] === player);
  });
}

// Initialize the Tic-Tac-Toe level when shown
document
  .getElementById("tic-tac-toe-next-button")
  .addEventListener("click", () => {
    initializeTicTacToeGame();
  });

window.onload = function () {
  initializeTicTacToeGame();
};
