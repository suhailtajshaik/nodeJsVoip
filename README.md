# nodeJsVoip
An simple nodeJs Websocket VOIP application without the use of WebRTC and extra Servers like TURN or STUN. No client proxy!

> Note: this is just an experiment. Pls use WebRTC if you want to create a professional VOIP application!

# Installation

## Quick Start with Docker Compose (Recommended)

1. Clone this repository
2. Copy `.env.example` to `.env` and customize settings (optional)
3. Run: `docker-compose up -d`
4. Connect to https://your-server-ip

## Manual Installation

1. Install Node.js (v20 or higher) and npm
2. Clone this repo and navigate to the "nodeJsVoip" folder
3. Copy `.env.example` to `.env` and configure (optional)
4. Install dependencies: `npm install`
5. Start the server: `npm start`
6. Connect to https://your-server-ip

## Docker Installation

### Option 1: Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Option 2: Using Docker CLI
```bash
docker run -d \
  --name=nodejsvoip \
  -p 80:80 \
  -p 443:443 \
  -v $(pwd)/cert:/opt/app/cert:ro \
  -e NODE_ENV=production \
  nodejsvoip
```

### Option 3: Build from source
```bash
docker build -t nodejsvoip .
docker run -d --name=nodejsvoip -p 80:80 -p 443:443 nodejsvoip
```

## Supported Browsers
* Chrome
* Firefox
* Edge

# Configuration Management

The application supports flexible configuration through environment variables, making it easy to deploy in different environments.

## Environment Variables

All server configuration can be controlled via environment variables. Create a `.env` file in the project root or set these variables in your deployment environment:

| Variable | Default | Description |
|----------|---------|-------------|
| `SSL_PORT` | 443 | HTTPS server port |
| `HTTP_PORT` | 80 | HTTP redirect port |
| `PRIVATE_KEY_PATH` | ./cert/key.pem | Path to SSL private key |
| `CERTIFICATE_PATH` | ./cert/cert.pem | Path to SSL certificate |
| `CORS_ORIGIN` | * | CORS allowed origins (use specific domain in production) |
| `PING_TIMEOUT` | 60000 | Socket.IO ping timeout (ms) |
| `PING_INTERVAL` | 25000 | Socket.IO ping interval (ms) |
| `NODE_ENV` | production | Node environment (development/production) |
| `DEBUG` | false | Enable debug logging |

## Configuration Methods

### Method 1: .env File (Local Development)
```bash
# Copy the example file
cp .env.example .env

# Edit the file with your settings
nano .env
```

### Method 2: Docker Compose (Production)
Edit the `docker-compose.yml` file or create a `.env` file in the same directory:
```env
SSL_PORT=443
HTTP_PORT=80
CORS_ORIGIN=https://yourdomain.com
NODE_ENV=production
```

### Method 3: Docker CLI
```bash
docker run -d \
  -e SSL_PORT=8443 \
  -e HTTP_PORT=8080 \
  -e CORS_ORIGIN=https://yourdomain.com \
  nodejsvoip
```

### Method 4: System Environment Variables
```bash
export SSL_PORT=443
export CORS_ORIGIN=https://yourdomain.com
npm start
```

## Docker Compose Configuration

The `docker-compose.yml` file provides an easy way to deploy with custom configuration:

```yaml
version: '3.8'
services:
  nodejsvoip:
    build: .
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
      - CORS_ORIGIN=https://yourdomain.com
    volumes:
      - ./cert:/opt/app/cert:ro
```

## Security Best Practices

1. **CORS Configuration**: In production, set `CORS_ORIGIN` to your specific domain instead of `*`
2. **SSL Certificates**: Use valid SSL certificates from a trusted CA (Let's Encrypt recommended)
3. **Firewall**: Restrict access to ports 80 and 443 only
4. **Environment Files**: Never commit `.env` files to version control (already in .gitignore)
5. **Non-Root User**: The Docker image runs as a non-root user for security

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

# Error Handling & Reliability

The application now includes comprehensive error handling and automatic recovery features:

## Server-Side Error Handling

- **SSL Certificate Validation**: Graceful handling of missing or invalid SSL certificates with helpful error messages
- **Port Conflict Detection**: Clear error messages if ports are already in use
- **Graceful Shutdown**: Proper cleanup of connections on server shutdown (Ctrl+C)
- **Error Logging**: Detailed logging of connection and socket errors
- **Exception Handling**: Catches uncaught exceptions and unhandled promise rejections

## Client-Side Error Handling

### Automatic Reconnection
- **Infinite Retry**: Automatically attempts to reconnect if connection is lost
- **Exponential Backoff**: Starts at 1 second, increases up to 5 seconds between attempts
- **Visual Feedback**: Connection status indicator shows current state (Connected, Disconnected, Reconnecting, etc.)

### Connection Status Indicator
- 🟢 **Connected**: Normal operation
- 🟡 **Disconnected**: Temporary disconnection
- 🟠 **Reconnecting**: Attempting to reconnect (shows attempt number)
- 🔴 **Error/Failed**: Connection error or failed to reconnect
- ⚫ **Server Shutdown**: Server is shutting down

### Microphone Error Handling
Provides specific error messages for common microphone issues:
- **Permission Denied**: Guides user to allow microphone access
- **No Microphone Found**: Prompts user to connect a microphone
- **Device Busy**: Notifies if microphone is used by another application
- **Browser Unsupported**: Suggests using a modern browser

### Configuration
All reconnection settings can be customized in `webcontent/js/config.js`:
```javascript
network: {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
}
```

# Roadmap
* ✅ Improved sound quality with configurable audio settings
* ✅ Room/channel support for multi-room conversations
* ✅ Better error handling with automatic reconnection
* ✅ Configuration management with environment variables and Docker Compose
* Add Opus codec support (foundation laid with @geut/opus library)
* Add voice activity detection (VAD)
* Implement echo cancellation

# Audiopipeline Details

![alt tag](https://raw.githubusercontent.com/cracker0dks/nodeJsVoip/master/doc/audioPipeline.png)
