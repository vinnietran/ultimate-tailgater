let score = 0;
let userData = { firstName: "", lastName: "" };
const apiEndpoint = 'http://localhost:3000/api/tailgate/cluegame';
var sessionId = '';

// Function to generate a short, unique session ID
function generateSessionId() {
  return 'session-' + Math.random().toString(36).substring(2, 10); // Generates a random string
}

// Trivia Questions (Expand as needed)
const triviaQuestions = [
  {
    question:
      "Which Steelers player holds the record for most sacks in a single season?",
    options: ["Joey Porter", "James Harrison", "T.J. Watt", "L.C. Greenwood"],
    answer: "T.J. Watt",
  },
  {
    question:
      "What is the penalty for intentional grounding in the NFL?",
    options: ["5 yards", "Loss of down", "10 yards", "Loss of down and spot foul"],
    answer: "Loss of down and spot foul",
  },
  {
    question:
      "What Pittsburgh river is formed by the confluence of the Allegheny and Monongahela Rivers?",
    options: ["Ohio River", "Mississippi River", "Potomac River", "Susquehanna River"],
    answer: "Ohio River",
  },
  {
    question:
      "What is the maximum number of challenges allowable per team, per game?",
    options: ["1", "2", "3", "Unlimited"],
    answer: "3",
  },
  {
    question:
      "If a punt goes out of bounds in the field of play without being touched, where does the receiving team start its drive?",
    options: ["At the 20-yard line", "At the spot where the ball went out of bounds", "At midfield", "At the 10-yard line"],
    answer: "At the spot where the ball went out of bounds",
  }
  
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
// const videoQuestion = {
//   videoSrc: "Daily Double.mp4",
//   question:
//     "This Hall of Game coach is known for his innovative zone blitz scheme",
//   options: [
//     "Who is Chuck Noll?",
//     "Who is Joe Green?",
//     "Who is Dick Lebeau?",
//     "Who is Coach Cahr?",
//   ],
//   answer: "Who is Dick Lebeau?", // Set the correct option
// };

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
    // case "hangman-level":
    //   startHangmanGame();
    //   break;
    case "find-ball-level":
      initializeFindBallGame();
      break;
    // case "video-question-level":
    //   setupVideoQuestion();
    //   break;
    case "tic-tac-toe-level": // Initialize Tic-Tac-Toe level
      initializeTicTacToeGame();
      break;
    case "yinzer-whisperer-level": // Initialize Yinzer Whisperer level
      console.log("Starting Yinzer Whisperer game...");
      //startGuessingGame(apiEndpoint, sessionId);
      break;
    case "completion-screen":
      displayFinalScore();
      break;
  }
}

// Show a specific level
// function showLevel(levelId) {
//   console.log("Showing level:", levelId);
//   if (levelId !== "yinzer-whisperer-level") {
//     return;
//   }
// }
//   document.querySelectorAll(".level").forEach((level) => {
//     level.classList.remove("active");
//   });
//   document.getElementById(levelId).classList.add("active");

//   if (levelId === "tic-tac-toe-level") {
//     initializeTicTacToeGame();
//     console.log("Tic-Tac-Toe level initialized");
//   }
// }

// ===================== Trivia Level =====================
function loadTriviaQuestion() {
  if (currentTriviaQuestionIndex < triviaQuestions.length) {
    const currentQuestion = triviaQuestions[currentTriviaQuestionIndex];
    document.getElementById("trivia-question").innerText = currentQuestion.question;
    const optionsDiv = document.querySelector("#trivia-level .options");
    optionsDiv.innerHTML = ""; // Clear previous options

    currentQuestion.options.forEach((option) => {
      const button = document.createElement("button");
      button.innerText = option;
      button.onclick = () => checkTriviaAnswer(button, option);
      optionsDiv.appendChild(button);
    });
  } else {
    // If no more trivia questions, move to next level
    showLevel("find-ball-level");
  }
}

function checkTriviaAnswer(selectedButton, selectedOption) {
  const currentQuestion = triviaQuestions[currentTriviaQuestionIndex];
  const optionsDiv = document.querySelector("#trivia-level .options");

  // Highlight the correct answer in green
  Array.from(optionsDiv.children).forEach((button) => {
    if (button.innerText === currentQuestion.answer) {
      button.style.backgroundColor = "green";
      button.style.color = "white";
    }
  });

  // If the selected answer is incorrect, highlight it in red
  if (selectedOption !== currentQuestion.answer) {
    selectedButton.style.backgroundColor = "red";
    selectedButton.style.color = "white";
  }

  if (selectedOption === currentQuestion.answer) {
    score += 1; // Increment the score if the answer is correct
    console.log("Correct! Score:", score);
  }

  // Delay before moving to the next question
  setTimeout(() => {
    currentTriviaQuestionIndex += 1;
    loadTriviaQuestion();
  }, 1000); // Adjust the delay time as needed (1.5 seconds here)
}


// ===================== Hangman Level =====================
// function startHangmanGame() {
//   selectedWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
//   correctLetters = [];
//   wrongLetters = [];
//   displayWord();
//   displayLetters();
//   document.getElementById("wrong-letters").innerText = "";
//   hangmanParts.forEach((part) => {
//     document.getElementById(part).style.display = "none";
//   });
// }

// function displayWord() {
//   const wordContainer = document.getElementById("word");
//   wordContainer.innerHTML = `
//         ${selectedWord
//           .split("")
//           .map(
//             (letter) => `
//                     <span class="letter">
//                         ${correctLetters.includes(letter) ? letter : "_"}
//                     </span>
//                 `
//           )
//           .join("")}
//     `;
// }

// function displayWordLoss() {
//   const wordContainer = document.getElementById("word");
//   wordContainer.innerHTML = `
//         ${selectedWord
//           .split("")
//           .map(
//             (letter) => `
//                     <span class="letter">
//                         ${correctLetters.includes(letter) ? letter : letter}
//                     </span>
//                 `
//           )
//           .join("")}
//     `;
// }

// function displayLetters() {
//   const lettersContainer = document.getElementById("letters");
//   lettersContainer.innerHTML = "abcdefghijklmnopqrstuvwxyz"
//     .split("")
//     .map(
//       (letter) => `
//         <span class="letter" onclick="handleGuess('${letter}')">${letter}</span>
//     `
//     )
//     .join("");
// }

// function handleGuess(letter) {
//   if (selectedWord.includes(letter)) {
//     if (!correctLetters.includes(letter)) {
//       correctLetters.push(letter);
//       displayWord();
//       checkHangmanWin();
//     }
//   } else {
//     if (!wrongLetters.includes(letter)) {
//       wrongLetters.push(letter);
//       document.getElementById(
//         "wrong-letters"
//       ).innerText = `Wrong Letters: ${wrongLetters.join(", ")}`;
//       const part = hangmanParts[wrongLetters.length - 1];
//       if (part) {
//         document.getElementById(part).style.display = "block";
//       }
//       checkHangmanLoss();
//     }
//   }
//   // Disable the clicked letter
//   document.querySelectorAll(`#letters .letter`).forEach((el) => {
//     if (el.innerText.toLowerCase() === letter) {
//       el.style.pointerEvents = "none";
//       el.style.color = "gray";
//     }
//   });
// }

// function checkHangmanWin() {
//   const wordContainer = document.getElementById("word");
//   const innerWord = wordContainer.innerText.replace(/\s/g, "");
//   if (innerWord === selectedWord) {
//     document.getElementById("hangman-message").innerHTML =
//       '<img src="correct-that-is-correct.gif" alt="Correct" />';
//     score += 1;
//     setTimeout(() => {
//       showLevel("find-ball-level");
//     }, 5000);
//   }
// }

// function checkHangmanLoss() {
//   if (wrongLetters.length === hangmanParts.length) {
//     document.getElementById("hangman-message").innerHTML =
//       '<img src="wrong-not.gif" alt="WRONG" />';
//     displayWordLoss();
//     setTimeout(() => {
//       showLevel("find-ball-level");
//     }, 3000);
//   }
// }

// ===================== Video Question Level =====================
// function setupVideoQuestion() {
//   const video = document.getElementById("video-question");
//   const optionsDiv = document.getElementById("video-question-options");
//   optionsDiv.classList.add("hidden");

//   // Reset options content
//   optionsDiv.innerHTML = "";

//   // Set video source
//   video.src = videoQuestion.videoSrc;

//   // Listen for video end
//   video.onended = () => {
//     optionsDiv.classList.remove("hidden");
//     // Populate options
//     const questionText = document.createElement("p");
//     questionText.innerText = videoQuestion.question;
//     optionsDiv.appendChild(questionText);
//     videoQuestion.options.forEach((option) => {
//       const button = document.createElement("button");
//       button.innerText = option;
//       button.onclick = () => checkVideoAnswer(option);
//       optionsDiv.appendChild(button);
//     });
//   };
// }

// function checkVideoAnswer(selectedOption) {
//   if (selectedOption === videoQuestion.answer) {
//     score += 2;
//   } else {
//   }
//   showLevel("completion-screen");
//   submitScore();
//   //getLeaderboardData()
//   document.getElementById("leaderboard-table").classList.add("hidden");
//   setInterval(getLeaderboardData, 10000); // Refresh leaderboard every second
// }

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
  console.log("Fetching leaderboard data...");
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
  console.log(score)
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
    showLevel("tic-tac-toe-level");
  }, 3000);
}

// ===================== Tic Tac Toe Level =====================
let gameId = null; // Unique game ID
let ticTacToeBoard = ["", "", "", "", "", "", "", "", ""];
let isGameOver = false;
let playerSymbol = "X"; // Player is 'X', GPT is 'O'

function initializeTicTacToeGame() {
  console.log(score)
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
    endGame(
      "You win!",
      "angry_cowher.jpg",
      "You Win",
      true // Indicating that the player is the winner
    );
    return;
  }

  if (ticTacToeBoard.every((cell) => cell !== "")) {
    endGame(
      "It's a tie!",
      "cowher_tie.jpg", // Replace with an appropriate tie image
      "Tie"
    );
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
      const statusCode = response.status;

      if (statusCode !== 200) {
        endGame(
          "Error: Coach fell asleep and couldn't make a move. You win!",
          "angry_cowher.jpg",
          "You Win",
          true
        );
        throw new Error("Invalid status code: " + statusCode);
      }
      return response.json();
    })
    .then((data) => {
      console.log("GPT response:", data);
      const gptMoveIndex = data.move; // Get the move index from the backend response
      makeGPTMove(gptMoveIndex); // Perform GPT's move
    })
    .catch((error) => {
      console.error("Error:", error);
      endGame(
        "Error: Coach couldn't make a move. You win!",
        "angry_cowher.jpg",
        "You Win",
        true
      );
    });
}

function makeGPTMove(index) {
  console.log("GPT move:", index);
  if (ticTacToeBoard[index] !== "" || isGameOver) return;

  ticTacToeBoard[index] = "O";
  document.querySelector(`.cell[data-cell="${index}"]`).textContent = "O";

  if (checkWinner("O")) {
    endGame(
      "Coach Cahr wins!",
      "happy_cowher.jpg",
      "Coach Wins"
    );
    return;
  }

  if (ticTacToeBoard.every((cell) => cell !== "")) {
    endGame(
      "It's a tie!",
      "neutral_cowher.jpg", // Replace with an appropriate tie image
      "Tie"
    );
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

// window.onload = function () {
//   initializeTicTacToeGame();
// };

function endGame(message, imageUrl, imageAlt, isWinner = false) {
  console.log("Game over:", message);
  // Show status message and image
  document.getElementById("status").textContent = message;
  isGameOver = true;

  const coachPic = document.getElementById("coach-cahr");
  coachPic.style.display = "inline-block";
  coachPic.innerHTML = `<img src="${imageUrl}" alt="${imageAlt}" />`;

  // Show the "Next" button for moving to the next level
  //document.getElementById("tic-tac-toe-next-button").classList.remove("hidden");

  // Only update the score if the player won or based on level logic
  if (isWinner) {
    score += 1; // Add to score if the player won this level
  }

  // Notify the parent game controller (if any) that this level has finished
  if (typeof updateGlobalGameStatus === 'function') {
    updateGlobalGameStatus(); // Call a parent function to move to the next level or update overall score
  }

  //endTheWholeGame();

  setTimeout(() => {
    // Uncomment if moving to next level
    showLevel("yinzer-whisperer-level");
  }, 2000);
}

function endTheWholeGame() {
  submitScore();
  document.getElementById("leaderboard-table").classList.add("hidden");
  setInterval(getLeaderboardData, 10000); // Refresh leaderboard every second
}


// Function to start the guessing game
function startGuessingGame(apiEndpoint) {
  console.log(score)
  document.getElementById("steelers-logo").style.display = "none"; // Hide the Steelers logo
  console.log("Starting Yinzer Whisperer game with endpoint:", apiEndpoint);

  sessionId = generateSessionId(); // Generate a unique session ID

  // Show the thinking placeholder
  document.getElementById("yinzer-message").innerText = "Starting game...";

  // Send initial POST request to start the game
  fetch(apiEndpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Game started:", data);
      // Hide the thinking placeholder and display GPT's response
      displayMessage(data.clue);

      // Show Yes/No buttons for user response
      document.getElementById("answer-buttons").style.display = "block";
      document.getElementById("start-game-section").style.display = "none"; // Hide start button
  })
  .catch(error => {
      console.error("Error starting game:", error);
      document.getElementById("yinzer-message").innerText = "Error starting game. Please try again.";
  });
}

// Function to send Yes/No response during the guessing game
function sendResponse(playerResponse, sessionId) {
  console.log("Sending response:", playerResponse);

  // Display the thinking placeholder and temporarily hide Yes/No buttons
  displayMessage("The Yinzer Whisper is Thinking...");
  document.getElementById("answer-buttons").style.display = "none";

  // Send POST request with user response
  fetch(apiEndpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId, playerResponse })
  })
  .then(response => response.json())
  .then(data => {
      // Hide thinking placeholder and display GPT's new response
      displayMessage(data.clue);
      console.log(data)

      // Show Yes/No buttons again for the next question
      if (data.questionsCount < 10) {
        document.getElementById("answer-buttons").style.display = "block";
      } else if (data.questionsCount === 10) {
        document.getElementById("answer-buttons").style.display = "none"; // Hide buttons after 10 questions
        document.getElementById("end-game-buttons").style.display = "block"; // Show Steelers logo
      } else {
        document.getElementById("end-game-buttons").style.display = "none"; // Show Steelers logo 
        endTheWholeGame();     
        setTimeout(() => {
          // Uncomment if moving to next level
          showLevel("completion-screen");
        }, 10000);
      }
  })
  .catch(error => {
      console.error("Error sending response:", error);
      document.getElementById("yinzer-message").innerText = "Error processing response. Please try again.";
      document.getElementById("answer-buttons").style.display = "block"; // Show buttons in case of error
  });
}

function displayMessage(message) {
  const messageBox = document.getElementById("yinzer-messages");
  const messageText = document.getElementById("yinzer-message");

  // Set new message and add animation class
  messageText.innerText = message;
  messageBox.classList.add("new-message");

  // Remove the animation class after a short delay
  setTimeout(() => {
      messageBox.classList.remove("new-message");
  }, 500); // 500ms delay for animation effect
}


function stumpedWhisperer () {
  console.log("STUMPED")
  score += 1;
  console.log("final " + score)
}




