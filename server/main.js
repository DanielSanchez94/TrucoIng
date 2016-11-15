<<<<<<< HEAD
var express = require("express");
=======
	var express = require("express");
>>>>>>> branchforwebsocket
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3000, function(){
	console.log("servidor corriendo en localhost 3000");
<<<<<<< HEAD
});
=======
});
>>>>>>> branchforwebsocket
