var expect = require("chai").expect;
var playerModel = require("../models/player");
var gameModel   = require("../models/game");
var cardModel   = require("../models/card");

var Game = gameModel.game;
var Player = playerModel.player;
var Card = cardModel.card;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Game_test');

describe('Game', function(done){
	it('#save El juego de tu vida con jugador Juan.', function(done){
		var g = new Game({name: 'El juego de tu vida'});
		g.save(function(err, game){
      console.log("Saved game El juego de tu vida.");
      //console.log(game.toString());
      if (err) { 
        console.log(err);
				done(err);
      }

      var p = new Player('Juan');

      /*p.save(function(err, player){
      	console.log("Saving player Juan.");
				if (err) { 
					console.log(err);
					done(err);
      	}
        //console.log(player.name);
      }); */
      done();
		});
	});   

  it('#save Tutatuta y jugador Diana.', function(done){
		var p = new Player('Diana');
		
	  /*p.save(function(err, player){
      console.log("Saved player Diana.");
      if (err) { 
        console.log(err);
				done(err);
      } */
			//console.log(player.name);

      var g = new Game({name: "tutatuta", player1: p});

      g.save(function(err, game){
         console.log("saving game tutatuta");
         //console.log(game.toString());
      });
 
      done();
		});
	}); 


	it('#recovering El juego de tu vida.', function(done){
    Game.findOne({name: "El juego de tu vida"}).exec(function(err, game){ 
        console.log("Recovering ref");
				if (err) { 
        	console.log(err);
					done(err);
      	}
       // console.log(game.toString());
        done();
    });
  });  

	it('should have two players', function(done){

    var cardsjug1 = [new Card(2,'oro'), new Card(7,'oro'),new Card(3,'basto')];
    var cardsjug2 = [new Card(5,'basto'), new Card(1,'espada'), new Card(3,'espada')];
		var jug1 = new Player('Juan');
		jug1.setCards(cardsjug1);
		var jug2 = new Player('Diana');
		jug2.setCards(cardsjug2);
    /*var jug1 = new Player({name: "Juan", password:"3876", cards: cardsjug1, envidoPoints: 29});
    var jug2 = new Player({name: "Diana", password:"1234", cards: cardsjug2, envidoPoints: 24});
    
    jug1.save(function (err,player1){
      if(err){
        console.log(err);
        done(err)
      }

      jug2.save(function (err,player2){
        if(err){
          console.log(err);
          done(err)
        } */
        var data = {
          name : 'Truco argentino',
          player1: jug1,
          player2: jug2,
          rounds : [],
          currentHand: jug2,
          currentRound : undefined,
          score : [0,0]
        };

        var g = new Game(data);

        g.save(function (err, game) {
          if(err){
            console.log(err);
            done(err)
          }
					done();
        });
 });
					//recuperamos el jugador 2 - Diana
          /*Game.findOne({player2:player2._id},function(err,result){
            if (err) {
              console.log(err);
              done(err);
            }
            Player.findOne({_id:player2._id} , function(err, result2){ 
              expect(result2.name).to.be.eq('Diana');
							//console.log(result2.name);
              done();

            }); 
          }); */
      



// ----------------------------------------- TEST ANTERIOR ----------------------------------------------
/*describe('Game', function(){
	var game = new Game();
	it('Should have two players', function(){
		expect(game).to.have.property('player1');
		expect(game).to.have.property('player2');
	});
});

describe('Game#play', function(){
	var game;
	beforeEach(function(){
		game = new Game();
		game.newRound();
		// Force to have the following cards and envidoPoints
		game.player1.setCards([
			new Card(1, 'copa'),
			new Card(7, 'oro'),
			new Card(2, 'oro')
		]);

		game.player2.setCards([
 			new Card(1, 'copa'),
			new Card(7, 'copa'),
			new Card(2, 'basto')
		]);
	});
	
	it('plays [envido, no-quiero] should gives 1 points to player 1', function(){
		game.play('player1', 'envido');
		game.play('player2', 'no-quiero');
		expect(game.score).to.deep.equal([1, 0]);
	});

	//el jugador uno canta truco
	it('plays [truco, no-quiero] should gives 1 points to player1', function(){
		game.play('player1', 'truco');
		game.play('player2', 'no-quiero');
		expect(game.score).to.deep.equal([1,0]); 
	}); 

	//el jugador uno juega una carta y el jugador dos canta truco
	it('plays [truco, no-quiero] should gives 1 points to player2', function(){
		game.play('player1', 'playcard', game.player1.cards[0]);		
		game.play('player2', 'truco');
		game.play('player1', 'no-quiero');
		expect(game.score).to.deep.equal([0,1]); 
	}); 
}); */
