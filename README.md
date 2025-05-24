# Camille-RADIO

A modern, interactive baby announcement web app celebrating the arrival of Camille. This project is a single-page application featuring a real heartbeat audio visualizer, playful animations, and a responsive design.

## Features
- **Audio Visualizer**: Real-time frequency bars using p5.js and p5.sound, with a logarithmic mapping for a natural, professional look.
- **Responsive Design**: Mobile-first, works on all screen sizes.
- **Particle & Heart Animations**: Floating hearts, sparkles, and background particles for a dreamy effect.
- **Countdown & Age Display**: Live countdown to the due date, then automatic age display (weeks/months/years) after birth.
- **Interactive Baby Illustration**: Hover and click effects, easter eggs, and animated breathing.
- **Modular JavaScript**: All logic is split into ES6 modules for maintainability and clarity.

## Technologies
- **HTML5/CSS3** (custom, no framework)
- **JavaScript ES6 modules**
- **[p5.js](https://p5js.org/)** and **[p5.sound](https://p5js.org/reference/#/libraries/p5.sound)** for audio analysis and visualization
- **SVG** for baby illustration

## Project Structure
```
Camille-RADIO/
├── index.html
├── style.css
├── camille_heartbeat.mp3 (audio asset)
├── main.js            # Entry point, initializes all modules
├── visualizer.js      # p5.js audio visualizer logic
├── effects.js         # Particles, hearts, sparkles, baby hover, easter egg
├── countdown.js       # Countdown and age calculation
├── audio-controls.js  # Play/pause, overlay, audio events
├── README.md
```

## Code Organization
- **main.js**: Imports all modules, sets up global state, and triggers initialization on DOMContentLoaded.
- **visualizer.js**: Contains the p5.js sketch for the audio visualizer. Handles all audio analysis and canvas drawing.
- **effects.js**: Handles all non-audio visual effects (particles, floating hearts, sparkles, baby hover, easter egg).
- **countdown.js**: Manages the countdown to the due date and age display logic.
- **audio-controls.js**: Handles UI controls for audio playback and overlay management.

## Audio
- The heartbeat audio is loaded via p5.sound and visualized in real time.
- All audio analysis is performed client-side using the Web Audio API via p5.js.

## License
MIT 