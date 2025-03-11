//Setting up the game bord
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
  };
};

//Checking winner and combinations
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

//Player turn handling
let currentPlayer = "X";

function handleMove(position) {
  gameBoard.placeMarker(position, currentPlayer);
  const winner = checkWinner(gameBoard.getBoard());
  if (winner) {
    console.log(`${winner}) wins!`);
    alert(`${winner} wins!`);
    return; // Game ends
  }

  // Switch the player after a move
  currentPlayer = currentPlayer === "X" ? "O" : "X";
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
