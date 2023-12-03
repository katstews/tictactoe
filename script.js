var human = -1;
var computer = 1;

// =========== return who won, human -1, puter 1 =================================================
function eval(state) {
	var score = 0;

	if (checkState(state, computer)) {
		score = 1;
	}
	else if (checkState(state, human)) {
		score = -1;
	} else {
		score = 0;
	}

	return score;
}
// ======================================================================================

// ==== return if player won =============================================================
function checkState(state, player) {
	var winning_state = [ //all possible winning combinations
		[state[0][0], state[0][1], state[0][2]],
		[state[1][0], state[1][1], state[1][2]],
		[state[2][0], state[2][1], state[2][2]],
		[state[0][0], state[1][0], state[2][0]],
		[state[0][1], state[1][1], state[2][1]],
		[state[0][2], state[1][2], state[2][2]],
		[state[0][0], state[1][1], state[2][2]],
		[state[2][0], state[1][1], state[0][2]],
	];
	
	//iterate through winning_state (winning combos)
	for (var i = 0; i < 8; i++) {
		var line = winning_state[i];
		var filled = 0;
		//loop through index in winning array, see if a hit was done
		for (var j = 0; j < 3; j++) {
			if (line[j] == player)
				filled++;
		}
		//we have found 3 fufilling conditions in one of winning_state
		if (filled == 3)
			return true;
	}
	return false;
}
// =======================================================================================

// return if human or AI won =============================================================
function getWinner(state) {
	return checkState(state, human) || checkState(state, computer); //return true 1 or false -1
}
// =======================================================================================

// ==== return the coordinates of empty cells in a 3x3 grid ==================
function clearCells(state) {
	var cells = [];
	for (var x = 0; x < 3; x++) {
		for (var y = 0; y < 3; y++) {
			if (state[x][y] == 0)
				cells.push([x, y]);
		}
	}

	return cells;
}
// =====================================================================================

var board = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0],
];

// == is cell empty, make a move (check if valid move or not) ==========================
function validMove(x, y) {
	try {
        return board[x][y] === 0;
    } catch (error) {
        return false;
    }
}
// ====================================================================================

// ============= move on the board if the coordinates are valid =====================
function setMove(x, y, player) {
	if (validMove(x, y)) {
		board[x][y] = player;
		return true;
	}
	else {
		return false;
	}
}
// ===================================================================================

// ======================  official MINIMAX function (how ai should move) ==================================
function minimax(state, depth, player) {
	var best; //best move to make for ai
	
	//intialize w extreme val
	if (player == computer) {
		best = [-1, -1, -1000];
	}
	else {
		best = [-1, -1, +1000];
	}
	
	//base case 
	if (depth == 0 || getWinner(state)) {
		var score = eval(state);
		return [-1, -1, score];
	}
	
	//iterate over possible moves returned by clearCells 
	clearCells(state).forEach(function (cell) {
		var x = cell[0];
		var y = cell[1];

		//simulate current move
		state[x][y] = player;

		//calc score of next move
		var score = minimax(state, depth - 1, -player);
		
		//undoes move
		state[x][y] = 0;
		
		score[0] = x;
		score[1] = y;

		if (player == computer) {
			if (score[2] > best[2])
				best = score;
		}
		else {
			if (score[2] < best[2])
				best = score;
		}
	});

	return best;
}
// =======================================================================================

// ================== ai turn ==========================================
function aiTurn() {
	var x, y;
	var move;
	var cell;

	//if board is empty, pick a rando spot to start
	if (clearCells(board).length == 9) {
		x = parseInt(Math.random() * 3);
		y = parseInt(Math.random() * 3);
	}
	
	//use minmax to find best move
	else {
		move = minimax(board, clearCells(board).length, computer);
		x = move[0];
		y = move[1];
	}

	if (setMove(x, y, computer)) {
		cell = document.getElementById(String(x) + String(y));
		cell.innerHTML = "O";
	}
}
// ======================================================================================

// ===============  Restart the game (html calls) =======================================
function restartBnt(button) {
	if (button.value == "AI Player") {
		aiTurn();
		button.disabled = true;
	}
	else if (button.value == "Restart") {
		var htmlBoard;
		var msg;

		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				board[x][y] = 0;
				htmlBoard = document.getElementById(String(x) + String(y));
				htmlBoard.style.color = "grey";
				htmlBoard.innerHTML = "";
			}
		}
		button.value = "AI Player";
		msg = document.getElementById("message");
		msg.innerHTML = "";
	}
}
// =======================================================================================

// ================== MAIN ===============================================================
function clickedCell(cell) { // main calls this
	var button = document.getElementById("bnt-restart");
	button.disabled = true;
	var conditionToContinue = getWinner(board) == false && clearCells(board).length > 0;

	if (conditionToContinue == true) {
		var x = cell.id.split("")[0];
		var y = cell.id.split("")[1];
		var move = setMove(x, y, human);
		if (move == true) {
			cell.innerHTML = "X";
			if (conditionToContinue)
				aiTurn();
		}
	}
	if (checkState(board, computer)) { //if computer won
		var lines;
		var cell;
		var msg;

		//find winning line
		if (board[0][0] == 1 && board[0][1] == 1 && board[0][2] == 1)
			lines = [[0, 0], [0, 1], [0, 2]];
		else if (board[1][0] == 1 && board[1][1] == 1 && board[1][2] == 1)
			lines = [[1, 0], [1, 1], [1, 2]];
		else if (board[2][0] == 1 && board[2][1] == 1 && board[2][2] == 1)
			lines = [[2, 0], [2, 1], [2, 2]];
		else if (board[0][0] == 1 && board[1][0] == 1 && board[2][0] == 1)
			lines = [[0, 0], [1, 0], [2, 0]];
		else if (board[0][1] == 1 && board[1][1] == 1 && board[2][1] == 1)
			lines = [[0, 1], [1, 1], [2, 1]];
		else if (board[0][2] == 1 && board[1][2] == 1 && board[2][2] == 1)
			lines = [[0, 2], [1, 2], [2, 2]];
		else if (board[0][0] == 1 && board[1][1] == 1 && board[2][2] == 1)
			lines = [[0, 0], [1, 1], [2, 2]];
		else if (board[2][0] == 1 && board[1][1] == 1 && board[0][2] == 1)
			lines = [[2, 0], [1, 1], [0, 2]];

		//change red it
		for (var i = 0; i < lines.length; i++) {
			cell = document.getElementById(String(lines[i][0]) + String(lines[i][1]));
			cell.style.color = "red";
		}

		msg = document.getElementById("message");
		msg.innerHTML = "You lose!"; //LOSER
	}
	if (clearCells(board).length == 0 && !getWinner(board)) {
		var msg = document.getElementById("message");
		msg.innerHTML = "Draw!";
	}
	if (getWinner(board) == true || clearCells(board).length == 0) {
		button.value = "Restart";
		button.disabled = false;
	}
}
// =========================================================================================