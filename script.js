// Global variables
let wavesurfer = null;
let isPlaying = false;
let audioElement = null;
let isLocalFile = false;
let visualizationInterval = null;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're running locally
    isLocalFile = window.location.protocol === 'file:';
    
    initializeParticles();
    initializeFloatingHearts();
    initializeCountdown();
    initializeAudio();
    setupEventListeners();
});

// Particle animation system
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 2-8px
    const size = Math.random() * 6 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    
    container.appendChild(particle);
}

// Floating hearts animation
function initializeFloatingHearts() {
    setInterval(() => {
        createFloatingHeart();
    }, 3000);
}

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['💕', '💖', '💗', '💝', '👶'][Math.floor(Math.random() * 5)];
    
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
    
    document.body.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 10000);
}

// Countdown to June 2025 and age calculation after birth
function initializeCountdown() {
    const countdownElement = document.getElementById('countdown');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const targetDate = new Date('2025-06-01').getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            // Camille is born! Calculate her age
            const birthDate = new Date('2025-06-01');
            const currentDate = new Date();
            
            const ageInMs = currentDate - birthDate;
            const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
            const ageInMonths = Math.floor(ageInDays / 30.44); // Average days per month
            const ageInYears = Math.floor(ageInMonths / 12);
            
            if (ageInMonths < 36) {
                // Show age in months for first 3 years
                if (ageInMonths === 0) {
                    const ageInWeeks = Math.floor(ageInDays / 7);
                    countdownElement.innerHTML = `Camille a ${ageInWeeks} semaine${ageInWeeks > 1 ? 's' : ''} ! 🎉`;
                } else {
                    countdownElement.innerHTML = `Camille a ${ageInMonths} mois ! 🎉`;
                }
            } else {
                // Show age in years after 36 months
                const remainingMonths = ageInMonths % 12;
                if (remainingMonths === 0) {
                    countdownElement.innerHTML = `Camille a ${ageInYears} an${ageInYears > 1 ? 's' : ''} ! 🎉`;
                } else {
                    countdownElement.innerHTML = `Camille a ${ageInYears} an${ageInYears > 1 ? 's' : ''} et ${remainingMonths} mois ! 🎉`;
                }
            }
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `${days}j ${hours}h ${minutes}m ${seconds}s`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Audio initialization
function initializeAudio() {
    audioElement = document.getElementById('audioElement');
    
    // Check if audio file exists and can be loaded
    audioElement.addEventListener('canplaythrough', function() {
        console.log('Audio file detected and ready!');
        
        if (isLocalFile) {
            // For local files, use synchronized heartbeat visualization
            console.log('Local file detected, using synchronized heartbeat visualization');
            createHeartbeatWaveform();
        } else {
            // For web, use WaveSurfer normally
            initializeWaveSurfer();
        }
    });
    
    audioElement.addEventListener('error', function(e) {
        console.log('No valid audio file found, using demo waveform');
        createDemoWaveform();
    });
    
    // Try to load the audio
    audioElement.load();
    
    // If no audio loads after 2 seconds, show demo
    setTimeout(() => {
        if (audioElement.readyState === 0) {
            console.log('No audio loaded after timeout, showing demo waveform');
            createDemoWaveform();
        }
    }, 2000);
}

function initializeWaveSurfer() {
    try {
        wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'rgba(255, 182, 193, 0.8)',
            progressColor: '#FF69B4',
            cursorColor: '#FF1493',
            barWidth: 3,
            barGap: 2,
            barRadius: 3,
            responsive: true,
            height: 60,
            normalize: true,
            mediaControls: false
        });

        // Load the audio into WaveSurfer using the media element
        wavesurfer.loadMediaElement(audioElement);
        
        // WaveSurfer events
        wavesurfer.on('ready', () => {
            console.log('WaveSurfer ready with real audio!');
            // Hide demo canvas if it exists
            const demoCanvas = document.querySelector('#waveform canvas');
            if (demoCanvas) {
                demoCanvas.style.display = 'none';
            }
        });
        
        wavesurfer.on('error', (err) => {
            console.log('WaveSurfer error:', err);
            createHeartbeatWaveform();
        });
        
    } catch (error) {
        console.log('WaveSurfer initialization error:', error);
        createHeartbeatWaveform();
    }
}

// Create heartbeat-synchronized waveform for local files
function createHeartbeatWaveform() {
    const waveformContainer = document.getElementById('waveform');
    
    // Clear any existing content
    const existingCanvas = waveformContainer.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = waveformContainer.offsetWidth || 400;
    canvas.height = 60;
    canvas.style.width = '100%';
    canvas.style.height = '60px';
    waveformContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let heartbeatPhase = 0;
    let isAudioPlaying = false;
    
    // Monitor audio play state
    audioElement.addEventListener('play', () => {
        isAudioPlaying = true;
        console.log('Audio playing, activating heartbeat visualization');
    });
    
    audioElement.addEventListener('pause', () => {
        isAudioPlaying = false;
    });
    
    audioElement.addEventListener('ended', () => {
        isAudioPlaying = false;
    });
    
    function drawHeartbeatWaveform() {
        if (!canvas.parentNode) return;
        
        requestAnimationFrame(drawHeartbeatWaveform);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = 4;
        const barGap = 2;
        const barCount = Math.floor(canvas.width / (barWidth + barGap));
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < barCount; i++) {
            const x = i * (barWidth + barGap);
            
            let barHeight;
            if (isAudioPlaying) {
                // Simulate heartbeat pattern when audio is playing
                const heartbeatSpeed = 0.08; // Speed of heartbeat animation
                const position = (heartbeatPhase + i * 0.1) % (Math.PI * 2);
                
                // Create double-beat pattern (lub-dub)
                const beat1 = Math.max(0, Math.sin(position)) * 0.8;
                const beat2 = Math.max(0, Math.sin(position * 2 + Math.PI/2)) * 0.4;
                const combined = beat1 + beat2;
                
                barHeight = combined * 35 + 8; // Base height + heartbeat variation
            } else {
                // Gentle static pattern when paused
                barHeight = Math.abs(Math.sin(i * 0.2)) * 15 + 5;
            }
            
            const y = centerY - barHeight / 2;
            
            // Create gradient based on intensity
            const intensity = barHeight / 50;
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, `rgba(255, 182, 193, ${0.6 + intensity * 0.3})`);
            gradient.addColorStop(1, `rgba(255, 105, 180, ${0.8 + intensity * 0.2})`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
        }
        
        if (isAudioPlaying) {
            heartbeatPhase += 0.08; // Heartbeat speed
        }
    }
    
    drawHeartbeatWaveform();
    console.log('Heartbeat visualization ready!');
}

// Create a demo waveform visualization
function createDemoWaveform() {
    const waveformContainer = document.getElementById('waveform');
    
    // Clear any existing content
    const existingCanvas = waveformContainer.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = waveformContainer.offsetWidth || 400;
    canvas.height = 60;
    canvas.style.width = '100%';
    canvas.style.height = '60px';
    waveformContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    animateWaveform(ctx, canvas);
}

function animateWaveform(ctx, canvas) {
    let time = 0;
    
    function draw() {
        if (!canvas.parentNode) return; // Stop if canvas is removed
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = 3;
        const barGap = 2;
        const barCount = Math.floor(canvas.width / (barWidth + barGap));
        
        for (let i = 0; i < barCount; i++) {
            const x = i * (barWidth + barGap);
            const height = Math.abs(Math.sin(time + i * 0.1)) * 40 + 10;
            const y = (canvas.height - height) / 2;
            
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(255, 182, 193, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 105, 180, 0.8)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, height);
        }
        
        time += 0.05;
        requestAnimationFrame(draw);
    }
    
    draw();
}

// Event listeners
function setupEventListeners() {
    const startBtn = document.getElementById('startBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const overlay = document.getElementById('startOverlay');
    
    // Start button to begin experience
    startBtn.addEventListener('click', function() {
        overlay.classList.add('hidden');
        
        // Try to start audio if available
        if (wavesurfer && wavesurfer.isReady) {
            wavesurfer.play();
            updatePlayButton(true);
        } else if (audioElement && audioElement.readyState >= 3) {
            audioElement.play().catch(e => console.log('Audio play failed:', e));
            isPlaying = true;
            updatePlayButton(true);
        }
        
        // Add some extra visual effects
        startExperience();
    });
    
    // Play/pause button
    playPauseBtn.addEventListener('click', function() {
        if (wavesurfer && wavesurfer.isReady) {
            if (isPlaying) {
                wavesurfer.pause();
            } else {
                wavesurfer.play();
            }
        } else if (audioElement && audioElement.readyState >= 3) {
            if (isPlaying) {
                audioElement.pause();
            } else {
                audioElement.play().catch(e => console.log('Audio play failed:', e));
            }
            isPlaying = !isPlaying;
            updatePlayButton(isPlaying);
        } else {
            // If no audio, just toggle visual feedback
            isPlaying = !isPlaying;
            updatePlayButton(isPlaying);
        }
    });
    
    // WaveSurfer events
    if (wavesurfer) {
        wavesurfer.on('play', () => {
            isPlaying = true;
            updatePlayButton(true);
        });
        
        wavesurfer.on('pause', () => {
            isPlaying = false;
            updatePlayButton(false);
        });
        
        wavesurfer.on('finish', () => {
            isPlaying = false;
            updatePlayButton(false);
        });
    }
    
    // HTML Audio events (for local files)
    if (audioElement) {
        audioElement.addEventListener('play', () => {
            if (!wavesurfer || !wavesurfer.isReady) {
                isPlaying = true;
                updatePlayButton(true);
            }
        });
        
        audioElement.addEventListener('pause', () => {
            if (!wavesurfer || !wavesurfer.isReady) {
                isPlaying = false;
                updatePlayButton(false);
            }
        });
        
        audioElement.addEventListener('ended', () => {
            if (!wavesurfer || !wavesurfer.isReady) {
                isPlaying = false;
                updatePlayButton(false);
            }
        });
    }
}

function updatePlayButton(playing) {
    const playBtn = document.getElementById('playPauseBtn');
    if (playing) {
        playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    } else {
        playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    }
}

function startExperience() {
    // Add extra sparkle effects
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createSparkle();
        }, i * 100);
    }
    
    // Pulse the baby silhouette
    const babyContainer = document.querySelector('.baby-container');
    babyContainer.style.animation = 'breathe 1s ease-in-out 3';
}

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'absolute';
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.background = '#FFD700';
    sparkle.style.borderRadius = '50%';
    sparkle.style.boxShadow = '0 0 10px #FFD700';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '999';
    
    document.body.appendChild(sparkle);
    
    // Animate sparkle
    sparkle.animate([
        { opacity: 0, transform: 'scale(0)' },
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0)' }
    ], {
        duration: 1000,
        easing: 'ease-in-out'
    }).finished.then(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    });
}

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    if (wavesurfer && wavesurfer.drawBuffer) {
        wavesurfer.drawBuffer();
    }
});

// Add some interactive hover effects
document.addEventListener('mousemove', function(e) {
    const baby = document.querySelector('.baby-silhouette');
    if (baby) {
        const rect = baby.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / 100;
        const deltaY = (e.clientY - centerY) / 100;
        
        baby.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1)`;
    }
});

// Add Easter egg - click on baby for surprise
document.addEventListener('DOMContentLoaded', function() {
    const baby = document.querySelector('.baby-silhouette');
    if (baby) {
        baby.addEventListener('click', function() {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    createFloatingHeart();
                }, i * 200);
            }
            
            // Play a special animation
            this.style.animation = 'breathe 0.5s ease-in-out 6';
        });
    }
}); 