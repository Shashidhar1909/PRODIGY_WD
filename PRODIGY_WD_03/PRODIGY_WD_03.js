let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let isAI = false;
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const gameModeButtons = document.getElementById("gameMode");

document.getElementById("twoPlayers").addEventListener("click", () => setGameMode(false));
document.getElementById("aiMode").addEventListener("click", () => setGameMode(true));

function setGameMode(ai) {
    isAI = ai;
    resetGame();
    gameModeButtons.style.display = "none"; // Hide the game mode selection
    gameActive = true;
    statusText.textContent = `Player X's turn`;
}

// Handle cell click for player vs player or AI
function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute("data-index");

    if (gameBoard[cellIndex] !== "" || !gameActive) {
        return; // Cell already filled or game ended
    }

    gameBoard[cellIndex] = currentPlayer;
    cell.classList.add(currentPlayer); // Add X or O class for color
    cell.textContent = currentPlayer;

    checkGameStatus();

    if (gameActive && !isAI) {
        currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch player
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    } else if (gameActive && isAI && currentPlayer === "X") {
        currentPlayer = "O"; // AI plays after Player X
        aiMove(); // AI makes a move
    }
}

// AI makes a move (random valid move)
function aiMove() {
    let availableCells = [];
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === "") {
            availableCells.push(i);
        }
    }

    if (availableCells.length > 0) {
        let aiChoice = availableCells[Math.floor(Math.random() * availableCells.length)];
        gameBoard[aiChoice] = "O";
        cells[aiChoice].classList.add("O");
        cells[aiChoice].textContent = "O";
        checkGameStatus();
        if (gameActive) {
            currentPlayer = "X"; // Switch back to Player X
            statusText.textContent = "Player X's turn";
        }
    }
}

// Check for win or draw
function checkGameStatus() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Check for a winning combination
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            statusText.textContent = `${currentPlayer} wins!`;
            statusText.classList.add("winning");
            triggerConfetti();
            return;
        }
    }

    // Check for a draw
    if (!gameBoard.includes("")) {
        gameActive = false;
        statusText.textContent = "It's a draw!";
    }
}

// Trigger confetti effect
function triggerConfetti() {
    for (let i = 0; i < 100; i++) {
        createConfetti();
    }
}

// Create individual confetti pieces
function createConfetti() {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = `${Math.random() * window.innerWidth}px`;
    confetti.style.animationDuration = `${Math.random() * 1 + 1}s`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 1000);
}

// Reset the game
function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = `Player X's turn`;
    statusText.classList.remove("winning");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("X", "O");
    });

    gameModeButtons.style.display = "block"; // Show game mode buttons again
}

cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

resetButton.addEventListener("click", resetGame);
