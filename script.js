let score = 0;
let userData = { firstName: '', lastName: '' };

// Trivia Questions (Expand as needed)
const triviaQuestions = [
    {
        question: "What year were the Steelers founded?",
        options: ["1933", "1945", "1960", "1970"],
        answer: "1933"
    }, 
    {
        question: "Who was the first Pittsburgh Steelers player inducted into the Pro Football Hall of Fame?",
        options: ["Terry Bradshaw", "Ernie Stautner", "Joe Green", "Coach Cahr"],
        answer: "Ernie Stautner"
    }, 
    {
        question: "In an NFL game, if an offensive player moves or flinches before the ball is snapped, what is the penalty called?",
        options: ["Touchdown", "Pass Interference", "Delay of Game", "False Start"],
        answer: "False Start"
    }, 
    {
        question: "Who is the current Quarterbacks Coach for the Pittsburgh Steelers?",
        options: ["Tom Arth", "Kordell Stewart", "Matt Canada", "Coach Cahr"],
        answer: "Tom Arth"
    }, 
    {
        question: "What is the name of the front office position that Omar Khan holds for the Pittsburgh Steelers?",
        options: ["Scout", "General Manager", "Draft Specialist", "Running Back"],
        answer: "General Manager"
    },
    {
        question: "What happens if the ball carrier is tackled in their own end zone?",
        options: ["TouchDahn!", "TouchBACK!", "Safety", "Coach Cahr"],
        answer: "Hypocycloid"
    },
    {
        question: "What shape is featured on the Pittsburgh Steelers logo?",
        options: ["Rombous", "Hypocycloid", "Diamond", "Square"],
        answer: "Hypocycloid"
    }
    // Add more trivia questions here
];

// Current Trivia Question Index
let currentTriviaQuestionIndex = 0;

// Hangman Variables
const hangmanWords = ["renegade"];
let selectedWord = '';
let correctLetters = [];
let wrongLetters = [];
const hangmanParts = ["head", "body", "left-arm", "right-arm", "left-leg", "right-leg"];

// Video Question Variables
const videoQuestion = {
    videoSrc: "Daily Double.mp4",
    question: "This Hall of Game coach is known for his innovative zone blitz scheme",
    options: ["Who is Chuck Noll?", "Who is Joe Green?", "Who is Dick Lebeau?", "Who is Coach Cahr?"],
    answer: "Who is Dick Lebeau?" // Set the correct option
};

// Event Listener for Form Submission
document.getElementById('user-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    if(firstName && lastName) {
        userData.firstName = firstName;
        userData.lastName = lastName;
        score = 0; // Initialize score
        showLevel('trivia-level');
    }
});

// Function to Show a Specific Level
function showLevel(levelId) {
    console.log('Navigating to level:', levelId); // Debugging
    document.querySelectorAll('.level').forEach(level => {
        level.classList.remove('active');
    });
    document.getElementById(levelId).classList.add('active');

    switch(levelId) {
        case 'trivia-level':
            loadTriviaQuestion();
            break;
        case 'hangman-level':
            startHangmanGame();
            break;
        case 'video-question-level':
            setupVideoQuestion();
            break;
        case 'completion-screen':
            displayFinalScore();
            break;
    }
}

// ===================== Trivia Level =====================
function loadTriviaQuestion() {
    if(currentTriviaQuestionIndex < triviaQuestions.length) {
        const currentQuestion = triviaQuestions[currentTriviaQuestionIndex];
        document.getElementById('trivia-question').innerText = currentQuestion.question;
        const optionsDiv = document.querySelector('#trivia-level .options');
        optionsDiv.innerHTML = ''; // Clear previous options
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.onclick = () => checkTriviaAnswer(option);
            optionsDiv.appendChild(button);
        });
    } else {
        // If no more trivia questions, move to next level
        showLevel('hangman-level');
    }
}

function checkTriviaAnswer(selectedOption) {
    const currentQuestion = triviaQuestions[currentTriviaQuestionIndex];
    if(selectedOption === currentQuestion.answer) {
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
    document.getElementById('wrong-letters').innerText = '';
    hangmanParts.forEach(part => {
        document.getElementById(part).style.display = 'none';
    });
}

function displayWord() {
    const wordContainer = document.getElementById('word');
    wordContainer.innerHTML = `
        ${selectedWord
            .split('')
            .map(
                letter => `
                    <span class="letter">
                        ${correctLetters.includes(letter) ? letter : '_'}
                    </span>
                `
            )
            .join('')}
    `;
}

function displayWordLoss() {
    const wordContainer = document.getElementById('word');
    wordContainer.innerHTML = `
        ${selectedWord
            .split('')
            .map(
                letter => `
                    <span class="letter">
                        ${correctLetters.includes(letter) ? letter : letter}
                    </span>
                `
            )
            .join('')}
    `;
}

function displayLetters() {
    const lettersContainer = document.getElementById('letters');
    lettersContainer.innerHTML = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => `
        <span class="letter" onclick="handleGuess('${letter}')">${letter}</span>
    `).join('');
}

function handleGuess(letter) {
    if (selectedWord.includes(letter)) {
        if(!correctLetters.includes(letter)) {
            correctLetters.push(letter);
            displayWord();
            checkHangmanWin();
        }
    } else {
        if(!wrongLetters.includes(letter)) {
            wrongLetters.push(letter);
            document.getElementById('wrong-letters').innerText = `Wrong Letters: ${wrongLetters.join(', ')}`;
            const part = hangmanParts[wrongLetters.length - 1];
            if(part) {
                document.getElementById(part).style.display = 'block';
            }
            checkHangmanLoss();
        }
    }
    // Disable the clicked letter
    document.querySelectorAll(`#letters .letter`).forEach(el => {
        if(el.innerText.toLowerCase() === letter) {
            el.style.pointerEvents = 'none';
            el.style.color = 'gray';
        }
    });
}

function checkHangmanWin() {
    const wordContainer = document.getElementById('word');
    const innerWord = wordContainer.innerText.replace(/\s/g, '');
    if (innerWord === selectedWord) {
        document.getElementById("hangman-message").innerHTML = "\<img src=\"correct-that-is-correct.gif\" alt=\"Correct\" />";
        score += 1;
        setTimeout(() => {
            showLevel('video-question-level');
        }, 5000);
    }
}

function checkHangmanLoss() {
    if (wrongLetters.length === hangmanParts.length) {
        document.getElementById("hangman-message").innerHTML = "\<img src=\"wrong-not.gif\" alt=\"WRONG\" />";  
        displayWordLoss();      
        setTimeout(() => {
            showLevel('video-question-level');
        }, 3000);
    }
}

// ===================== Video Question Level =====================
function setupVideoQuestion() {
    const video = document.getElementById('video-question');
    const optionsDiv = document.getElementById('video-question-options');
    optionsDiv.classList.add('hidden');

    // Reset options content
    optionsDiv.innerHTML = '';

    // Set video source
    video.src = videoQuestion.videoSrc;

    // Listen for video end
    video.onended = () => {
        optionsDiv.classList.remove('hidden');
        // Populate options
        const questionText = document.createElement('p');
        questionText.innerText = videoQuestion.question;
        optionsDiv.appendChild(questionText);
        videoQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.onclick = () => checkVideoAnswer(option);
            optionsDiv.appendChild(button);
        });
    };
}

function checkVideoAnswer(selectedOption) {
    if(selectedOption === videoQuestion.answer) {
        score += 2;
    } else {
    }
    showLevel('completion-screen');
    submitScore()
    //getLeaderboardData()
    setInterval(getLeaderboardData, 1000); // Refresh leaderboard every second
}

// ===================== Completion Screen =====================
function displayFinalScore() {
    document.getElementById('final-score').innerText = score;
}

function moveToNextLevel() {
    // Placeholder for potential future levels
    showLevel('completion-screen');
}

// ===================== Submit Score to Google Sheets =====================

// Replace with your Google Apps Script Web App URL
const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwdcC0CTXGt8tq_zP6kvxriGTvEJDy7N7uxeq7xX0RuWk3NEmNS2frKz5L-iGf1qHagTA/exec';

function submitScore() {
    const data = {
        name: userData.firstName + " " + userData.lastName,
        score: score
    };

    fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

function getLeaderboardData() {
    fetch(GOOGLE_SHEET_WEB_APP_URL)
        .then(response => response.json())
        .then(data => {
            const leaderboardElement = document.getElementById('leaderboard-body');
            leaderboardElement.innerHTML = ''; // Clear previous leaderboard data

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
            data.forEach(entry => {
                const entryRow = document.createElement('tr');
                const rankCell = document.createElement('td');
                rankCell.style.border = '5px solid gray'; // Add gray border
                console.log(entry.rank);
                if (entry.rank === 1) {
                    console.log("Trophy");
                    const trophyImg = document.createElement('img');
                    trophyImg.src = 'trophy.gif';
                    trophyImg.alt = 'Trophy';
                    console.log(trophyImg)
                    rankCell.appendChild(trophyImg);
                }
                rankCell.innerText = entry.rank;
                const nameCell = document.createElement('td');
                nameCell.innerText = entry.name;
                nameCell.style.border = '5px solid gray'; // Add gray border
                const scoreCell = document.createElement('td');
                scoreCell.innerText = entry.score;
                scoreCell.style.border = '5px solid gray'; // Add gray border
                entryRow.appendChild(rankCell);
                entryRow.appendChild(nameCell);
                entryRow.appendChild(scoreCell);
                leaderboardElement.appendChild(entryRow);
            });
        })
        .catch(error => {
            console.error('Error fetching leaderboard data:', error);
        });
}
