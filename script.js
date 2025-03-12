// Setting up the game board
const GameBoard = () => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const placeMarker = (position, marker) => {
    if (position >= 0 && position <= 8 && board[position] === "") {
      board[position] = marker;
    }
  };

  return {
    placeMarker,
    getBoard: () => board,
    reset: () => (board = ["", "", "", "", "", "", "", "", ""]),
  };
};

let gameBoard = GameBoard(); // Instantiate the game board

// Checking winner and combinations
const checkWinner = (board) => {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] === board[b] && board[b] === board[c] && board[a] !== "") {
      return board[a];
    }
  }
  return null;
};

// Minimax Algorithm with depth limit for medium difficulty
function minimax(board, depth, isMaximizingPlayer, alpha, beta, maxDepth) {
  const winner = checkWinner(board);
  if (winner === "O") return 1; // AI wins
  if (winner === "X") return -1; // Player wins
  if (!board.includes("")) return 0; // Draw

  if (depth >= maxDepth) return 0; // Stop recursion at max depth

  if (isMaximizingPlayer) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O"; // AI's turn
        best = Math.max(
          best,
          minimax(board, depth + 1, false, alpha, beta, maxDepth)
        );
        board[i] = ""; // Undo move
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break; // Beta pruning
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X"; // Player's turn
        best = Math.min(
          best,
          minimax(board, depth + 1, true, alpha, beta, maxDepth)
        );
        board[i] = ""; // Undo move
        beta = Math.min(beta, best);
        if (beta <= alpha) break; // Alpha pruning
      }
    }
    return best;
  }
}

// Function to simulate AI move (Minimax-based or Random-based depending on difficulty)
function aiMove(difficulty) {
  if (gameOver) return; // Prevent AI moves after the game ends

  let bestVal = -Infinity;
  let bestMove = -1;

  if (difficulty === "easy") {
    // Random move for easy difficulty
    let availableMoves = gameBoard
      .getBoard()
      .map((val, index) => (val === "" ? index : -1))
      .filter((index) => index !== -1);
    bestMove =
      availableMoves[Math.floor(Math.random() * availableMoves.length)];
  } else {
    // Use Minimax for medium and hard difficulty
    let maxDepth = difficulty === "medium" ? 2 : 9; // Depth limit for medium, full depth for hard

    for (let i = 0; i < gameBoard.getBoard().length; i++) {
      if (gameBoard.getBoard()[i] === "") {
        gameBoard.placeMarker(i, "O"); // Try AI's move
        let moveVal = minimax(
          gameBoard.getBoard(),
          0,
          false,
          -Infinity,
          Infinity,
          maxDepth
        );
        gameBoard.getBoard()[i] = ""; // Undo move

        if (moveVal > bestVal) {
          bestVal = moveVal;
          bestMove = i;
        }
      }
    }
  }

  // Apply the best move found by the AI
  gameBoard.placeMarker(bestMove, "O");
  const square = document.querySelector(`.square[data-index="${bestMove}"]`);
  square.textContent = "O";

  // Check for winner
  const winner = checkWinner(gameBoard.getBoard());
  if (winner) {
    console.log(`${winner} wins!`);
    showModal(`${winner} wins!`);
    gameOver = true;
    return; // Game ends
  }

  // Check for a draw
  if (!gameBoard.getBoard().includes("") && !winner) {
    console.log("It's a draw!");
    showModal("It's a draw!");
    gameOver = true;
    return; // Game ends
  }

  // Switch player to X
  currentPlayer = "X";
  document.querySelector("#currentPlayer").textContent = `Player ${
    currentPlayer === "X" ? 1 : 2
  } (${currentPlayer})`;
}

// Function to handle player's move
function handleMove(position) {
  if (gameOver) return; // Prevent moves after the game ends

  if (gameBoard.getBoard()[position] === "") {
    gameBoard.placeMarker(position, "X");

    // Update the UI
    const square = document.querySelector(`.square[data-index="${position}"]`);
    square.textContent = "X";

    // Check for winner
    const winner = checkWinner(gameBoard.getBoard());
    if (winner) {
      console.log(`${winner} wins!`);
      showModal(`${winner} wins!`);
      gameOver = true;
      return; // Game ends
    }

    // Check for a draw
    if (!gameBoard.getBoard().includes("") && !winner) {
      console.log("It's a draw!");
      showModal("It's a draw!");
      gameOver = true;
      return; // Game ends
    }

    // Switch player to AI
    currentPlayer = "O";
    document.querySelector("#currentPlayer").textContent = `Player ${
      currentPlayer === "X" ? 1 : 2
    } (${currentPlayer})`;

    // AI makes its move after player
    if (currentPlayer === "O" && !gameOver) {
      aiMove(currentDifficulty); // Pass difficulty level
    }
  }
}

// Show modal function
function showModal(message) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  modalMessage.textContent = message;
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

// Setup the event listeners for the board squares
const squares = document.querySelectorAll(".square");

squares.forEach((square) => {
  square.addEventListener("click", (e) => {
    const index = parseInt(e.target.getAttribute("data-index"));
    if (gameBoard.getBoard()[index] === "") {
      handleMove(index);
    }
  });
});

// Difficulty selector (Easy, Medium, Hard)
let currentDifficulty = "medium"; // Default to medium difficulty

function setDifficulty(difficulty) {
  currentDifficulty = difficulty;
  console.log(`Difficulty set to ${difficulty}`);
}

// Reset the game
function resetGame() {
  gameBoard.reset(); // Recreate the game board
  gameOver = false;
  currentPlayer = "X"; // Reset to Player 1 (X)

  // Clear the UI
  const squares = document.querySelectorAll(".square");
  squares.forEach((square) => {
    square.textContent = "";
  });

  // Reset the current player display
  document.querySelector("#currentPlayer").textContent = `Player 1 (X)`;

  // Choose random AI behavior for Easy mode on reset
  if (currentDifficulty === "easy") {
    aiMove("easy"); // Random move
  }
}
