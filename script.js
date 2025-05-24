// Global variables
let isPlaying = false;
let audioElement = null;
let sound = null;
let fft = null;
let amplitude = null;
let canvas = null;
let waveformContainer = null;
let audioReady = false;

// Non-p5 functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeFloatingHearts();
    initializeCountdown();
    setupEventListeners();
    setupP5Canvas();
});

// Setup p5.js canvas inside the waveform container
function setupP5Canvas() {
    waveformContainer = document.getElementById('waveform');
    
    // Create p5 sketch
    const sketch = (p) => {
        p.setup = function() {
            const canvasWidth = waveformContainer.offsetWidth || 400;
            canvas = p.createCanvas(canvasWidth, 60);
            canvas.parent('waveform');
            canvas.style('border-radius', '5px');
            
            // Initialize audio analysis with p5.sound
            try {
                fft = new p5.FFT(0.8, 512);
                amplitude = new p5.Amplitude();
                
                // Try to load audio file
                sound = p.loadSound('camille_heartbeat.mp3', 
                    () => {
                        console.log('Audio loaded successfully with p5.sound!');
                        audioReady = true;
                        sound.setLoop(true);
                        fft.setInput(sound);
                        amplitude.setInput(sound);
                    },
                    () => {
                        console.log('Audio file not found, using demo mode');
                        audioReady = false;
                    }
                );
            } catch (error) {
                console.log('p5.sound initialization failed:', error);
                audioReady = false;
            }
        };
        
        p.draw = function() {
            p.clear();
            
            if (audioReady && fft) {
                drawRealAudio(p);
            } else {
                drawDemoWaveform(p);
            }
        };
        
        p.windowResized = function() {
            const newWidth = waveformContainer.offsetWidth || 400;
            p.resizeCanvas(newWidth, 60);
        };
        
        function drawRealAudio(p) {
            let spectrum = fft.analyze();
            let currentAmplitude = amplitude.getLevel();

            p.noStroke();

            let numBars = 90;
            let barWidth = p.width / numBars;
            let bassBins = 48; // Les 48 premières fréquences (basses)
            let bassBars = Math.floor(numBars * 0.7); // 70% des barres pour les graves
            let highBars = numBars - bassBars;
            let maxFreqIndex = 128;

            for (let i = 0; i < numBars; i++) {
                let x = i * barWidth;
                let amplitude = 0;

                if (i < bassBars) {
                    // Mapper linéairement les 48 basses fréquences sur 70% des barres
                    let startIdx = Math.floor(i * bassBins / bassBars);
                    let endIdx = Math.floor((i + 1) * bassBins / bassBars);
                    let sum = 0, count = 0;
                    for (let j = startIdx; j < endIdx; j++) {
                        sum += spectrum[j] || 0;
                        count++;
                    }
                    amplitude = count > 0 ? sum / count : 0;
                } else {
                    // Mapper le reste des fréquences (48 à 128) sur les barres restantes
                    let startIdx = bassBins + Math.floor((i - bassBars) * (maxFreqIndex - bassBins) / highBars);
                    let endIdx = bassBins + Math.floor((i - bassBars + 1) * (maxFreqIndex - bassBins) / highBars);
                    let sum = 0, count = 0;
                    for (let j = startIdx; j < endIdx; j++) {
                        sum += spectrum[j] || 0;
                        count++;
                    }
                    amplitude = count > 0 ? sum / count : 0;
                }

                // Hauteur limitée
                let h = p.map(amplitude, 0, 255, 0, p.height * 0.6);
                let globalBoost = currentAmplitude * 30;
                h += globalBoost;
                h = p.constrain(h, isPlaying ? 3 : 1, p.height * 0.7);

                // Couleur
                let intensity = p.map(h, 0, p.height * 0.7, 0, 1);
                let r = p.lerp(255, 255, intensity);
                let g = p.lerp(200, 105, intensity);
                let b = p.lerp(220, 180, intensity);

                // Lueur
                if (isPlaying && h > 6) {
                    p.fill(r, g, b, 100);
                    p.rect(x - 1, p.height - h - 2, barWidth + 1, h + 4);
                }

                // Barre principale
                p.fill(r, g, b);
                p.rect(x, p.height - h, barWidth - 1, h);
            }

            // Pulse subtil
            if (isPlaying) {
                let time = p.millis() * 0.002;
                let heartbeatPulse = p.sin(time * 3) * 0.1 + 0.9;
                let globalAmplitudePulse = currentAmplitude * 50;
                p.fill(255, 182, 193, (15 + globalAmplitudePulse) * heartbeatPulse);
                p.rect(0, 0, p.width, p.height);
            }
        }
        
        function drawDemoWaveform(p) {
            let time = p.millis() * 0.001;
            
            p.noStroke();
            
            // Demo bars across full width
            let numBars = 120;
            let barWidth = p.width / numBars;
            
            for (let i = 0; i < numBars; i++) {
                let x = i * barWidth;
                
                // Create heartbeat pattern
                let normalizedPos = i / numBars;
                let wavePhase = time + normalizedPos * p.PI * 4;
                let height = p.abs(p.sin(wavePhase)) * 25;
                
                // Add heartbeat rhythm
                let beatPhase = (time * 1.5) % (p.PI * 2);
                if (beatPhase < p.PI * 0.2) {
                    height += p.sin(beatPhase / 0.2 * p.PI) * 15;
                } else if (beatPhase > p.PI * 0.3 && beatPhase < p.PI * 0.5) {
                    height += p.sin((beatPhase - p.PI * 0.3) / 0.2 * p.PI) * 8;
                }
                
                // Add variation
                height += p.sin(normalizedPos * p.PI) * 5;
                height += p.random(-2, 2);
                height = p.max(height, 3);
                
                // Color gradient
                let alpha = p.map(height, 0, 40, 0.6, 1.0);
                p.fill(255, 182, 193, 255 * alpha);
                p.rect(x, p.height - height, barWidth - 1, height);
            }
        }
    };
    
    // Create the p5 instance
    new p5(sketch);
}

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
    
    const size = Math.random() * 6 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
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
    
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 10000);
}

// Countdown to June 2025
function initializeCountdown() {
    const countdownElement = document.getElementById('countdown');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const targetDate = new Date('2025-06-21').getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            const birthDate = new Date('2025-06-21');
            const currentDate = new Date();
            
            const ageInMs = currentDate - birthDate;
            const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
            const ageInMonths = Math.floor(ageInDays / 30.44);
            const ageInYears = Math.floor(ageInMonths / 12);
            
            if (ageInMonths < 36) {
                if (ageInMonths === 0) {
                    const ageInWeeks = Math.floor(ageInDays / 7);
                    countdownElement.innerHTML = `Camille a ${ageInWeeks} semaine${ageInWeeks > 1 ? 's' : ''} ! 🎉`;
                } else {
                    countdownElement.innerHTML = `Camille a ${ageInMonths} mois ! 🎉`;
                }
            } else {
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

// Event listeners
function setupEventListeners() {
    const startBtn = document.getElementById('startBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const overlay = document.getElementById('startOverlay');
    
    // Start button
    startBtn.addEventListener('click', function() {
        overlay.classList.add('hidden');
        
        // Start audio with p5.sound if available
        if (audioReady && sound) {
            sound.play();
            isPlaying = true;
            updatePlayButton(true);
        } else {
            // Just show demo animation
            isPlaying = true;
            updatePlayButton(true);
        }
        
        startExperience();
    });
    
    // Play/pause button
    playPauseBtn.addEventListener('click', function() {
        if (audioReady && sound) {
            if (isPlaying) {
                sound.pause();
                isPlaying = false;
            } else {
                sound.play();
                isPlaying = true;
            }
        } else {
            // Toggle demo mode
            isPlaying = !isPlaying;
        }
        updatePlayButton(isPlaying);
    });
    
    // Setup audio events if using fallback HTML5 audio
    audioElement = document.getElementById('audioElement');
    audioElement.addEventListener('play', () => {
        if (!audioReady) {
            isPlaying = true;
            updatePlayButton(true);
        }
    });
    
    audioElement.addEventListener('pause', () => {
        if (!audioReady) {
            isPlaying = false;
            updatePlayButton(false);
        }
    });
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
    // Add sparkle effects
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createSparkle();
        }, i * 100);
    }
    
    // Pulse baby animation
    const babyContainer = document.querySelector('.baby-container');
    if (babyContainer) {
    babyContainer.style.animation = 'breathe 1s ease-in-out 3';
    }
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

// Interactive hover effects
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

// Easter egg - click baby for surprise
document.addEventListener('DOMContentLoaded', function() {
    const baby = document.querySelector('.baby-silhouette');
    if (baby) {
        baby.addEventListener('click', function() {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    createFloatingHeart();
                }, i * 200);
            }
            
            this.style.animation = 'breathe 0.5s ease-in-out 6';
        });
    }
}); 