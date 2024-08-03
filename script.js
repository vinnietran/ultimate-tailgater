document.addEventListener('DOMContentLoaded', () => {
    startGame();
});

function startGame() {
    showLevel('trivia-level');
}

function showLevel(levelId) {
    document.querySelectorAll('.level').forEach(level => {
        level.classList.remove('active');
    });
    document.getElementById(levelId).classList.add('active');
}

function checkTriviaAnswer(answer) {
    if (answer === '1933') {
        alert('Correct!');
        showLevel('hangman-level');
    } else {
        alert('Try again!');
    }
}

/* Additional JavaScript for hangman, matching, video question, and silhouette reveal */

const words = ["steelers", "touchdown", "football", "quarterback"];
let selectedWord = words[Math.floor(Math.random() * words.length)];
let correctLetters = [];
let wrongLetters = [];
const hangmanParts = ["head", "body", "left-arm", "right-arm", "left-leg", "right-leg"];

document.addEventListener('DOMContentLoaded', () => {
    displayWord();
    displayLetters();
});

function displayWord() {
    const wordContainer = document.getElementById('word');
    wordContainer.innerHTML = `
        ${selectedWord
            .split('')
            .map(
                letter => `
                    <span class="letter">
                        ${correctLetters.includes(letter) ? letter : ''}
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
        correctLetters.push(letter);
        displayWord();
        checkHangmanWin();
    } else {
        wrongLetters.push(letter);
        document.getElementById('wrong-letters').innerText = `Wrong Letters: ${wrongLetters.join(', ')}`;
        document.getElementById(hangmanParts[wrongLetters.length - 1]).style.display = 'block';
        checkHangmanLoss();
    }
    document.querySelectorAll(`.letter`).forEach(el => {
        if(el.innerText === letter) {
            el.style.pointerEvents = 'none';
            el.style.color = 'gray';
        }
    });
}

function checkHangmanWin() {
    const wordContainer = document.getElementById('word');
    const innerWord = wordContainer.innerText.replace(/\n/g, '');
    if (innerWord === selectedWord) {
        alert('Congratulations! You guessed the word.');
        showLevel('matching-level');
    }
}

function checkHangmanLoss() {
    if (wrongLetters.length === hangmanParts.length) {
        alert('You lost! The word was ' + selectedWord);
        showLevel('matching-level');
    }
}

function startHangmanGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    correctLetters = [];
    wrongLetters = [];
    displayWord();
    displayLetters();
    document.getElementById('wrong-letters').innerText = '';
    hangmanParts.forEach(part => document.getElementById(part).style.display = 'none');
}

// Call this function when you want to start the hangman level
startHangmanGame();
