// audio-controls.js

export function setupAudioControls() {
    const startBtn = document.getElementById('startBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const overlay = document.getElementById('startOverlay');
    // Start button
    startBtn.addEventListener('click', function() {
        overlay.classList.add('hidden');
        if (window.audioReady && window.sound) {
            window.sound.play();
            window.isPlaying = true;
            updatePlayButton(true);
        } else {
            window.isPlaying = true;
            updatePlayButton(true);
        }
        window.startExperience && window.startExperience();
    });
    // Play/pause button
    playPauseBtn.addEventListener('click', function() {
        if (window.audioReady && window.sound) {
            if (window.isPlaying) {
                window.sound.pause();
                window.isPlaying = false;
            } else {
                window.sound.play();
                window.isPlaying = true;
            }
        } else {
            window.isPlaying = !window.isPlaying;
        }
        updatePlayButton(window.isPlaying);
    });
    // Setup audio events if using fallback HTML5 audio
    window.audioElement = document.getElementById('audioElement');
    window.audioElement.addEventListener('play', () => {
        if (!window.audioReady) {
            window.isPlaying = true;
            updatePlayButton(true);
        }
    });
    window.audioElement.addEventListener('pause', () => {
        if (!window.audioReady) {
            window.isPlaying = false;
            updatePlayButton(false);
        }
    });
}

export function updatePlayButton(playing) {
    const playBtn = document.getElementById('playPauseBtn');
    if (playing) {
        playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    } else {
        playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    }
} 