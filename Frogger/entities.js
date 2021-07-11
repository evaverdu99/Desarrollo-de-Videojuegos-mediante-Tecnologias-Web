///////////////////////////////////////
//Clase que maneja los Sprites.
///////////////////////////////////////
var Sprite = function() { }

Sprite.prototype.setup = function(sprite,props) {
	this.sprite = sprite;
	this.merge(props);
	this.frame = this.frame || 0;
	this.w = SpriteSheet.map[sprite].w;
	this.h = SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function(props) {
	if(props) {
		for (var prop in props) {
			this[prop] = props[prop];
		}
	}
}

Sprite.prototype.hit = function() {
	this.board.remove(this);
}

Sprite.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
}


var OBJECT_PLAYER = 1,
	OBJECT_TRANSPORT = 2, //Troncos y tortugas
	OBJECT_ENEMY = 4, //Coches y agua
	OBJECT_HOME = 8, //Parte de arriba para ganar
	OBJECT_POWERUP = 16; 

///////////////////////////////////////
//Fondo del juego.
///////////////////////////////////////

var Background = function(){
	//Creamos el fondo y lo colocamos.
	this.setup('background',{frame: 0});
	this.x = 0;
	this.y = 0;
}

Background.prototype = new Sprite();
Background.prototype.step = function(dt) {}

///////////////////////////////////////
//Rana del juego.
///////////////////////////////////////

var Frog = function(){
	this.setup('frog',{ vx: 0, vy: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });
	this.x = Game.width/2 - this.w / 2;
	this.y = Game.height - this.h;
	this.reload = this.reloadTime;
	this.delaytime = -1;

	this.dx = 0;
	this.dy = 0;
	this.row = 1;
	this.col = 0;

	this.vt = 0;

	this.move = 'none'; //Para colocar bien la animacion de la muerte de la rana

	this.safe = false; // Para controlar cuando la rana está en un tronco.
}

Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;

Frog.prototype.step = function(dt) {

	//Movimiento por el jugador de la rana
	if(this.delaytime < 0){
		if(Game.keys['left']) 		{ this.vx = -this.maxVel; this.delaytime = 0.3; this.dx = this.x - this.w; this.move='none';}
		else if(Game.keys['right']) { this.vx =  this.maxVel; this.delaytime = 0.3; this.dx = this.x + this.w; this.move='none';}
		else if(Game.keys['up'])	{ this.vy = -this.maxVel; this.delaytime = 0.3; this.row++; this.dy = Game.height - this.h * this.row; this.move='up';}
		else if(Game.keys['down'])	{ this.vy =  this.maxVel; this.delaytime = 0.3; this.row--;  this.dy = Game.height - this.h * this.row; this.move='none';}
		else { this.vx = 0; this.vy = 0; this.move='none';}
	}
	else{
		this.delaytime -= dt;
	}

	this.x += this.vx * dt ;
	if ( ((this.vx < 0) && (this.x < this.dx)) || ((this.vx > 0) && (this.x > this.dx)) ){
		this.x = this.dx;
	}

	this.y += this.vy * dt;
	
	if ((this.vy < 0) && (this.y < this.dy)){
		this.y = this.dy;
	}
	if((this.vy > 0) && (this.y > this.dy)){
		this.y = this.dy;
	}

	if(this.x < 0) { this.x = 0; }
	else if(this.x > Game.width - this.w) {
		this.x = Game.width - this.w
	}

	if(this.y < 0) { this.y = 0; }
	else if(this.y > Game.height - this.h) {
		this.y = Game.height - this.h
	}
	this.safe = false;
	
}

Frog.prototype.hit = function() {
	if(!this.safe){
		if(this.board.remove(this)) {
			if(this.move == 'up'){
				this.board.add(new Dead(this.x + this.w/2, this.y - this.h + this.h/2));
			}
			else{
				this.board.add(new Dead(this.x + this.w/2, this.y + this.h/2));
			}
		loseGame();
		}
	}
		
}

Frog.prototype.onTrunk = function(vt, dt) {  
	this.x += vt * dt;
	this.safe = true;
}


///////////////////////////////////////
//Clase que maneja los coches.
///////////////////////////////////////

var Car = function(blueprint,override) {
	this.merge(this.baseParameters);
	this.setup(blueprint.sprite,blueprint);
	this.merge(override);
}

Car.prototype = new Sprite();
Car.prototype.type =  OBJECT_ENEMY;
Car.prototype.baseParameters = { V: 0, t: 0 };									

Car.prototype.step = function(dt) {
	this.t += dt;
	this.vx = this.V;
	this.x += this.vx * dt;

	var collision = this.board.collide(this,OBJECT_PLAYER);
	if(collision) {
		collision.hit();
	}

	if( this.x < -this.w ||
		this.x > Game.width) {
			this.board.remove(this);
	}
}

Car.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx,this.sprite,this.x,this.y);
}

///////////////////////////////////////
//Clase que maneja los troncos.
///////////////////////////////////////

var Trunk = function(blueprint,override) {
	this.merge(this.baseParameters);
	this.setup(blueprint.sprite,blueprint);
	this.merge(override);
}

Trunk.prototype = new Sprite();
Trunk.prototype.type =  OBJECT_TRANSPORT;
Trunk.prototype.baseParameters = { V: 0, t: 0 };

Trunk.prototype.step = function(dt) {
	this.t += dt;
	this.vx = this.V;
	this.x += this.vx * dt;

	var collision = this.board.collide(this,OBJECT_PLAYER);
	if(collision) {
		collision.onTrunk(this.vx , dt);
	}

	if( this.x < -this.w ||
		this.x > Game.width) {
			this.board.remove(this);
	}
}

Trunk.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx,this.sprite,this.x,this.y);
}

///////////////////////////////////////
//Clase que maneja las tortugas.
///////////////////////////////////////
var Turtle = function(blueprint,override) {
	this.merge(this.baseParameters);
	this.setup(blueprint.sprite,blueprint);
	this.merge(override);
}

Turtle.prototype = new Sprite();
Turtle.prototype.type =  OBJECT_TRANSPORT;
Turtle.prototype.baseParameters = { V: 0, t: 0 };

Turtle.prototype.step = function(dt) {
	this.t += dt;
	this.vx = this.V;
	this.x += this.vx * dt;

	var collision = this.board.collide(this,OBJECT_PLAYER);
	if(collision) {
		collision.onTrunk(this.vx, dt);
	}

	if( this.x < -this.w ||
		this.x > Game.width) {
			this.board.remove(this);
	}
}

Turtle.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx,this.sprite,this.x,this.y);
}

///////////////////////////////////////
//Clase que maneja la porción de agua.
///////////////////////////////////////
var Water = function() {
	this.setup('water',{frame: 0});
	this.x = 0;
	this.y = 49;
}

Water.prototype = new Sprite();
Water.prototype.type =  OBJECT_ENEMY;

Water.prototype.step = function(dt) {
	
	var collision = this.board.collide(this,OBJECT_PLAYER);
	if(collision) {
		collision.hit();
	}
	
}

Water.prototype.draw = function(ctx) {}

///////////////////////////////////////
//Clase que maneja la zona de llegada de la rana.
///////////////////////////////////////
var Home = function() {
	this.setup('home',{frame: 0});
	this.x = 0;
	this.y = 0;
}

Home.prototype = new Sprite();
Home.prototype.type =  OBJECT_HOME;

Home.prototype.step = function(dt) {
	
	var collision = this.board.collide(this,OBJECT_PLAYER);
	
	if(collision) {
		this.board.remove(this);
		winGame();
	}
	
}
Home.prototype.draw = function(ctx) {}

///////////////////////////////////////
//Animación de la muerte de la rana.
///////////////////////////////////////

var Dead = function(centerX,centerY) {
	this.setup('dead', { frame: 0 });
	this.x = centerX - this.w/2;
	this.y = centerY - this.h/2;
	this.subFrame = 0;
};

Dead.prototype = new Sprite();

Dead.prototype.step = function(dt) {
	this.frame = Math.floor(this.subFrame++ / 10);
	if(this.subFrame >= 36) {
		this.board.remove(this);
	}
};