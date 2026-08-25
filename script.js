let board = ["","","","","","","","",""];
let gameOver = false;
let boardDiv = document.getElementById("board");
let resultDiv = document.getElementById("result");
let statusDiv = document.getElementById("status");

const wins = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function drawBoard(){
  boardDiv.innerHTML = "";
  board.forEach((val, i) => {
    let cell = document.createElement("div");
    cell.innerText = val;
    if(val === "X") cell.style.color = "#22c55e";
    if(val === "O") cell.style.color = "#ef4444";
    cell.onclick = () => playerMove(i);
    boardDiv.appendChild(cell);
  });
}
drawBoard();

function checkWinner(p){
  return wins.some(combo => combo.every(index => board[index] === p));
}

function endGame(message){
  gameOver = true;
  resultDiv.innerHTML = message; // innerHTML is important for stylish text
  resultDiv.style.display = "block";
}

function getAIMove(){
  // 1. Try to Win
  for(let i=0; i<9; i++){
    if(board[i] === ""){
      board[i] = "O";
      if(checkWinner("O")){ board[i] = ""; return i; }
      board[i] = "";
    }
  }
  // 2. Try to Block You
  for(let i=0; i<9; i++){
    if(board[i] === ""){
      board[i] = "X";
      if(checkWinner("X")){ board[i] = ""; return i; }
      board[i] = "";
    }
  }
  // 3. Take Center
  if(board[4] === "") return 4;
  // 4. Random Move
  let empty = board.map((v,i) => v === ""? i : null).filter(v => v!== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function playerMove(i){
  if(board[i]!== "" || gameOver) return;

  board[i] = "X";
  drawBoard();

  if(checkWinner("X")){
    endGame("YOU DOMINATE<br><span style='font-size:14px; color:#22c55e; letter-spacing:3px; font-weight:600;'>ANKIT AI 🤖</span>");
    return;
  }

  if(!board.includes("")){
    endGame("DRAW 🤝");
    return;
  }

  statusDiv.innerText = "Ankit AI Thinking...";

  setTimeout(() => {
    let aiIndex = getAIMove();
    if(aiIndex!== undefined){
      board[aiIndex] = "O";
      drawBoard();
    }

    if(checkWinner("O")){
      endGame("ANKIT AI WINS<br><span style='font-size:12px; color:#ef4444; letter-spacing:2px;'>TRY AGAIN 😈</span>");
    } else if(!board.includes("")){
      endGame("DRAW 🤝");
    } else {
      statusDiv.innerText = "Your Turn — You are X";
    }
  }, 400);
}
