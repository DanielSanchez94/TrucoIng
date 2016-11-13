var _ = require('lodash');
var mongoose = require("mongoose");
var deckModel = require("./deck.js");
var gameModel = require("./game.js");
var cardModel = require("./card.js");
var playerModel = require("./player.js");
var Deck = deckModel.deck;
var Game = gameModel.game;
var Card = cardModel.card;
var Player = playerModel.player;

//StateMachine
var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");


Round.prototype.newTrucoFSM = function(estadoactual){
	var fsm = StateMachine.create({
	initial: estadoactual == undefined ? 'init' : estadoactual,
	events: [
		{ name: 'playcard', from: 'init',                           to: 'primer-carta' },
		{ name: 'envido',    from: ['init', 'primer-carta'],         to: 'envido' },
		{ name: 'envido-envido', form: 'envido',    to: 'envido-envido'},
		{ name: 'realenvido',  from: ['init', 'primer-carta','envido', 'envido-envido'],     to: 'realenvido'},
		{ name: 'faltaenvido',  from: ['init', 'primer-carta', 'envido', 'envido-envido', 'realenvido'], to: 'faltaenvido'},
		{ name: 'truco',     from: ['init', 'playcard','primer-carta', 'no-quiero', 'quiero'],          to: 'truco'  },
		{ name: 'retruco',   from: ['playcard', 'truco'], to:'retruco'},
		{ name: 'vale4', form: ['playcard', 'retruco'], to:'vale4' },
		{ name: 'playcard', from: ['quiero', 'no-quiero', 'playcard', 'primer-carta'],  to: 'playcard' },
		{ name: 'quiero',    from: ['envido', 'truco', 'retruco', 'vale4', 'envido-envido', 'realenvido','faltaenvido'], to: 'quiero'  },
		{ name: 'no-quiero', from: ['envido', 'truco', 'retruco', 'vale4', 'envido-envido', 'realenvido','faltaenvido'], to: 'no-quiero' },
	]
	});
	return fsm;
}

function Round(game, turn){
	//- ESTO HABRÍA QUE MEJORARLO PORQUE ENTRA EN BUCLE :( ---	
	this.player1 = new Player (game.player1.name);	
	this.player2 = new Player (game.player2.name);	
	this.vartruco = undefined;
	this.varretruco = undefined;
	this.varvale4 = undefined;
	this.fsm = this.newTrucoFSM();
	this.status = 'running';
	this.arregloManos = []; //Manos jugadas y ganadas por los jugadores 
	this.conCheqTurn = [false,false];
	this.score = [0, 0];
	this.prevstate=null;
	this.puntostruco=1;
	this.estadosPrevios = [];
	this.deal(); //Reparto Cartas
	this.currentTurn = this.switchPlayer(turn) ;
	this.pointenv = 0; 
}

/*
* Generate a new deck mixed and gives to players the correspondent cards
*/
Round.prototype.deal = function(){
	var deck = new Deck().mix();
	this.player1.setCards(_.pullAt(deck, 0, 2, 4));
	this.player2.setCards(_.pullAt(deck, 1, 3, 5));
};

/* Cambia el turno de los jugadores. DEBERÍAMOS VER CASOS MÁS CONCRETOS
+ if action is 'quiero' or 'no-quiero' and it's playing 'envido' the next
* player to play is who start to chant
*
* + if action is 'quiero' or 'no-quiero' and it's playing 'envido' the next
* player to play is who start to chant */
Round.prototype.changeTurn = function(){
	//return this.currentTurn = this.switchPlayer(this.currentTurn);	
	if (this.currentTurn.name == this.player1.name)
		this.currentTurn = this.player2;		
	else
		this.currentTurn = this.player1;
}

//Cambia el jugador corriente. 
Round.prototype.switchPlayer = function (player){
  if (player.name === this.player1.name){
  	player = this.player2;
  }
  else{
  	player = this.player1;
  }
  return player;
};

Round.prototype.puntosWin = function(){
	//gana el jugador 1
	if(this.player1.envidoPoints > this.player2.envidoPoints){
		return this.player1.name;
	}
	//gana el jugador 2
	if (this.player1.envidoPoints < this.player2.envidoPoints){
		return this.player2.name;
	}
	//en caso de haber empate, gana el que es mano
	if (this.player1.envidoPoints == this.player2.envidoPoints){
		if (this.currentHand.name == this.player1.name)
			return this.player1.name;
		else 
			return this.player2.name;
	}
}

//Inserto la carta en el arreglo de las cartas sobre la mesa(cartas jugadas)
Round.prototype.guardarCarta = function (player, card){	
	if (this.player1.name == player.name){
 		this.player1.cartasJugadas.push(card);
	}else
		this.player2.cartasJugadas.push(card);
}

//Toma un jugador y la carta, devuelve el arreglo de las cartas del jugador sin la carta que jugó
Round.prototype.tirarCarta = function (player,card){	
	if (this.player1.name == player.name){	
		console.log('------------------------'); 		
		console.log(this.player1.cards[0]);
		console.log(card);
		console.log(this.player1.cards[0] === card);
		console.log(this.player1.cards[0] == card);
		console.log('------------------------');
		if (this.player1.cards[0] != null){				
			if ((this.player1.cards[0].number == card.number) && (this.player1.cards[0].suit == card.suit)){
				this.player1.cards[0] = undefined;
				return player;
			}
		}
		if (this.player1.cards[1] != null){
			if ((this.player1.cards[1].number == card.number) && (this.player1.cards[1].suit == card.suit)){
				this.player1.cards[1] = undefined;
				return player;
			}
		}
		if (this.player1.cards[2] != null){
			if ((this.player1.cards[2].number == card.number) && (this.player1.cards[2].suit == card.suit)){
				this.player1.cards[2] = undefined;
				return player;
			}
		}
	}	
	if (this.player2.name == player.name){	
		if (this.player2.cards[0] != null){
			if ((this.player2.cards[0].number == card.number) && (this.player2.cards[0].suit == card.suit)){
				this.player2.cards[0] = undefined;
				return player;
			}
		}
		if (this.player2.cards[1] != null){
			if ((this.player2.cards[1].number == card.number) && (this.player2.cards[1].suit == card.suit)){
				this.player2.cards[1] = undefined;
				return player;
			}
		}
		if (this.player1.cards[2] != null){
			if ((this.player2.cards[2].number == card.number) && (this.player2.cards[2].suit == card.suit)){
				this.player2.cards[2] = undefined;
				return player;
			}
		}	
	}
}

//Nos indica si un jugador tiro todas las cartas.
Round.prototype.tiroTodas = function (player){
	aux = false;	
	if((player.cards[0] == undefined) && (player.cards[1] == undefined) && (player.cards[2] == undefined)){
		aux = true;
	}	
	return aux;
}

confront = function(card1,card2){
  if(card1.weight > card2.weight)
    return 1;
  else if(card1.weight == card2.weight)
    return 0;
  else if(card1.weight < card2.weight)
    return -1;
};

//Verifica que puede realizar una confrontacion y carga un arreglo con su respectivo ganador o empate
Round.prototype.confrontaciones = function (){	
	//Verifica ambos jugadores jugaron una carta
	if (((this.player1.cartasJugadas[0] !== undefined) && (this.player2.cartasJugadas[0] !== undefined)) && (this.arregloManos[0] == undefined))
		if ((confront(this.player1.cartasJugadas[0],this.player2.cartasJugadas[0])) == 1)
			return this.arregloManos.push(1);		
		else 
			if ((confront(this.player1.cartasJugadas[0],this.player2.cartasJugadas[0])) == -1) 		
				return this.arregloManos.push(2);
			else	
				return this.arregloManos.push(0);

	//Verifica ambos jugadores jugaron dos cartas 
	if (((this.player1.cartasJugadas[1] !== undefined) && (this.player2.cartasJugadas[1] !== undefined)) && (this.arregloManos[1] == undefined)) 	
		if ((confront(this.player1.cartasJugadas[1],this.player2.cartasJugadas[1])) == 1)
			return this.arregloManos.push(1);		
		else
			if ((confront(this.player1.cartasJugadas[1],this.player2.cartasJugadas[1])) == -1) 		
				return this.arregloManos.push(2);
			else
				return this.arregloManos.push(0);
	
	//Verifica ambos jugadores jugaron 3 cartas
	if (((this.player1.cartasJugadas[2] !== undefined) && (this.player2.cartasJugadas[2] !== undefined)) && (this.arregloManos[2] == undefined)) 	
		if ((confront(this.player1.cartasJugadas[2],this.player2.cartasJugadas[2])) == 1)
			return this.arregloManos.push(1);		
		else	
			if ((confront(this.player1.cartasJugadas[2],this.player2.cartasJugadas[2])) == -1)	
				return this.arregloManos.push(2);
			else
				return this.arregloManos.push(0);
}

//Verifica juega una carta y realiza un tratamiento en la ronda
Round.prototype.played = function (action, card){
	//Si el estado actual es 'playcard'
	if(action == 'playcard'){
		//Si el estado previo es 'init'
		if(this.prevstate == 'init')
			/*Si el jugador corriente es el jugador 1
			* guarda card en el arreglo de las cartas jugadas del jugador corriente
			* tira card de las cartas del jugador corriente
			*/
			if (this.currentTurn.name == this.player1.name){
				//console.log('REALIZANDO CAMBIOS PARA EL JUGADOR 1!!!!');
				this.guardarCarta(this.player1, card); 
				this.tirarCarta(this.player1, card); 
				return this.player1;
			//Si el jugador corriente es el jugador 2, realiza el mismo tratamiento
			}else{
				//console.log('REALIZANDO CAMBIOS PARA EL JUGADOR 2!!!!');
				this.guardarCarta(this.player2, card);
				this.tirarCarta(this.player2, card);				
				return this.player2;
			
		//Si el estado previo es 'quiero', 'no-quiero', 'playcard', 'primer carta'
		}else if((this.prevstate == 'quiero') || (this.prevstate == 'no-quiero') || (this.prevstate == 'playcard') || (this.prevstate == 'primer-carta')) 			
			//Si el jugador corriente es el jugador 1				
			if (this.currentTurn.name == this.player1.name){
				//Si el jugador corriente no tiro todas las cartas
				if (this.tiroTodas(this.player1) == false){
					/*guarda card en el arreglo de las cartas jugadas del jugador corriente
					* tira card de las cartas del jugador corriente
					*/
					this.guardarCarta(this.player1, card);
					this.tirarCarta(this.player1, card);
				//Devuelve un error ya que no hay mas cartas para jugar
				}else
					throw new Error("Se jugaron todas las cartas no puede volver a tirar.");
				return this.player1;
			//Si el jugador corriente es el jugador 2, realiza el mismo tratamiento
			}else{	
				if (this.tiroTodas(this.player2) == false){
					this.guardarCarta(this.player2, card);
					this.tirarCarta(this.player2, card);
				}else
					throw new Error("Se jugaron todas las cartas no puede volver a tirar.");
				return this.player2;
			}		
	}
}

//Compara caracter por caracter 2 arreglos segun su tamaño
function compAr(arreglo, arreglo0){
	var aux = false;
	if ((arreglo.length == 2) && (arreglo0.length == 2)){
		if ((arreglo[0] == arreglo0[0]) && (arreglo[1] == arreglo0[1])){
		//	//console.log("estoy dentro del compAr " + arreglo + " " + arreglo0 + " " + arreglo.length);
			aux = true;
		}	
	}
	if ((arreglo.length == 3) && (arreglo0.length == 3)){
		if ((arreglo[0] == arreglo0[0]) && (arreglo[1] == arreglo0[1]) && (arreglo[2] == arreglo0[2])){
			aux = true;
		}	
	}
	return aux;
}

//Devuelve un valor booleano: True=Hay ganador, False=No hay ganador
Round.prototype.hayGanador = function (action,game){
	var aux = false;
	//console.log(action);
	//console.log(this.prevstate);
	if ((action == 'no-quiero') && ((this.prevstate == 'truco') || (this.prevstate == 'retruco') || (this.prevstate == 'vale4'))){
	 	aux = true;
		if (this.currentTurn.name == this.player1.name)
			this.score[1] += this.puntostruco;
		else
			this.score[0] += this.puntostruco;		
	}

	if ((action == 'quiero') && (this.prevstate == 'faltaenvido'))
		aux = true;
	
	
	
	if (compAr(this.arregloManos,[0,0,0])){
 		aux = true;
		if (game.currentHand.name == this.player1.name)
			this.score[0] += this.puntostruco[0];
		else
			this.score[1] += this.puntostruco[0];
	}

	if (compAr(this.arregloManos,[1,2,0])){
		aux = true;
		this.score[0] += this.puntostruco;
	}

	if (compAr(this.arregloManos,[2,1,0])){
		aux = true;
		this.score[1] += this.puntostruco;	
	}
		
	if ((compAr(this.arregloManos,[0,1])) || (compAr(this.arregloManos,[1,0])) || (compAr(this.arregloManos,[0,0,1]))){
		aux = true;
		this.score[0] += this.puntostruco;	
	}

	if ((compAr(this.arregloManos,[0,2])) || (compAr(this.arregloManos,[2,1,0])) || (compAr(this.arregloManos,[2,0])) || (compAr(this.arregloManos,[0,0,2]))){
		aux = true;
		this.score[1] += this.puntostruco;
	}

	if ((compAr(this.arregloManos,[1,1])) || (compAr(this.arregloManos,[1,2,1])) || (compAr(this.arregloManos,[2,1,1]))){		
		aux = true;
		this.score[0] += this.puntostruco; 
	}

	if ((compAr(this.arregloManos,[2,2])) || (compAr(this.arregloManos,[2,1,2])) || (compAr(this.arregloManos,[1,2,2]))){
		aux = true;
		this.score[1] += this.puntostruco;

	}
	console.log(aux);
	////console.log("aca esta el aux" + " " +aux);
	return aux;
}

Round.prototype.calculateEnvido = function(action){
	if ((this.checkPrevStates('envido')) || (this.checkPrevStates('envido-envido')) || (this.checkPrevStates('realenvido')) || (this.checkPrevStates('faltaenvido'))){
		//console.log("entorooentroentrooo");
		if (this.prevstate == 'envido'){
			//Si el estado actual 'quiero'
			if (action == 'quiero')
				this.pointenv = 2
			//Si el estado actual 'no-quiero' 
			if (action == 'no-quiero')
				this.pointenv = 1;
		}	

		if (this.prevstate == 'envido-envido'){
			if (action == 'quiero')
				this.pointenv = 4;
			//Si el estado actual 'no-quiero' 
			if (action == 'no-quiero')
				this.pointenv = 2;
		}

		if (this.prevstate == 'realenvido')
			if (this.checkPrevStates('envido-envido')){
				if (action == 'quiero')
					this.pointenv = 7;
				if (action == 'no-quiero')
					this.pointenv = 4;	
			}else
				if (this.checkPrevStates('envido')){
					if (action == 'quiero') 
						this.pointenv = 5;	
					if (action == 'no-quiero') 
						this.pointenv = 2;	
				}else{
					if (action == 'quiero') 
						this.pointenv = 3;	
					if (action == 'no-quiero') 
						this.pointenv = 1;				
				}	

		if (this.prevstate == 'faltaenvido'){
			if ((this.checkPrevStates('envido-envido')) && (this.checkPrevStates('realenvido')))
				if (action == 'no-quiero'){	
					this.pointenv = 7;
				}	
			else
				if ((this.checkPrevStates('envido')) && (this.checkPrevStates('realenvido')))
					if (action == 'no-quiero')
						this.pointenv = 5;
				else
					if (this.checkPrevStates('envido-envido'))
						if (action == 'no-quiero')
							this.pointenv = 4;
					else
						if (this.checkPrevStates('envido'))
							if (action == 'no-quiero')
								this.pointenv = 2;
						else
							if (action == 'no-quiero')
								this.pointenv = 1;
			if (action == 'quiero'){
				this.pointenv = 6; //Dar opciones para jugar distinto tipo de truco (6,12,15)
			}
				
				//this.pointenv = this.puntosParaPartido(game);
		}

		
		if ((this.prevstate == 'envido') || (this.prevstate == 'envido-envido') || (this.prevstate == 'realenvido') || (this.prevstate == 'faltaenvido')){	
			if (action == 'quiero')
				if (this.puntosWin() == this.player1.name)
					this.score[0] += this.pointenv; 
				else
					this.score[1] += this.pointenv; 				
			else 
				if (action == 'no-quiero')
					if (this.currentTurn.name == this.player2.name)
						this.score[0] += this.pointenv; 
					else
						this.score[1] += this.pointenv;
		}
	}	
	return this.score;
}
Round.prototype.cantoTruco = function(action){
	if (action == 'truco')
		this.vartruco = this.currentTurn.name;
	if (action == 'retruco')
		this.varretruco = this.currentTurn.name;
	if (action == 'vale4')
		this.vale4 = this.currentTurn.name;
	return 0;
}

Round.prototype.calculateTruco = function(action){
	if ((action == 'quiero') && ((this.prevstate == 'truco') || (this.prevstate == 'retruco') || (this.prevstate == 'vale4'))){ 
		if ((this.vartruco != undefined)&&(this.varretruco == undefined)&&(this.vale4 == undefined))
			this.puntostruco = 2;
		if ((this.varretruco != undefined)&&(this.vale4 == undefined))
			this.puntostruco = 3;
		if (this.vale4 != undefined)
			this.puntostruco = 4;
	}	
}
/*Round.prototype.puntosParaPartido = function (game){
	if (this.puntosWin() == this.player1.name)
		if (game.score[0] > game.score[1])
			
		//this.score[0] += pointenv; 
	else{
		this.score[1] += pointenv; 
	}
	return 0;
}*/	

Round.prototype.checkPrevStates = function(action){
	var aux=false;
	i=0;
	while (i < this.estadosPrevios.length){
		if(action == this.estadosPrevios[i])
			aux=true;
		i++;
	}
    //console.log(aux);
	return aux;
	//preguntar que pasa si no le pongo var
	/*estados=[];
	for (i = 0; i < this.estadosPrevios.lenght; i++) {
    	estados.push(this.estadosPrevios[i]);
	}
	aux = false;
	do{
		if (estados.pop == action)
			aux = true;	
	}while ((estados = []) && (aux == false));	
	console.log(this.estadosPrevios)
	return aux;*/
}

Round.prototype.cambioTurno = function(){
	this.changeTurn();
	if ((this.player1.cartasJugadas[0]!= undefined) && (this.player2.cartasJugadas[0]!= undefined) && (this.conCheqTurn[0] == false)){
		this.conCheqTurn[0] = true;
		if (confront(this.player1.cartasJugadas[0],this.player2.cartasJugadas[0]) == 1)
			if (this.currentTurn.name == this.player2.name)
				this.changeTurn();
		if (confront(this.player1.cartasJugadas[0],this.player2.cartasJugadas[0]) == -1)
			if (this.currentTurn.name == this.player1.name)
				this.changeTurn();
	}		
	if ((this.player1.cartasJugadas[1]!= undefined)&&(this.player2.cartasJugadas[1]!= undefined) && (this.conCheqTurn[1] == false)){
		this.conCheqTurn[1] = true;
		if (confront(this.player1.cartasJugadas[1],this.player2.cartasJugadas[1]) == 1)
			if (this.currentTurn.name == this.player2.name)
				this.changeTurn();
		if (confront(this.player1.cartasJugadas[1],this.player2.cartasJugadas[1]) == -1)
			if (this.currentTurn.name == this.player1.name)
				this.changeTurn();
	}	
}
/*
* Let's Play :)
*/
Round.prototype.play = function(player, action, value) {

	
	this.prevstate=this.fsm.current;
	//console.log(this.prevstate,"aa");
	// move to the next state
	this.fsm[action](player, value);

	this.estadosPrevios.push(action);
	//console.log(this.estadosPrevios);
	//check if is needed play a card
	this.played(action,value);
	//this.played(action,value);

	// check if is needed sum score
	this.calculateEnvido(action);

	this.cantoTruco(action);

	this.calculateTruco(action);

	//check the confrontations
	this.confrontaciones();	
	//console.log(this.arregloManos);
	//check the status of hands
	/*if (this.hayGanador() == 1)
		return(this.player1);	
	if (this.hayGanador() == 2)
		return(this.player2); */

	
	// Change player's turn
	this.cambioTurno();
};

module.exports.round = Round;

//probando vinculo PiiiivotalTracker con Github
