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
	//select the endgame modal and hide it
	document.querySelector(".endgame").style.display = 'none';
	origBoard = Array.from(Array(9).keys());
	//remove the background color of winning cells
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
		//human's turn
		turn(square.target.id, human)
		//check if it is a tie or not, then switch turn to ai with the best turn score derived from the minimax function
		if(!checkTie()) turn(bestSpot(), ai);		
	}
}

function turn(squareId, player){
	//select the player's role and put the corresponding text (O/X) onto the table
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;

	//check which player won after turn
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon);
}

//checkWin function
function checkWin(board, player) {
	// reduce the player's options
	let plays = board.reduce((a,e,i) => (e ===player) ? a.concat(i) : a, [])
	//reset the gameWon value
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
	//loops for each index of win combos, 
	for (let index of winCombos[gameWon.index]){

		//change background color if won!
		document.getElementById(index).style.backgroundColor =
		gameWon.player 	== human ? "blue" : "red";
	}
	for (var i  = 0; i <cells.length; i++){
		//disable played cells if gameOver
		cells[i].removeEventListener('click', turnClick, false);
	}
	//put text onto the endgame modal
	declareWinner(gameWon.player == human ? "WINNER!" : "Computer Wins! ");
}
	//to show the modal and returns winning player
function declareWinner(who){
	document.querySelector(".endgame").style.display = 'block'; 
	document.querySelector(".endgame .text").innerText = who;  
}

//selects empty squares
function emptySquare(){
	return origBoard.filter(s => typeof s == 'number')
}

//selects the best spot
function bestSpot(){
	return emptySquare()[0];

}
//checks if it is a tie or not
function checkTie() {
	//if there is no empty squares left
	if(emptySquare().length==0)
	{
		//loops through each cells and change the color
		for (var i=0; i<cells.length; i++){
			cells[i].style.backgroundColor = 'green';
			//disables the click listener
			cells[i].removeEventListener('click', turnClick, false); 
		}
		//show the winner
		declareWinner("Tie Game");
		return true;
	}
	return false;
}

//AI useing MINIMAX
function minimax(newBoard, player){
	
	//init available squares
	var availableSpots = emptySquare(newBoard);
	//condition of the index and player form the Check Win function
	if (checkWin(newBoard, player)){
		//starting score is -10
		return{score: -10};
	}else if(newBoard, ai){
		//ai moves, scores 10
		return{score: 10};
	}else if(availableSpots.length === 0){
		//if there is no spots left
		return{score: 0};
	}
	//init moves array
	var moves =[];
	
	//loops through available squares
	for(var i = 0; i < availableSpots.length; i++)
	{
		//init object called move
		var move = {};
// 		input avalable spots' index into the move object
		move.index = newBoard[availableSpots[i]];
		[availableSpots[i]] = player;
		//ai's turn, updates the score
		if (player == ai){
			var result = minimax(newBoard, human);
			move.score = result.score;
		}else {
			//human's turn, updates score
			var result = minimax(newBoard, ai);
			move.score = result.score;			
		}

		newBoard[availableSpots[i]] = move.index;

		move.push(move);
	}

	var bestMove;
	if(player == ai){
		//ai's best score is negative
		var bestScore = -300;
// 		loops through the move's length
		for(var i = 0; i < moves.length; i++){
			//select the moves score, and compares it to the best score.
			if(moves[i].score>bestScore){
				//score is more than best score
				//the best score would be the move's score itself
				bestScore = moves[i].score;
				//the best move would be on the cell of the index
				bestMove = i;
			}
		}
		}else{
			//if the player is human, it would strive for the max score
			//the bestscore would be 300
			var bestScore = 300;
			for(var i = 0; i < moves.length; i++){
				if(moves[i].score < bestScore){
					//if score is less than the best score
					//the best score would be the move's score itself
					bestScore = moves[i].score;
					//the best move would be the index of the score
					bestMove = i;
				}

			}
		}
	//it sould return the bestmove, which contains the cell's index
	return moves[bestMove];
	}
