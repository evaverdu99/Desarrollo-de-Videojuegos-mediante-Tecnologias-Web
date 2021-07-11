var sprites = {
		title:{sx: 0, sy: 392, w:278, h:171, frames: 1 },
		background: { sx: 421, sy: 0, w: 550, h: 625, frames: 1 },
		water: { sx: 421, sy: 49, w: 550, h: 240, frames: 1 },
		home: { sx: 421, sy: 0, w: 550, h: 49, frames: 1 },
		frog: {sx:120, sy:340, w:40, h:48, frames:1},
		turtle: { sx: 5, sy: 285, w: 51, h: 48, frames: 4 },
		dead: { sx: 210, sy: 128, w: 48, h: 35, frames: 3 },
		car_1: { sx: 4, sy: 6, w: 99, h: 48, frames: 1 },
		car_2: { sx: 106, sy: 6, w: 99, h: 48, frames: 1 },
		car_3: { sx: 210, sy: 6, w: 99, h: 48, frames: 1  },
		s_log: { sx: 268, sy: 169, w: 140, h: 48, frames: 1 },
		m_log: { sx: 5, sy: 119, w: 197, h: 48, frames: 1 },
		b_log: { sx: 5, sy: 169, w: 260, h: 48, frames: 1 },
		small_truck: { sx: 5, sy: 62, w: 128, h: 48, frames: 1 },
		big_truck: { sx:146 , sy: 62, w: 206, h: 48, frames: 1 }		
};

var cars = {
	car1: 		{ x: -99,  y: 337, sprite: 'car_1',       V: 100 },
	car2: 		{ x: -99,  y: 385, sprite: 'car_2',		  V: 150 },
	car3: 		{ x: -99,  y: 433, sprite: 'car_3',       V: 200 },
	smalltruck: { x: -128, y: 481, sprite: 'small_truck', V: 150 },
	bigtruck: 	{ x: 550,  y: 529, sprite: 'big_truck',   V: -100 },
};

var trunks = {
	trunk_s:{ x: -140, y: 49,  sprite: 's_log', V: 100 },
	trunk_m:{ x: -197, y: 145, sprite: 'm_log', V: 150 },
	trunk_b:{ x: -260, y: 241, sprite: 'b_log', V: 100 },
}

var turtles = {
	turtle:{ x: -51, y: 0, sprite: 'turtle', V: 100 },
}

var level_1 = [
	[ 0, 2000, 'turtle', { y: 193}],
	[ 0, 2500, 'turtle', { y: 97 , V: 125}],
	[ 0, 3000, 'trunk_s' ],
	[ 0, 3000, 'trunk_m', { y: 145 }],
	[ 0, 3000, 'trunk_m', { y: 241 , V:100} ],
	[ 0, 3000, 'car1' ],
	[ 0, 4000, 'car2' ],
	[ 0, 3000, 'car3' ],
	[ 0, 5000, 'smalltruck' ],
	[ 0, 7000, 'bigtruck' ],
	
	
]

function startGame() { 
	var board_0 = new GameBoard();
	board_0.add(new Background());
	Game.setBoard(0,board_0);
	Game.setBoard(1,new TitleScreen("Start",
									"Press Enter to start playing",
									playGame));
}

var playGame = function() {
	Game.setBoard(2,new GameBoard());
	var board_1 = new GameBoard();
	board_1.add(new Spawners(level_1));
	board_1.add(new Water());
	board_1.add(new Home());
	board_1.add(new Frog());
	Game.setBoard(1,board_1);
};

var winGame = function() {
	Game.setBoard(2,new TitleScreen("You win!",
	"Press enter to play again",
	playGame));
};

var loseGame = function() {
	Game.setBoard(2,new TitleScreen("You lose!",
	"Press enter to play again",
	playGame));
};

window.addEventListener("load", function() {
	Game.initialize("game",sprites,startGame);
});
