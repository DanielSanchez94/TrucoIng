var express = require('express');
var passport = require('passport');
var router = express.Router();

//Models
var User = require('../models/user');
var Game = require("../models/game").game;
var Player = require("../models/player").player;
var Round = require("../models/round").round;
var Card = require("../models/card").card;
var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");

var util = require('util'); //Esta librería la uso para mostrar algunas cosas


/* GET home page. */
router.get('/', function (req, res) {
  var game = new Game();
  res.render('index', { user : req.user });
});

/* GET register page.*/
router.get('/register', function(req, res) {
    res.render('register', { });
});

/* POST register page */
router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            return res.render('register', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

/* GET login page. */
router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

/* POST login page. */
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

/* GET logout page. */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/* GET newgame page. */
router.get('/newgame',function(req,res){
    res.render('newgame');
});


/* POST newgame page. */
router.post('/newgame', function(req,res){
  var p1 = new Player (req.body.Player1);
  var p2 = new Player (req.body.Player2);
  //p1.save();
  //p2.save();
  var g = new Game ({name : req.body.GameName, player1 : p1 , player2 : p2, currentHand: p1});
  g.newRound();
  g.save(function (err, game){
    if(err){
      //console.log(err);
    }  
    /*Game.findOne({name:game.name},function(err,result){ 
        //console.log(result); 
      });
      //console.log(p1.name);
      //console.log(p2.name); */
    ////console.log(game._id);
    res.redirect('/play?gameid=' + game._id);
  });
});

/* GET play page. */
router.get('/play',function(req,res){
  var g = Game.findOne({_id:req.query.gameid},function(err,game){
    //r = game.currentRound;
    //r.__proto__ = Round.prototype;
    ////console.log('HOLA ESTOY PROBANDO LA MAQUINA DE ESTADOS');
    ////console.log(game.currentRound.fsm.cannot('truco'));
  	////console.log("Nombre: " + game.currentRound.player1.name);
  	////console.log(game.currentRound.player1.cards);
  	////console.log("Puntos del envido: " + game.currentRound.player1.envidoPoints);
    if (err)
        console.log(err);
    var currentRound = game.currentRound;
    var r = game.currentRound;
    r.__proto__ = Round.prototype;    
    r.fsm = r.newTrucoFSM(r.fsm.current);
    //console.log(r.fsm);
	res.render('play', {g : game});	        
    ////console.log(util.inspect(game, {showHidden: false, depth: 12}));
	
  });
}); 


/* POST play page. */
router.post('/play', function(req,res){
	////console.log("Hola, estoy dentro del post de play");
	Game.findOne({_id:req.body.gameid},function(err,game){
        	var currentRound = game.currentRound;
    		var r = game.currentRound;
    		r.__proto__ = Round.prototype;    
    		r.fsm = r.newTrucoFSM(r.fsm.current);
    	//console.log(r.fsm.transitions());

        //console.log(r.fsm);
        //game.currentRound.fsm = game.currentRound.newTrucoFSM();
		if(err){
		    //console.log("Aca tenemos el error de recursividad.");
      		//console.log(err);
        	}
        //Game.hydrate(game.currentRound); 
        //console.log(r.fsm);
		//console.log(r);
		//console.log(r.currentTurn);
		//console.log('Mostrando los puntos del jueoOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO: ');
		console.log(game.score);
			if ((game.score[0] >= 6) || (game.score[1] >= 6)){
				res.redirect('/exit?gameid=' + game._id);		 		
			}
			else{
			////console.log('Estoy dentro del juego');
      			////console.log(game.currentRound.fsm.cannot('truco'));
				////console.log(req.body.accion);
				//console.log(game.currentRound.fsm.current);
				if (req.body.accion !== 'Jugar carta 1' && req.body.accion !== 'Jugar carta 2' && req.body.accion !== 'Jugar carta 3'){
					if (req.body.accion == 'Truco'){
						game.play(r.currentTurn,'truco');
					}
					if (req.body.accion == 'Envido'){
						game.play(r.currentTurn,'envido');
					}

					if (req.body.accion == 'Quiero'){
						game.play(r.currentTurn,'quiero');
					}
					if (req.body.accion == 'No-quiero'){
						game.play(r.currentTurn,'no-quiero');	
					}		
				}
				else{
						////console.log(r.currentTurn.name);
						////console.log(req.body.accion);    				
					if (req.body.accion == 'Jugar carta 1'){
					    //console.log('ESTOY JUGANDO CARTA 1');
						
      						game.play(r.currentTurn,'playcard',r.currentTurn.cards[0]);	
						//console.log('Estos son los current turn despues de play: ');
						//console.log(r.currentTurn);
						//console.log(r.player1);
						//console.log(r.player2);
						
    					}
    					if (req.body.accion == 'Jugar carta 2'){
      						game.play(r.currentTurn,'playcard',r.currentTurn.cards[1]);   
    					}
    					if (req.body.accion == 'Jugar carta 3'){
      						game.play(r.currentTurn,'playcard',r.currentTurn.cards[2]);   
    					}
				}
				
  				if (game.currentRound.hayGanador(r.fsm.current,game) == true){
					game.score[0] += game.currentRound.score[0];					
					game.score[1] += game.currentRound.score[1];
					if ((game.score[0] >= 6) || (game.score[1] >= 6))
						Game.update({ _id: game._id }, { $set :{score : game.score, currentRound:r}},function (err,resultado){	 
				        	//console.log(game.score);   			
						res.redirect ('/exit?gameid=' + game._id);
        					});		 		
					//console.log('Asignando valores al gameEEEEEEEEEEEEEEEEEEEEEEE:');
     					//console.log(game.score);
            				else{
						Game.update({ _id: game._id }, { $set :{score : game.score, currentRound:r}},function (err,resultado){	 
				        	//console.log(game.score);   			
						res.redirect ('/finRonda?gameid=' + game._id);
        					});
					}
				}else{							
					Game.update({ _id: game._id }, { $set :{score : game.score ,currentRound:r}},function (err,resultado){    
						//console.log('NOMBRE DEL JUGADOR: ');	
						//console.log(r.currentTurn.name);                	
						res.redirect('/play?gameid=' + game._id);
                	});
				}			
		}		//done();
        //console.log('ESTOY VIENDO ACA: '+ game.currentRound.fsm.current);
  });
}); 


router.get('/finRonda',function(req,res){
	var g = Game.findOne({_id:req.query.gameid},function(err,game){
    	if (err)
     	   console.log(err);
    	var currentRound = game.currentRound;
    	var r = game.currentRound;
    	r.__proto__ = Round.prototype;    
    	r.fsm = r.newTrucoFSM(r.fsm.current);
		res.render('finRonda', {g : game});
	});
});

router.post('/finRonda', function(req,res){
	var g = Game.findOne({_id:req.body.gameid},function(err,game){
    	if (err)
			console.log(err);
		game.newRound();		
		var currentRound = game.currentRound;
    	var r = game.currentRound;
    	r.__proto__ = Round.prototype;    
    	r.fsm = r.newTrucoFSM(r.fsm.current);
		
		Game.update({ _id: game._id }, { $set :{score : game.score, currentRound:r}},function (err,res){
			if (err)
				console.log(err);		
		});  
		res.redirect('/play?gameid=' + game._id); 
	});
	
});

//GET resultadogame
router.get('/exit', function(req,res){
    var g = Game.findOne({_id:req.query.gameid},function(err,game){
        if (err){
            console.log(err);
        }
        res.render('exit',{g:game});
    });
});

//POST resultadogame
router.post('/exit', function(req,res){
        res.redirect('/'); //lo llevo de nuevo al inicio
});  





module.exports = router;
