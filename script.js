// VARIABLES

let gameStarted = false;
let gamePaused = false;
let score = 0;

// BUTTONS
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const restartButton = document.getElementById('restart');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const downButton = document.getElementById('down');

// CANVAS 
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const columns = 10;
const rows = 10;
const blockSize = 400/columns;

canvas.width = 400;
canvas.height = blockSize * rows; // 40 * 20 = 800px


let board = [];
for (let r = 0; r < rows; r++) {
  board[r] = [];
  for (let c = 0; c < columns; c++) {
    board[r][c] = 0;
  }
}

// PIECES

const I = [
  [0,0,0,0],
  [1,1,1,1],
  [0,0,0,0],
  [0,0,0,0]
];
const J = [
  [1,0,0,0],
  [1,1,1,0],
  [0,0,0,0],
  [0,0,0,0]
];
const L = [
  [0,0,0,1],
  [0,1,1,1],
  [0,0,0,0],
  [0,0,0,0]
];
const O = [
  [1,1],
  [1,1]
];
const T = [
  [0,1,0],
  [1,1,1],
  [0,0,0]
];
const S = [
  [0,1,1],
  [0,1,1],
  [0,0,0]
];
const Z = [
  [1,1,0],
  [0,1,1],
  [0,0,0]
];

const pieces = [
  { shape: I, color: "#4485baff" },
  { shape: J, color: "#37378dff" },
  { shape: L, color: "#d5904bff" },
  { shape: O, color: "#f0f087ff" },
  { shape: T, color: "#dd6dddff" },
  { shape: S, color: "#64cc64ff" },
  { shape: Z, color: "#c14545ff" }
];


let currentPiece = pieces[Math.floor(Math.random() * pieces.length)];
let pieceRow = 0;
let pieceCol = 3;


function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw fixed blocks
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] !== 0) {
        ctx.fillStyle = board[r][c];
        ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
      }
      ctx.strokeStyle = "#a84247ff";
      ctx.strokeRect(c * blockSize, r * blockSize, blockSize, blockSize);
    }
  }

  
  for (let r = 0; r < currentPiece.shape.length; r++) {
    for (let c = 0; c < currentPiece.shape[r].length; c++) {
      if (currentPiece.shape[r][c] !== 0) {
        ctx.fillStyle = currentPiece.color;
        ctx.fillRect((pieceCol + c) * blockSize, (pieceRow + r) * blockSize, blockSize, blockSize);
        ctx.strokeStyle = "#a84247ff";
        ctx.strokeRect((pieceCol + c) * blockSize, (pieceRow + r) * blockSize, blockSize, blockSize);
      }
    }
  }
}

// COLLISION
function checkCollision(nextRow = pieceRow, nextCol = pieceCol) {
  for (let r = 0; r < currentPiece.shape.length; r++) {
    for (let c = 0; c < currentPiece.shape[r].length; c++) {
      if (currentPiece.shape[r][c] !== 0) {
        let newRow = nextRow + r;
        let newCol = nextCol + c;

        if (
          newRow >= rows || 
          newCol < 0 || 
          newCol >= columns ||
          (newRow >= 0 && board[newRow][newCol] !== 0)
        ) {
          return true;
        }
      }
    }
  }
  return false;
}


// MERGE PIECE
function mergePiece() {
  for (let r = 0; r < currentPiece.shape.length; r++) {
    for (let c = 0; c < currentPiece.shape[r].length; c++) {
      if (currentPiece.shape[r][c] !== 0) {
        let boardRow = pieceRow + r;
        let boardCol = pieceCol + c;
        if (boardRow >= 0 && boardRow < rows && boardCol >= 0 && boardCol < columns) {
          board[boardRow][boardCol] = currentPiece.color;
        }
      }
    }
  }
}


// SPAWN NEW PIECE

function spawnPiece() {
  currentPiece = pieces[Math.floor(Math.random() * pieces.length)];
  pieceRow = 0;
  pieceCol = 3;

}


// DROP PIECE

let fallSpeed = 500;




// START GAME
let gameInterval = null;
drawBoard();

function moveLeft() {
  if (!gameStarted || gamePaused) return;
  if (!checkCollision(pieceRow, pieceCol - 1)) {
    pieceCol--;
    drawBoard();
  }
}

function moveRight() {
  if (!gameStarted || gamePaused) return;
  if (!checkCollision(pieceRow, pieceCol + 1)) {
    pieceCol++;
    drawBoard();
  }
}

function moveDown() {
  if (!gameStarted || gamePaused) return;
  dropPiece();
}
''
leftButton.addEventListener('click', moveLeft);
rightButton.addEventListener('click', moveRight);
downButton.addEventListener('click', moveDown);
document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowLeft") moveLeft();
  else if (e.key === "ArrowRight") moveRight();
  else if (e.key === "ArrowDown") moveDown();
});

function gameOver() {
  clearInterval(gameInterval);
  const resultBox = document.getElementById("result");
  resultBox.style.display = "block";
}
function dropPiece() {
  if (!checkCollision(pieceRow + 1, pieceCol)) {
    pieceRow++;
  } else {
    mergePiece();
    checkFullRows();

    
    if (pieceRow === 0) {
      gameOver();
      return;
    }

    spawnPiece();
  }

  drawBoard();
}

function updateScore()  {
  document.getElementById("score").innerText = "score:" + score;
}

function checkFullRows() {
  for (let r = rows - 1; r >= 0; r--) {
    let full = true;

    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        full = false;
        break;
      }
    }

    if (full) {
      board.splice(r, 1);               // remove full row
      board.unshift(new Array(columns).fill(0)); // add empty row on top
      score += 100;                     
      updateScore();
      r++; 
    }
  }

}

startButton.addEventListener("click",()=> {
  if (!gameStarted) {
    gameInterval = setInterval(dropPiece, fallSpeed);
    gameStarted = true;
    gamePaused = false;
    gameRestarted = false;
  }
});

pauseButton.addEventListener("click", () => {
  // GAME IS RUNNING → PAUSE
  if (gameInterval !== null) {
    clearInterval(gameInterval);
    gameInterval = null;
    pauseButton.innerText = "Resume";
  } 
  // GAME IS PAUSED → RESUME
  else {
    gameInterval = setInterval(dropPiece, fallSpeed);
    pauseButton.innerText = "Pause";
    pauseButton.style.fontWeight = "bold";
  }
});

restartButton.addEventListener("click", () => {
  clearInterval(gameInterval); 
  gameInterval = fallSpeed;
  gameInterval = null;
  gameStarted = false;
  gamePaused = false;
  score = 0;
  updateScore();              

  // reset the board
  board = [];
  for (let r = 0; r < rows; r++) {
    board[r] = new Array(columns).fill(0);
  }

  // reset current piece
  spawnPiece();
  drawBoard();

  // reset buttons
  
  pauseButton.disabled = false;
  startButton.disabled = false;
  pauseButton.innerText = "Pause";
});

