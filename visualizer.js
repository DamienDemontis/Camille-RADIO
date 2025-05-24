// visualizer.js

export function setupP5Canvas() {
    const waveformContainer = document.getElementById('waveform');
    const sketch = (p) => {
        p.setup = function() {
            const canvasWidth = waveformContainer.offsetWidth || 400;
            const canvas = p.createCanvas(canvasWidth, 60);
            canvas.parent('waveform');
            canvas.style('border-radius', '5px');

            // Initialisation audio ici (dans le contexte p5)
            window.fft = new p5.FFT(0.8, 512);
            window.amplitude = new p5.Amplitude();
            window.sound = p.loadSound('camille_heartbeat.mp3',
                () => {
                    window.audioReady = true;
                    window.sound.setLoop(true);
                    window.fft.setInput(window.sound);
                    window.amplitude.setInput(window.sound);
                },
                () => {
                    window.audioReady = false;
                }
            );
        };
        p.draw = function() {
            p.clear();
            if (window.audioReady && window.fft) {
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
            let spectrum = window.fft.analyze();
            let currentAmplitude = window.amplitude.getLevel();
            p.noStroke();
            let numBars = 48;
            let barWidth = p.width / numBars;
            let minFreq = 20;
            let maxFreq = 2000;
            let nyquist = p.sampleRate() / 2;
            for (let i = 0; i < numBars; i++) {
                // Mapping logarithmique
                let freq = minFreq * Math.pow(maxFreq / minFreq, i / (numBars - 1));
                let idx = Math.floor(freq / nyquist * spectrum.length);
                let amplitude = spectrum[idx] || 0;
                let x = i * barWidth;
                // Hauteur
                let h = p.map(amplitude, 0, 255, 0, p.height * 0.7);
                let globalBoost = currentAmplitude * 30;
                h += globalBoost;
                h = p.constrain(h, window.isPlaying ? 3 : 1, p.height * 0.8);
                // Couleur
                let intensity = p.map(h, 0, p.height * 0.8, 0, 1);
                let r = p.lerp(255, 255, intensity);
                let g = p.lerp(200, 105, intensity);
                let b = p.lerp(220, 180, intensity);
                // Lueur
                if (window.isPlaying && h > 6) {
                    p.fill(r, g, b, 100);
                    p.rect(x - 1, p.height - h - 2, barWidth + 1, h + 4);
                }
                // Barre principale
                p.fill(r, g, b);
                p.rect(x, p.height - h, barWidth - 1, h);
            }
            // Pulse subtil
            if (window.isPlaying) {
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
            let numBars = 48;
            let barWidth = p.width / numBars;
            for (let i = 0; i < numBars; i++) {
                let x = i * barWidth;
                let normalizedPos = i / numBars;
                let wavePhase = time + normalizedPos * p.PI * 4;
                let height = p.abs(p.sin(wavePhase)) * 25;
                let beatPhase = (time * 1.5) % (p.PI * 2);
                if (beatPhase < p.PI * 0.2) {
                    height += p.sin(beatPhase / 0.2 * p.PI) * 15;
                } else if (beatPhase > p.PI * 0.3 && beatPhase < p.PI * 0.5) {
                    height += p.sin((beatPhase - p.PI * 0.3) / 0.2 * p.PI) * 8;
                }
                height += p.sin(normalizedPos * p.PI) * 5;
                height += p.random(-2, 2);
                height = p.max(height, 3);
                let alpha = p.map(height, 0, 40, 0.6, 1.0);
                p.fill(255, 182, 193, 255 * alpha);
                p.rect(x, p.height - height, barWidth - 1, height);
            }
        }
    };
    new p5(sketch);
} 