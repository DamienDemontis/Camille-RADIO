import { setupP5Canvas } from './visualizer.js';
import { initializeParticles, initializeFloatingHearts, createSparkle, setupBabyHover, setupEasterEgg } from './effects.js';
import { initializeCountdown } from './countdown.js';
import { setupAudioControls } from './audio-controls.js';

window.isPlaying = false;
window.audioReady = false;
window.sound = null;
window.fft = null;
window.amplitude = null;
window.audioElement = null;

window.startExperience = function() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createSparkle();
        }, i * 100);
    }
    const babyContainer = document.querySelector('.baby-container');
    if (babyContainer) {
        babyContainer.style.animation = 'breathe 1s ease-in-out 3';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeFloatingHearts();
    initializeCountdown();
    setupAudioControls();
    setupBabyHover();
    setupEasterEgg();
    setupP5Canvas();
}); 