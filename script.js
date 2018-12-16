//initiate origin board
var origBoard;

//init human player
const human = 'O';
//init AI player
const ai = 'X';
//init winning tables
const winCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,4,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[2,4,6]
]

//select all cell classes from the page
const cells = document.querySelectorAll('.cell');

// calling the function
startGame();

function startGame(){
	document.querySelector(".endgame").style.display = 'none';
	origBoard = Array.from(Array(9).keys());

	for (var i = 0 ; i< cells.length; i++){
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}


//get cell ID clicked
function turnClick(square){
	//disable celss already clicked
	if(typeof origBoard[square.target.id] == 'number'){
		turn(square.target.id, human)
		if(!checkTie()) turn(bestSpot(), ai);		
	}
}

function turn(squareId, player){
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;

	//check which player won after turn
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon);
}

//checkWin function
function checkWin(board, player) {
	// reduce the pla
	let plays = board.reduce((a,e,i) => (e ===player) ? a.concat(i) : a, [])
	let gameWon = null;
	//pick index of the win
	for (let [index, win] of winCombos.entries())
	{	//check if the player has played in every box that counts as a win
		if (win.every(elem => plays.indexOf (elem) >-1)){
			//create an object to put which player one
			gameWon = {index: index, player: player};
			break;
		}
	}

	return gameWon;
}

function gameOver(gameWon){
	for (let index of winCombos[gameWon.index]){

		//change background color if won!
		document.getElementById(index).style.backgroundColor =
		gameWon.player 	== human ? "blue" : "red";
	}
	for (var i  = 0; i <cells.length; i++){
		//disable played cells if gameOver
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == human ? "WINNER!" : "Computer Wins! ");
}

function declareWinner(who){
	document.querySelector(".endgame").style.display = 'block'; 
	document.querySelector(".endgame .text").innerText = who;  
}

function emptySquare(){
	return origBoard.filter(s => typeof s == 'number')
}

function bestSpot(){
	return emptySquare()[0];

}

function checkTie() {
	if(emptySquare().length==0)
	{
		for (var i=0; i<cells.length; i++){
			cells[i].style.backgroundColor = 'green';
			cells[i].removeEventListener('click', turnClick, false); 
		}
		declareWinner("Tie Game");
		return true;
	}
	return false;
}

//AI useing MINIMAX
function minimax(newBoard, player){
	var availableSpots = emptySquare(newBoard);

	if (checkWin(newBoard, player)){
		return{score: -10};
	}else if(newBoard, ai){
		return{score: 10};
	}else if(availableSpots.length === 0){
		return{score: 0};
	}
	var moves =[];

	for(var i = 0; i < availableSpots.length; i++)
	{
		var move = {};
		move.index = newBoard[availableSpots[i]];
		newBoard[availableSpots[i]] = player;

		if (player == ai){
			var result = minimax(newBoard, human);
			move.score = result.score;
		}else {
			var result = minimax(newBoard, ai);
			move.score = result.score;			
		}

		newBoard[availableSpots[i]] = move.index;

		move.push(move);
	}

	var bestMove;
	if(player == ai){
		var bestScore = -100000;
		for(var i = 0; i < moves.length; i++){
			if(moves[i].score>bestScore){
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
		}else{
			var bestScore = 100000;
			for(var i = 0; i < moves.length; i++){
				if(moves[i].score < bestScore){
					bestScore = moves[i].score;
					bestMove = i;
				}

			}
		}
	return moves[bestMove];
	}
