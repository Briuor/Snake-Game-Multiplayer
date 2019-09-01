var express = require('express');
var socket = require('socket.io');

var PORT = 4000;

var app = express();
var server = app.listen(PORT, function() {
	console.log('server listening port: ' + PORT);
});
app.use(express.static('public'));

// create socket
var io = socket(server);

// snakes online
var snakes = [];

var food = null;

// remove snake method
function removeSnake(socketId) {
	for(let i = 0; i < snakes.length; i++) {
		if(snakes[i].id == socketId) {
			snakes.splice(i, 1);
			break;
		}
	}
}

io.on('connection', function(socket){
	console.log("entered: " + socket.id);

	// when a new snake enter the game, send to him the snakes already playing
	socket.on('getsnakes', function() {
		socket.emit('getsnakes', snakes);
	});

	// when a new snake join game
	socket.on('newsnake', function(data) {
		// emit to other snake the new snake 
		data.id = socket.id;
		snakes.push(data);
		socket.broadcast.emit('newsnake', data);
	});

	// when snake walk
	socket.on('moved', function(data) {
		// emit to other snakes the snake movementation
		socket.broadcast.emit('moved', data);
	});

	// when a snake eat a food generate a new food
	socket.on('newfood', function(data) {
		food = data;
		console.log('newfood', food);
		socket.broadcast.emit('newfood', data);
	});

	socket.on('getfood', function() {
		console.log('getfood', food);
		socket.emit('newfood', food);
	});

	socket.on('disconnect', function() {
		removeSnake(socket.id);
		socket.broadcast.emit('removesnake', socket.id);
		console.log('removed from server: ' + socket.id);
	});

});