
document.addEventListener("DOMContentLoaded", () => {
    const bars = document.querySelectorAll("[data-alt]");

    bars.forEach(bar => {
      
        let speed = parseInt(bar.getAttribute("data-speed")) || 700;

        setInterval(() => {
            let current = bar.src;
            let alt = bar.getAttribute("data-alt");

            bar.setAttribute("data-alt", current);
            bar.src = alt;
        }, speed);
    });
});

//EYE follows
const pupil = document.querySelector('.eye-pupil');
const eyeContainer = document.querySelector('.eye-container');

const maxDistance = 50; // maximum pixels pupil can move from eye center
const shakeRange = 5;   // horizontal shake intensity
const interval = 20;    // update frequency in ms

// Track cursor position globally
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

setInterval(() => {
    const rect = eyeContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate vector from eye center to cursor
    let dx = mouseX - centerX;
    let dy = mouseY - centerY;

    // Clamp distance to maxDistance (circular boundary)
    const distance = Math.sqrt(dx*dx + dy*dy);
    const clampedDistance = Math.min(distance, maxDistance);
    const angle = Math.atan2(dy, dx);
    const pupilX = clampedDistance * Math.cos(angle);
    const pupilY = clampedDistance * Math.sin(angle);

    // Add random jitter for horizontal shake
    const jitterX = Math.floor(Math.random() * (shakeRange*2 + 1)) - shakeRange;
    const jitterY = Math.floor(Math.random() * (shakeRange*2 + 1)) - shakeRange;

    // Apply transform (centered + cursor offset + jitter)
    pupil.style.transform = `translate(${pupilX + jitterX}px, ${pupilY + jitterY}px)`;
}, interval);