/* CONFIG */
var SSLPORT = 443; //Default 443
var HTTPPORT = 80; //Default 80 (Only used to redirect to SSL port)
var privateKeyPath = "./cert/key.pem"; //Default "./cert/key.pem"
var certificatePath = "./cert/cert.pem"; //Default "./cert/cert.pem"

/* END CONFIG */

var fs = require('fs');
var express = require('express');
var https = require('https');
var app = express();

app.use(express.static(__dirname + '/webcontent'));

var privateKey = fs.readFileSync( privateKeyPath );
var certificate = fs.readFileSync( certificatePath );

var server = https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(SSLPORT);

var io  = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Redirect from http to https
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + ":"+ SSLPORT + "" + req.url });
    res.end();
}).listen(HTTPPORT);

console.log("Webserver & Socketserver running on port: "+SSLPORT+ " and "+ HTTPPORT);

// Room management
var rooms = {}; // { roomName: { users: [socketId1, socketId2, ...], created: timestamp } }

// Helper function to get room users count
function getRoomUsersCount(roomName) {
	return rooms[roomName] ? rooms[roomName].users.length : 0;
}

// Helper function to get all rooms info
function getRoomsInfo() {
	var roomsInfo = {};
	for (var roomName in rooms) {
		roomsInfo[roomName] = {
			users: rooms[roomName].users.length,
			created: rooms[roomName].created
		};
	}
	return roomsInfo;
}

//Handle connections
io.sockets.on('connection', function (socket) {
	console.log("New user connected:", socket.id);
	socket.currentRoom = null; // Track current room

	// Send list of available rooms on connection
	socket.emit('rooms-list', getRoomsInfo());

	// Handle room join
	socket.on('join-room', function (roomName) {
		// Leave current room if in one
		if (socket.currentRoom) {
			socket.leave(socket.currentRoom);
			if (rooms[socket.currentRoom]) {
				var index = rooms[socket.currentRoom].users.indexOf(socket.id);
				if (index > -1) {
					rooms[socket.currentRoom].users.splice(index, 1);
				}
				// Delete room if empty
				if (rooms[socket.currentRoom].users.length === 0) {
					delete rooms[socket.currentRoom];
					console.log("Room deleted:", socket.currentRoom);
				}
			}
			// Notify others in old room
			io.to(socket.currentRoom).emit('user-left', {
				userId: socket.id,
				room: socket.currentRoom,
				usersCount: getRoomUsersCount(socket.currentRoom)
			});
		}

		// Create room if it doesn't exist
		if (!rooms[roomName]) {
			rooms[roomName] = {
				users: [],
				created: Date.now()
			};
			console.log("Room created:", roomName);
		}

		// Join the room
		socket.join(roomName);
		socket.currentRoom = roomName;
		rooms[roomName].users.push(socket.id);

		console.log("User", socket.id, "joined room:", roomName);

		// Notify user of successful join
		socket.emit('room-joined', {
			room: roomName,
			usersCount: rooms[roomName].users.length
		});

		// Notify others in the room
		socket.to(roomName).emit('user-joined', {
			userId: socket.id,
			room: roomName,
			usersCount: rooms[roomName].users.length
		});

		// Send updated rooms list to all clients
		io.emit('rooms-list', getRoomsInfo());
	});

	// Handle leaving room
	socket.on('leave-room', function () {
		if (socket.currentRoom) {
			var roomName = socket.currentRoom;
			socket.leave(roomName);

			if (rooms[roomName]) {
				var index = rooms[roomName].users.indexOf(socket.id);
				if (index > -1) {
					rooms[roomName].users.splice(index, 1);
				}
				// Delete room if empty
				if (rooms[roomName].users.length === 0) {
					delete rooms[roomName];
					console.log("Room deleted:", roomName);
				}
			}

			// Notify others in room
			io.to(roomName).emit('user-left', {
				userId: socket.id,
				room: roomName,
				usersCount: getRoomUsersCount(roomName)
			});

			socket.currentRoom = null;
			socket.emit('room-left');

			// Send updated rooms list to all clients
			io.emit('rooms-list', getRoomsInfo());
		}
	});

	socket.on('disconnect', function () {
		console.log("User disconnected:", socket.id);

		// Remove from room if in one
		if (socket.currentRoom) {
			var roomName = socket.currentRoom;
			if (rooms[roomName]) {
				var index = rooms[roomName].users.indexOf(socket.id);
				if (index > -1) {
					rooms[roomName].users.splice(index, 1);
				}
				// Delete room if empty
				if (rooms[roomName].users.length === 0) {
					delete rooms[roomName];
					console.log("Room deleted:", roomName);
				}
			}
			// Notify others in room
			io.to(roomName).emit('user-left', {
				userId: socket.id,
				room: roomName,
				usersCount: getRoomUsersCount(roomName)
			});
		}

		// Send updated rooms list to all clients
		io.emit('rooms-list', getRoomsInfo());
	});

	// Handle audio data - only send to users in the same room
	socket.on('d', function (data) {
		if (socket.currentRoom) {
			data["sid"] = socket.id;
			// Send only to users in the same room
			socket.to(socket.currentRoom).emit('d', data);
		}
	});
});