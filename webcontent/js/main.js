document.addEventListener('DOMContentLoaded', function () {
	// Display current configuration
	document.getElementById("sampleRate").textContent = VoipConfig.audio.sampleRate;
	document.getElementById("bitRate").textContent = VoipConfig.audio.bitRate;
	document.getElementById("chunkSize").textContent = VoipConfig.audio.chunkSize;

	// Room management UI
	var currentRoom = null;
	var roomNameInput = document.getElementById("roomName");
	var joinRoomBtn = document.getElementById("joinRoomBtn");
	var leaveRoomBtn = document.getElementById("leaveRoomBtn");
	var currentRoomInfo = document.getElementById("currentRoomInfo");
	var currentRoomName = document.getElementById("currentRoomName");
	var roomUsersCount = document.getElementById("roomUsersCount");
	var roomsList = document.getElementById("roomsList");
	var statusMessage = document.getElementById("statusMessage");

	// Join room button handler
	joinRoomBtn.addEventListener('click', function () {
		var roomName = roomNameInput.value.trim();
		if (roomName) {
			joinRoom(roomName);
		} else {
			alert('Please enter a room name');
		}
	});

	// Leave room button handler
	leaveRoomBtn.addEventListener('click', function () {
		leaveRoom();
	});

	// Allow pressing Enter to join room
	roomNameInput.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			joinRoomBtn.click();
		}
	});

	// Room event handlers from voip.js
	window.onRoomJoined = function (data) {
		currentRoom = data.room;
		currentRoomName.textContent = data.room;
		roomUsersCount.textContent = data.usersCount;
		currentRoomInfo.style.display = 'block';
		joinRoomBtn.style.display = 'none';
		leaveRoomBtn.style.display = 'inline-block';
		roomNameInput.disabled = true;
		statusMessage.textContent = '';
		console.log('Joined room:', data.room);
	};

	window.onRoomLeft = function () {
		currentRoom = null;
		currentRoomInfo.style.display = 'none';
		joinRoomBtn.style.display = 'inline-block';
		leaveRoomBtn.style.display = 'none';
		roomNameInput.disabled = false;
		statusMessage.textContent = '';
		console.log('Left room');
	};

	window.onUserJoined = function (data) {
		roomUsersCount.textContent = data.usersCount;
		console.log('User joined room:', data.userId);
	};

	window.onUserLeft = function (data) {
		roomUsersCount.textContent = data.usersCount;
		console.log('User left room:', data.userId);
	};

	window.onRoomsList = function (rooms) {
		if (Object.keys(rooms).length === 0) {
			roomsList.innerHTML = 'No active rooms';
		} else {
			var html = '<ul style="margin: 5px 0; padding-left: 20px;">';
			for (var roomName in rooms) {
				html += '<li><strong>' + roomName + '</strong> (' + rooms[roomName].users + ' users)</li>';
			}
			html += '</ul>';
			roomsList.innerHTML = html;
		}
	};

	var startBtn = document.getElementById("startBtn");
	startBtn.addEventListener('click', function () {
		if (!currentRoom) {
			statusMessage.textContent = '⚠️ Please join a room first!';
			return;
		}
		startBtn.style.display = 'none';
		startTalking();
	});

	var micaudio = document.getElementById("micaudio");
	var micctx = micaudio.getContext("2d");
	micctx.fillStyle = "#FF0000";

	var incaudio = document.getElementById("incaudio");
	var incctx = incaudio.getContext("2d");
	incctx.fillStyle = "#FF0000";

	onMicRawAudio = function (audioData, soundcardSampleRate) { //Data right after mic input
		micctx.clearRect(0, 0, micaudio.width, micaudio.height);
		for (var i = 0; i < audioData.length; i++) {
			micctx.fillRect(i, audioData[i] * 100 + 100, 1, 1);
		}
		return audioData;
	}

	onUserDecompressedAudio = function (audioData, userId, sampleRate, bitRate) { //Called when user audiodata coming from the client
		incctx.clearRect(0, 0, incaudio.width, incaudio.height);
		for (var i = 0; i < audioData.length; i++) {
			incctx.fillRect(i, audioData[i] * 100 + 100, 1, 1);
		}
		return audioData;
	}
});