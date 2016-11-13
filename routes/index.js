var express = require('express');
var passport = require('passport');
var router = express.Router();
var server = require("http").Server(router);
var io = require("socket.io")(server);

//Models
var User = require('../models/user');
var Game = require("../models/game").game;
var Player = require("../models/player").player;
var Round = require("../models/round").round;
var Card = require("../models/card").card;
var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");

var util = require('util'); //Esta librería la uso para mostrar algunas cosas
//con nsc obtengo la sesion del jugador conectado, nsc = nombre de sesion corriente

/* GET home page. */
router.get('/', function (req, res){
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
        passport.authenticate('local')(req, res, function () {
        res.redirect('/');
        });
    });
});

/* GET login page. */
router.get('/login', function(req, res) {
    //var nsc = req.session.passport.user;
    //console.log(nsc);
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

/* GET host page. */
router.get('/host',function(req,res){
    res.render('host', { });
});


/* POST host page. */
router.post('/host', function(req,res){    
  var p1 = new Player (req.session.passport.user);
  var g = new Game ({name : req.body.GameName, player1 : p1});

  g.save(function (err, game){
    if(err){
      console.log(err);
    }  
    console.log(game._id);
    res.redirect('/espera?gameid=' + game._id);
  });
});

/* GET lobby page */
router.get('/lobby', function(req,res){
    Game.find(function(err,game){
    //for (var i = game.length - 1; i >= 0; i--) 
      //console.log(game[i]["name"]);
      //console.log(game.length);
    if (err)
      console.log(err);
    else
      res.render('lobby', {g : game});
  });  
});

/* POST lobby page */
router.post('/lobby/:id', function(req,res){
  Game.findOne({_id: req.params.id},function(err,game){
    if (err)
      console.log(err);
    var p2 = new Player (req.session.passport.user);
    game.player2 = p2;
    game.currentHand = p2;
    game.save(function(err,game){
      console.log(game.player2.name);
      res.redirect ('/espera?gameid=' + req.params.id);
    });
  });
});

/* GET espera page */
router.get('/espera', function(req,res){
  Game.findOne({_id:req.query.gameid},function(err,game){
    res.render('espera',{g : game});          
  });
});  

/* POST espera page */
router.post('/espera', function(req,res){
  Game.findOne({_id:req.body.gameid},function(err,game){
    if (req.body.accion == 'Actualizar')
      if (req.session.passport.user == game.player1.name){
        if (game.player2 == undefined)
          res.redirect('/espera?gameid=' + game._id);   
        else
        {
          game.newRound();
          game.save(function(err,game){
            res.redirect('/play?gameid=' + game._id); 
          });
        }
      }else
        res.redirect('/play?gameid=' + game._id);
  });
});  


/* GET play page. */
router.get('/play',function(req,res){
  console.log('VENIMOS BIEN !');
  var g = Game.findOne({_id:req.query.gameid},function(err,game){
    if (err)
        console.log(err);  
    var currentRound = game.currentRound;
    var r = game.currentRound;
    r.__proto__ = Round.prototype;    
    r.fsm = r.newTrucoFSM(r.fsm.current);
	res.render('play', {g : game});	        
    ////console.log(util.inspect(game, {showHidden: false, depth: 12}));
	
  });
}); 



/* POST play page. */
router.post('/play', function(req,res){
	////console.log("Hola, estoy dentro del post de play");
	Game.findOne({_id:req.body.gameid},function(err,game){
		console.log('ACA ESTOY');
		io.on('connection', function(socket){
			console.log('Esta conectado el socket');
  			socket.on('jugada', function(data){	
    				location.reload();
  			});
		});        	
		var currentRound = game.currentRound;
    		var r = game.currentRound;
    		r.__proto__ = Round.prototype;    
    		r.fsm = r.newTrucoFSM(r.fsm.current);
		if ((game.score[0] >= 6) || (game.score[1] >= 6))
			res.redirect('/exit?gameid=' + game._id);		 		
		else{
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
				if (req.body.accion == 'Re-Truco'){
					game.play(r.currentTurn,'retruco');
				}
				if (req.body.accion == 'Vale-4'){
					game.play(r.currentTurn,'vale4');	
				}	
				if (req.body.accion == 'Reviro-Envido'){
					game.play(r.currentTurn,'envido-envido');
				}
				if (req.body.accion == 'Real-Envido'){
					game.play(r.currentTurn,'realenvido');	
				}	
				if (req.body.accion == 'Falta-Envido'){
					game.play(r.currentTurn,'faltaenvido');
				}
			}
			else{			
				if (req.body.accion == 'Jugar carta 1'){
      					game.play(r.currentTurn,'playcard',r.currentTurn.cards[0]);	
    				}
    				if (req.body.accion == 'Jugar carta 2'){
      					game.play(r.currentTurn,'playcard',r.currentTurn.cards[1]);   
    				}
    				if (req.body.accion == 'Jugar carta 3'){
      					game.play(r.currentTurn,'playcard',r.currentTurn.cards[2]);   
    				}
				console.log(game.currentRound.player1.cards);
    				console.log(game.currentRound.player2.cards);
				if (game.currentRound.hayGanador(r.fsm.current,game) == true){
					game.score[0] += game.currentRound.score[0];					
					game.score[1] += game.currentRound.score[1];
					if ((game.score[0] >= 6) || (game.score[1] >= 6))
						Game.update({ _id: game._id }, { $set :{score : game.score, currentRound:r}},function (err,resultado){	 
				        	//console.log(game.score);   			
							res.redirect ('/exit?gameid=' + game._id);
        					});		 		
			      		else
						Game.update({ _id: game._id }, { $set :{score : game.score, currentRound:r}},function (err,resultado){	 
							res.redirect ('/finRonda?gameid=' + game._id);
        					});
				}else							
					Game.update({ _id: game._id }, { $set :{score : game.score ,currentRound:r}},function (err,resultado){    
						res.redirect('/play?gameid=' + game._id);
					});                	
			}			
		}		//done();
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
