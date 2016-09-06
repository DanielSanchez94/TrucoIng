/* Test */

var expect = require("chai").expect;
var playerModel = require("../models/player.js");
var cardModel = require("../models/card.js");
var gameModel = require("../models/game.js");

var Player = playerModel.player;
var Card = cardModel.card;
var Game = gameModel.game;

//VOLVEMOS A LOS TEST ANTERIORES PORQUE YA NO USAMOS PLAYER COMO UN SCHEMA

describe('#PLAYER Points', function() {		
		var player1 = new Player('Diana');
		var player2 = new Player('Juan');
		player1.setCards([new Card(1, 'copa'), new Card(7, 'oro'), new Card(6, 'oro')]);
		player2.setCards([new Card(12, 'copa'), new Card(10, 'copa'), new Card(3, 'oro')]);
		it('should points player1 return 33', function(){
      expect(player1.points()).to.be.eq(33);
    });

		it('should points player2 return 20', function(){
			expect(player2.points()).to.be.eq(20);
	 	});
	
			var player3 = new Player('Esteban');
			var player4 = new Player('Antonio');
			player3.setCards([new Card(1, 'copa'), new Card(7, 'oro'), new Card(2, 'basto')]);
			player4.setCards([new Card(11, 'copa'), new Card(11, 'basto'), new Card(11, 'oro')]);
	
		it('should points game2.player1 return 7', function(){
			expect(player3.points()).to.be.eq(7);
	 	});
		
		it('should points game2.player2 return 0', function(){
			expect(player4.points()).to.be.eq(0);
	 	}); 
});


/*describe('Player', function(){
	var player1 = new Player({name: 'Juan'});
	var player2 = new Player({name: 'Emma Watson'});

	it('Should have a name', function(){
		expect(player1).to.have.property('name');
		expect(player2).to.have.property('name');
	});

	it('should save Juan', function(done){
		var data={
			name: "Juan",
			password:"6899",
			cards: [new Card(1,'basto'),new Card(7,'basto'),new Card(3,'oro')],
			pointsEnv: 28
		}
		var p = new Player(data);
		p.save(function (err, player) {
			if(err){
				console.log(err);
				done(err);
			}
			Player.findOne({name:p.name},function(err,result){
				if (err) {
					console.log(err);
					done(err);
				}
				expect(result.name).to.be.eq('Juan');
				done();
			});
		});
	});

	it('Should recover info', function(done){
    Player.findOne({name: 'Juan'}).exec(function(err, player){
			if (err) {
					console.log(err);
					done(err);
			}
      //console.log("Encontre el jugador Juan");
      //console.log(player.name);
			done();
		});
	}); 
}); //end Describe Player

// Envido Points
describe ('Puntos del Envido', function(){
	it('31 puntos',function(){
		var aux = [new Card(6,'copa'), new Card(5,'copa'), new Card(12,'oro')];
		var p=new Player ({name:"Juan", password:"1995", cards: aux});
		expect(p.points()).to.be.equal(31);
	});

	it('30 puntos',function(){
		var cartas = [new Card(3,'oro'),new Card(7,'oro'),new Card(11,'basto')];
		var p=new Player ({name:"Juan", password:"1995", cards: cartas});
		expect(p.points()).to.be.equal(30);
	});

	it('28 puntos',function(){
		var cartas = [new Card(7,'espada'), new Card(1,'espada'), new Card(5,'basto')];
		var p=new Player ({name:"Juan", password:"1995", cards: cartas});
		expect(p.points()).to.be.equal(28);
	});

	it('27 puntos',function(){
		var cartas = [new Card(4,'oro'), new Card(3,'oro'), new Card(5,'basto')];
		var p=new Player ({name:"Juan", password:"1995", cards: cartas});
		expect(p.points()).to.be.equal(27);
	});

	it('20 puntos',function(){
		var cartas = [new Card(11,'basto'), new Card(10,'basto'), new Card(7,'espada')];
		var p=new Player ({name:"Juan", password:"1995", cards: cartas});
		expect(p.points()).to.be.equal(20);
	});

	it('7 puntos',function(){
		var cartas = [new Card(7,'espada'), new Card(12,'oro'), new Card(3,'copa')];
		var p=new Player ({name:"Juan", password:"1995", cards: cartas});
		expect(p.points()).to.be.equal(7);
	});

	it('0 puntos',function(){
		var cartas = [new Card(12,'basto'), new Card(11,'oro'), new Card(10,'espada')];
		var p=new Player ({name:"Juan", password:"1995", cards:cartas});
		expect(p.points()).to.be.equal(0);
	});
}); */

