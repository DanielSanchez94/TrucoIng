var expect = require("chai").expect;
var roundModel = require("../models/round.js");
var gameModel = require("../models/game.js");
var playerModel = require("../models/player.js");
var cardModel = require("../models/card.js");

var Round = roundModel.round;
var Game = gameModel.game;
var Player = playerModel.player;
var Card = cardModel.card;

describe('Round',function(){
  var cartasjug1 = [new Card(3,'basto'),new Card(7,'basto'),new Card(3,'copa')];
  var cartasjug2 = [new Card(6,'copa'),new Card(5,'copa'),new Card(7,'basto')];
  var j1 = new Player({name: "Juan", password:"1995", cards: cartasjug1 , pointsEnv: 30});
  var j2 = new Player({name: "Diana", password:"1993", cards: cartasjug2 , pointsEnv: 31});
	//definimos el nuevo juego con los jugadores anteriores
  var g = new Game({name:'El juego de tu vida', player1: j1, player2: j2, currentHand: j2, currentRound: undefined, score: [0,0]});
	//guardamos
  g.save(function (err, game) {
    if(err){
      console.log(err);
      done(err)
    }
		//creamos una ronda
    g.newRound();
    it('player1 should have 3 cards', function(){
     expect(g.player1.cards).to.have.lengthOf(3);
    });
  
    it('player2 should have 3 cards', function(){
      expect(g.player2.cards).to.have.lengthOf(3);
    });
  });
}); //end describe




//------------------------------------------------------- TEST ANTERIORES ---------------------
/*describe('Round', function(){
	var game;
	beforeEach(function(){
		game = new Game();
		game.newRound();
	});
	
	describe("#deal", function(){
		it("should populate player1 cards", function(){
			var round = new Round(game);
			round.deal();
			expect(game.player1.cards.length).to.be.equal(3);
		});
 		it("should populate player2 cards", function(){
			var round = new Round(game);
			round.deal();
			expect(game.player2.cards.length).to.be.equal(3);
		});
	});

	describe("#tirarCarta", function(){
		var game = new Game();
		game.player1.setCards([
			new Card(1, 'copa'),
			new Card(7, 'oro'),
			new Card(6, 'oro')
		]);
		it("mostrar carta eliminada", function(){
			var round = new Round(game);
			var aux = game.player1.cards[1];
			round.guardarCarta(round.game.player1,aux);
			round.tirarCarta(round.game.player1 , aux);
			var carta2 = game.player1.cards[0];
			round.guardarCarta(round.game.player1, carta2);
			round.tirarCarta(round.game.player1 , carta2);
			//console.log(round.game.player1);
		});
	});


	describe("#tirar todas las cartas", function(){
		var game = new Game();
		game.player1.setCards([
			new Card(2, 'copa'),
			new Card(7, 'oro'),
			new Card(6, 'oro')
		])
		it("tirar todas las cartas", function(){
			var round = new Round(game);
			var carta1 = game.player1.cards[1];
			round.guardarCarta(round.game.player1, carta1);
			round.tirarCarta(round.game.player1 , carta1);
			var carta2 = game.player1.cards[2];
			round.guardarCarta(round.game.player1, carta2);
			round.tirarCarta(round.game.player1 , carta2);
			var carta3 = game.player1.cards[0];
			round.guardarCarta(round.game.player1, carta3);
			round.tirarCarta(round.game.player1 , carta3); 
			expect(round.tiroTodas(round.game.player1)).to.be.eq(true);
			console.log(round.game.player1);
		});
	}); 

}); 

describe('Round -- Controlamos funciones nuevas', function(){
	var game;
	beforeEach(function(){
		game = new Game();
		game.newRound();

		// Force to have the following cards and envidoPoints
		game.player1.setCards([
			new Card(6, 'oro'),
			new Card(7, 'basto'),
			new Card(1, 'oro')
		]);
		game.player2.setCards([
 			new Card(6, 'copa'),
			new Card(7, 'copa'),
			new Card(1, 'basto')
		]);
	});

	it('play a card', function(){
		//console.log(game.currentRound.fsm.current);
		//game.currentRound.fsm.current = 'init';
		//game.play(game.currentRound.game.player1, 'envido');
		//console.log(game.currentRound.changeTurn());
		//console.log(game.currentRound.currentTurn);
		//console.log(game.currentRound.arregloManos);
		//console.log(game.currentRound.game.score);
		//console.log(game.currentRound.game.player1.cartasJugadas);
		//console.log(game.currentRound.game.player2.cartasJugadas);
		game.play(game.currentRound.game.player1, 'playcard',game.currentRound.game.player1.cards[1]);	
		console.log(game.currentRound.game.player1);
		
		//console.log('mostrar cartas jugadas, jugador 2: ',game.currentRound.game.player2.cartasJugadas);
		//console.log(game.currentRound.fsm.current);
		//console.log(game.currentRound.currentTurn);
		//console.log(game.currentRound.game.player1);
		game.play(game.currentRound.game.player2, 'truco');
		//console.log(game.currentRound.game.player2.cartasJugadas);	
		//console.log(game.currentRound.game.player2);
		//console.log(game.currentRound.arregloManos);
		game.play(game.currentRound.game.player1, 'quiero');
		game.play(game.currentRound.game.player2, 'playcard',game.currentRound.game.player2.cards[1]);
		//console.log(game.currentRound.game.player1.cartasJugadas);
		//console.log(game.currentRound.game.player2.cartasJugadas);

		//console.log(game.currentRound.hayGanador());
		game.play(game.currentRound.game.player1, 'playcard',game.currentRound.game.player1.cards[2]);
		game.play(game.currentRound.game.player2, 'playcard',game.currentRound.game.player2.cards[2]);
		//console.log(game.currentRound.game.player1);
		//console.log(game.currentRound.game.player2);	
		console.log(game.currentRound.arregloManos);	
		console.log(game.currentRound.hayGanador());
		console.log(game.currentRound.game.score);	
		});
	});
}); */


