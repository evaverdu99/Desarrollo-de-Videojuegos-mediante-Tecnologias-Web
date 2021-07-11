//Practica_1 -> Eva Verdú Rodríguez

MemoryGame = function(gs){
	this.cards = ["perico","mortadelo","fernandomartin","sabotaje","phantomas","poogaboo","sevilla","abadia",
				  "perico","mortadelo","fernandomartin","sabotaje","phantomas","poogaboo","sevilla","abadia"];
	this.maze = new Array();	//Mazo de cartas.
	this.numflip = 0;			//Numero de cartas dabas la vuelta.
	this.posnumflip = -1;		//Posición de la carta dada la vuelta (encaso de que la haya).
	this.stategame = 0; 		//Estado de juego: 0 -> start, 1-> intentalo de nuevo, 2-> pareja encontrada, 3-> juego finalizado
	this.foundcards = 0;		//Numero de parejas encontradas.
	this.wait=false;

	this.initGame = function(){ //Inicializa el juego creando las cartas, desordenándolas y comenzando el bucle de juego.

		shuffle(this.cards);
		
		for(i = 0; i < 16; i++){
			this.maze[i] = new MemoryGameCard(this.cards[i]);
		}

		this.loop();
	}

	this.draw = function(){	//Dibuja todas las cartas y printea un mensaje según el estado del juego.
		for(i = 0; i<16; i++){
			this.maze[i].draw(gs,i);
		}
		
		if(this.stategame == 0){
			gs.drawMessage("Juego Memoria Spectrum");
		}

		if(this.stategame == 1){
			gs.drawMessage("Intentalo de nuevo");
		}
		
		if(this.stategame == 2){
			gs.drawMessage("Pareja encontrada");
		}
		
		if(this.stategame == 3){
			gs.drawMessage("Has ganado");
		}
	}

	this.loop = function(){ //bucle de juego
		var that = this;
		setInterval(function(){that.draw();}, 16);
	}


	this.onClick = function(cardId){ // Este metodo se utiliza cada vez que se pulsa click
		if(this.wait) return;	//Si ya hay dos cartas boca arriba comparandose no haces nada.
		if(this.maze[cardId].state != 2){ //Si la carta seleccionada ya esta encontrada
			var card1 = this.maze[cardId]; 
			var card2 = this.maze[this.posnumflip];
			card1.flip();
			if(card1 != card2){ //Si la carta 1 es distinta a la carta 2
				if(this.numflip == 0){ 	//Si es la unica carta bocaarriba
				this.numflip++;			
				this.posnumflip = cardId;
				}
				else if (this.numflip == 1){ //Si hay otra carta bocaarriba
					if(this.posnumflip != -1){ // Si la otra carta no da error de posicion
						if(card1.compareTo(card2) == true){
							card1.found();
							card2.found();
							this.foundcards++;
							if(this.foundcards < 8){ //Si no todas las parejas han sido encontradas.
								this.stategame = 2;
							}
							else{
								this.stategame = 3;
							}
						}
						else{
							this.stategame = 1;
							this.wait = true;
							var that = this;
							setTimeout(function(){card1.reflip(); card2.reflip(); that.wait = false;}, 700);
						}
						this.numflip = 0;
						this.posnumflip = -1;
					}
					else{
						console.log ("error");
					}
				}
			}
		}
	}

	function shuffle(cards){ 	//Este metodo se encarga de barajar las cartas.
  	cards = cards.sort(function() {return Math.random() - 0.5});
  	return cards;
	}

}

MemoryGameCard = function(sprite){
	
	this.sprite = sprite;	//Nombre de la carta
	this.state = 0;  		//Estado de la carta: 0->Bocabajo, 1->bocarriba, 2->Encontrada
	this.backcard = "back";	//Parte trasera de la carta


	this.flip = function(){ //Da la vuelta a la carta dejand a la vista el videojuego.
		if(this.state == 0){
			this.state = 1;
		}
	}

	this.reflip = function(){ //Da la vuelta a la carta dejando a la vista la parte trasera de la carta.
		if(this.state != 2){
			this.state = 0;
		}
		
	}
	
	this.found = function(){ //Marca la carta como encontrada
		this.state = 2;
	}

	this.compareTo = function(otherCard){ // Compara las dos cartas
		if(this.sprite == otherCard.sprite){
			return true;
		}
		else{
			return false;
		}
	}

	this.draw = function(gs, pos){  //Dibuja la carta de acuerdo al estado que se encuentra.
		if(this.state == 0){ //Bocabajo
			gs.draw(this.backcard, pos);
		}
		else if(this.state == 1){ //Bocarriba
			gs.draw(this.sprite, pos);
		}
		else{ //Encontrada
			gs.draw(this.sprite, pos);
		}
	}
}


