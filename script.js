let board = Array(9).fill("");
let gameOver = false;
let currentLevel = "hard"; // Default 90% Hard

const boardDiv = document.getElementById("board");
const statusText = document.getElementById("status");
const resultDiv = document.getElementById("result");

function setLevel(level){
  currentLevel = level;
  document.getElementById("easyBtn").className = level === "easy"? "active" : "";
  document.getElementById("hardBtn").className = level === "hard"? "active" : "";
  resetGame();
}

 function render(){
  boardDiv.innerHTML = "";
  board.forEach((val,i)=>{
    let cell = document.createElement("div");
    cell.innerText = val;
    cell.onclick = ()=> playerMove(i);
    // 3 cell ke baad result ko beech me daal do
    if(i===3){
      boardDiv.appendChild(resultDiv);
    }
    boardDiv.appendChild(cell);
  });
  // shuru me ek baar bhi add karna hai
  if(board.every(v=>v==="")){
     boardDiv.insertBefore(resultDiv, boardDiv.children[3]);
  }
}

function playerMove(i){
  if(board[i]!=="" || gameOver) return;
  board[i]="X";
  render();
  if(checkEnd()) return;
  statusText.innerText = "Ankit AI Thinking...";
  setTimeout(()=>{
    let ai = getAIMove();
    if(ai!==undefined){ board[ai]="O"; }
    render();
    checkEnd();
  }, 400);
}

function getAIMove(){
  let bestMove = null;
  // 1. AI jeet sakta hai?
  for(let i=0;i<9;i++){
    if(board[i]===""){ board[i]="O"; if(checkWinner("O")){ bestMove=i; board[i]=""; break; } board[i]=""; }
  }
  // 2. Player ko rokna hai?
  if(bestMove===null){
    for(let i=0;i<9;i++){
      if(board[i]===""){ board[i]="X"; if(checkWinner("X")){ bestMove=i; board[i]=""; break; } board[i]=""; }
    }
  }
  if(bestMove===null && board[4]==="") bestMove = 4; // Center

  let empty = board.map((v,i)=> v===""? i:null).filter(v=> v!==null);
  let randomMove = empty[Math.floor(Math.random()*empty.length)];
  if(bestMove===null) bestMove = randomMove;

  // 90% HARD LOGIC
  if(currentLevel==="hard"){
    return Math.random() < 0.9? bestMove : randomMove;
  }else{
    return Math.random() < 0.9? randomMove : bestMove;
  }
}

function checkWinner(p){
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return wins.some(c=> c.every(i=> board[i]===p));
}

function checkEnd(){
  if(checkWinner("X")){ endGame("YOU DOMINATE ANKIT AI 🔥"); return true; }
  if(checkWinner("O")){ endGame("ANKIT AI WINS 😈"); return true; }
  if(!board.includes("")){ endGame("DRAW 🤝"); return true; }
  statusText.innerText = "Your Turn - You are X";
  return false;
}

function endGame(msg){
  gameOver=true;
  resultDiv.innerText = msg;
  resultDiv.style.display = "block";
  // YEH 3 LINE SE
