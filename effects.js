// effects.js

export function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

export function createParticle(container) {
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

export function initializeFloatingHearts() {
    setInterval(() => {
        createFloatingHeart();
    }, 3000);
}

export function createFloatingHeart() {
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

export function createSparkle() {
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

export function setupBabyHover() {
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
}

export function setupEasterEgg() {
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
} 