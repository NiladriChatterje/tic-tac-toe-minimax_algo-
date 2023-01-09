import React from 'react';
import './App.css'

let origBoard;
const humanPlayer = 'O';
const ArtificialPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
];

var cells;


function App() {
  
 function start(){
    document.querySelector(".endgameResult").style.transform = "scale(0,0)";
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
      cells[i].innerText = '';
      cells[i].style.removeProperty('background-color');
      cells[i].addEventListener('click', turnClick);
    };
  }

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, humanPlayer)
		if (!checkWin(origBoard, humanPlayer) && !checkTie()) turn(bestSpot(), ArtificialPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).textContent = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "rgba(70,70,200,0.88)" : "rgba(200,40,40,0.9)";
	}
	for (let i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".endgameResult").style.transform = "scale(1,1)";
	document.querySelector(".endgameResult .text").textContent = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, ArtificialPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (let i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	let availSpots = emptySquares();

	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, ArtificialPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	let moves = [];
	for (let i = 0; i < availSpots.length; i++) {
		let move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == ArtificialPlayer) {
			let result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			let result = minimax(newBoard, ArtificialPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	let bestMove;
	if(player === ArtificialPlayer) {
		let bestScore = -10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
React.useEffect(()=>{
  cells = document.querySelectorAll('.cell');
  start()},[]);


  return (
    <div className="App">
        <table>
        <tr>
          <td className="cell" id="0"></td>
          <td className="cell" id="1"></td>
          <td className="cell" id="2"></td>
        </tr>
        <tr>
          <td className="cell" id="3"></td>
          <td className="cell" id="4"></td>
          <td className="cell" id="5"></td>
        </tr>
        <tr>
          <td className="cell" id="6"></td>
          <td className="cell" id="7"></td>
          <td className="cell" id="8"></td>
        </tr>
      </table>
      <div className='endgameResult'><div className="text"></div></div>
      <button onClick={start}>REPLAY</button>
    </div>
  )
}

export default App
