// countdown.js

export function initializeCountdown() {
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