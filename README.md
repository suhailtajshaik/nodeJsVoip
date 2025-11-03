# nodeJsVoip
An simple nodeJs Websocket VOIP application without the use of WebRTC and extra Servers like TURN or STUN. No client proxy!

> Note: this is just an experiment. Pls use WebRTC if you want to create a professional VOIP application!

# How to install the Server (manually)
1. Install npm and node
2. Clone or download this repo and go to the "nodeJsVoip" folder
3. install node deps -> run: `npm install`
4. start the Server -> run: `node server.js`
5. connect to https://myserverip (with 2 tabs or browsers to hear yourself)

## Supported (tested) browsers
* Chrome
* Firefox
* Edge

# How to install the Server with docker
You have 2 options for using this app with docker
## Use the container from Dockerhub
`docker run -d --name=nodejsvoip -p 80:80 -p 443:443 rofl256/nodejsvoip`

Now connect to https://myserverip

## Build your own image
`sudo docker build -t nodejsvoip .`
now run the container from the image you have just created. (use the command from above and change the image name)

# Audio Quality Configuration

You can now customize audio quality settings by editing `webcontent/js/config.js`. This allows you to balance between audio quality and bandwidth usage.

## Quality Presets

**Low Bandwidth (Default)**
- Sample Rate: 16000 Hz (upgraded from 12000 Hz)
- Bit Depth: 16-bit
- Best for: Limited bandwidth connections

**High Quality**
- Sample Rate: 48000 Hz
- Bit Depth: 16-bit
- Best for: Local networks or high-speed connections

**Customizable Settings:**
- Sample rate (8000, 12000, 16000, 24000, 32000, 48000 Hz)
- Bit depth (8, 16, 32-bit)
- Audio processing (lowpass filter, dynamic compression)
- Minimum gain threshold

Edit `webcontent/js/config.js` to adjust these settings and reload the page.

# Room/Channel Support

The application now supports multiple conversation rooms! Users can create or join specific rooms to have private conversations.

## How to Use Rooms

1. **Join a Room**: Enter a room name (e.g., "lobby", "team-chat") and click "Join Room"
2. **Start Talking**: Once in a room, click "Start Talking" to begin voice communication
3. **Room Privacy**: You can only hear users in the same room as you
4. **Leave Room**: Click "Leave Room" to exit the current room
5. **View Active Rooms**: See all active rooms and their user counts in real-time

## Room Features

- **Auto-Create**: Rooms are automatically created when the first user joins
- **Auto-Delete**: Empty rooms are automatically deleted when the last user leaves
- **Real-time Updates**: See live updates of users joining/leaving rooms
- **Multi-Room Support**: Host unlimited simultaneous rooms
- **User Isolation**: Audio is only transmitted to users in the same room

## Use Cases

- **Team Meetings**: Different teams can have separate voice channels
- **Gaming**: Create rooms for different game sessions
- **Study Groups**: Students can create dedicated study rooms
- **Social Hangouts**: Friends can create private chat rooms

# Roadmap
* ✅ Improved sound quality with configurable audio settings
* ✅ Room/channel support for multi-room conversations
* Add Opus codec support (foundation laid with @geut/opus library)
* Add voice activity detection (VAD)
* Implement echo cancellation

# Audiopipeline Details

![alt tag](https://raw.githubusercontent.com/cracker0dks/nodeJsVoip/master/doc/audioPipeline.png)
