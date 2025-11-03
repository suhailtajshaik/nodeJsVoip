/**
 * VOIP Configuration
 * Adjust these settings to balance quality vs bandwidth
 */

var VoipConfig = {
    // Audio Quality Settings
    audio: {
        // Sample rate for transmission (8000, 12000, 16000, 24000, 32000, 48000)
        // Higher = better quality but more bandwidth
        // Recommended: 16000 for good quality, 48000 for best quality
        sampleRate: 16000, // default was 12000

        // Bit depth (8, 16, 32)
        // 16-bit is recommended for good quality
        bitRate: 16,

        // Minimum gain threshold (0-1)
        // Audio below this level won't be transmitted (reduces bandwidth)
        minGain: 0.03, // 3%

        // Chunk size for processing
        chunkSize: 1024
    },

    // Network Settings
    network: {
        // Reconnection configuration
        reconnection: true,
        reconnectionAttempts: Infinity,  // Infinite attempts
        reconnectionDelay: 1000,         // Start at 1 second
        reconnectionDelayMax: 5000,      // Max 5 seconds between attempts
        timeout: 20000,                  // Connection timeout (20 seconds)

        // Show connection status in UI
        showConnectionStatus: true
    },

    // Audio Processing
    processing: {
        // Low-pass filter frequency (Hz)
        // Cuts off frequencies above this value
        lowPassFrequency: 3000,

        // Dynamic compression settings
        compression: {
            threshold: -25,
            knee: 9,
            ratio: 8,
            reduction: -20,
            attack: 0.0,
            release: 0.25
        }
    },

    // UI Settings
    ui: {
        // Show audio visualization
        showVisualization: true,

        // Update rate for visualization (ms)
        visualizationUpdateRate: 16 // ~60fps
    }
};
