/* Define the model game. */
var _ = require('lodash');
var playerModel = require('./player');
var deckModel = require('./deck');
var cardModel = require('./card');
var roundModel = require('./round');

var Player = playerModel.player;
var Round  = roundModel.round;

/** MONGOOSE **/
var mongoose = require('mongoose');
var db= mongoose.createConnection('mongodb://localhost/Game');

db.on('error', console.error.bind(console, 'conection error'));
db.once('open', function(){
	console.log('¡WE ARE CONNECTED!');
});

//var ObjectId = mongoose.Schema.Types.ObjectId; 

/*Definimos el esquema de nuestro juego*/
var GameSchema = mongoose.Schema({
	name: String,
	player1: Object, //Uso el jugador completo ahora, ya no uso el id.
	player2: Object,
	//rounds: {type: Array, default : [] },
	currentHand: Object, //String, //jugador
	currentRound: {type: Object, ref : 'Ronda'},
  score: {type: Array, default : [0,0]},
});



/*
  * Create and return a new Round to this game
  */
var Game = mongoose.model('Game', GameSchema);

Game.prototype.newRound = function(){
   var round = new Round(this, this.currentHand);
   this.currentRound = round;
   //this.rounds.push(round);
   return round;
 }

 /*
  * Check if it's valid move and play in the current round
  */
 Game.prototype.play = function(player, action, value){
   //console.log(player);
   //console.log(action);
   //console.log(value);
  
   if(this.currentRound.currentTurn !== player)
     throw new Error("[ERROR] INVALID TURN...");
   //console.log(this.currentRound.fsm.current);
   
   //console.log(this.currentRound.fsm.current);
   if(this.currentRound.fsm.cannot(action))
     throw new Error("[ERROR] INVALID MOVE...");
   
   
   return this.currentRound.play(player, action, value);
 };

//returns the oposite player
Game.prototype.switchPlayer = function(){
	////console.log(game.currentHand == game.player1);
	////console.log(this.currentHand);
	////console.log(this.player1);
	if (this.currentHand == this.player1)
		return this.currentHand = this.player2;
	else
		return this.currentHand = this.player1;
};
 
//Nos indica quien gana la confrontacion de puntos 


module.exports.game = Game;

//facu probando jaja esto ssimularia la resolucion de la historia que copie el id,
