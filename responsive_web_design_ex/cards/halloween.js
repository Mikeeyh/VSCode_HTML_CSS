// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// let particles = [];
// const colors = ['#FF4500', '#FFD700', '#ADFF2F', '#FF69B4', '#8A2BE2', '#FF8C00']; // Halloween colors

// class Particle {
//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
//         this.size = Math.random() * 15 + 5; // Random size between 5 and 20
//         this.speedX = Math.random() * 6 - 3; // Random speed in X direction
//         this.speedY = Math.random() * 6 - 3; // Random speed in Y direction
//         this.color = colors[Math.floor(Math.random() * colors.length)];
//         this.alpha = 1; // Initial opacity
//     }

//     update() {
//         this.x += this.speedX;
//         this.y += this.speedY;
//         this.alpha -= 0.01; // Fade effect
//         if (this.alpha <= 0) this.alpha = 0; // Prevent negative opacity
//     }

//     draw() {
//         ctx.save();
//         ctx.globalAlpha = this.alpha; // Apply fading
//         ctx.fillStyle = this.color;
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.restore();
//     }
// }

// function createParticles(e) {
//     const xPos = e.x;
//     const yPos = e.y;
//     const numParticles = Math.random() * 10 + 5; // Random number of particles for each click
//     for (let i = 0; i < numParticles; i++) {
//         particles.push(new Particle(xPos, yPos));
//     }
// }

// function animate() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
//     particles.forEach((particle, index) => {
//         particle.update();
//         particle.draw();
//         if (particle.alpha <= 0) {
//             particles.splice(index, 1); // Remove faded particles
//         }
//     });
//     requestAnimationFrame(animate); // Call animate recursively
// }

// canvas.addEventListener('click', createParticles);
// animate(); // Start animation

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Images for Halloween motives
const spiderImg = new Image();
spiderImg.src = 'https://img.icons8.com/ios-filled/50/000000/spider.png'; // Spider icon
const pumpkinImg = new Image();
pumpkinImg.src = 'https://img.icons8.com/ios-filled/50/000000/pumpkin.png'; // Pumpkin icon

const elements = [];
const bloodParticles = [];

// Class to create Halloween motives
class HalloweenElement {
    constructor(x, y, img, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.speedX = speedX;
        this.speedY = speedY;
        this.size = Math.random() * 40 + 30; // Size between 30 and 70
        this.alive = true; // To check if the element is still alive
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reverse direction if hitting the edges
        if (this.x + this.size > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y + this.size > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }

    draw() {
        if (this.alive) {
            ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
        }
    }

    smash() {
        this.alive = false; // Mark as not alive
        createBlood(this.x + this.size / 2, this.y + this.size / 2); // Create blood effect
    }
}

// Blood particle class
class BloodParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2; // Random size for blood particles
        this.speedY = Math.random() * -3 - 1; // Random upward speed
        this.speedX = Math.random() * 2 - 1; // Random sideways speed
        this.alpha = 1; // Initial opacity
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.05; // Fade out effect
        if (this.alpha < 0) this.alpha = 0; // Prevent negative opacity
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha; // Apply fading
        ctx.fillStyle = 'rgba(0, 255, 0, ' + this.alpha + ')'; // Green color for blood
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Create blood particles at the smash location
function createBlood(x, y) {
    for (let i = 0; i < 20; i++) { // Create 10 blood particles
        bloodParticles.push(new BloodParticle(x, y));
    }
}

// Create initial elements
function init() {
    for (let i = 0; i < 10; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let speedX = Math.random() * 2 + 1; // Speed between 1 and 3
        let speedY = Math.random() * 2 + 1; // Speed between 1 and 3

        const img = Math.random() < 0.5 ? spiderImg : pumpkinImg; // Randomly choose between spider and pumpkin
        elements.push(new HalloweenElement(x, y, img, speedX, speedY));
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    elements.forEach((element) => {
        element.update();
        element.draw();
    });

    // Update and draw blood particles
    bloodParticles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.alpha <= 0) {
            bloodParticles.splice(index, 1); // Remove faded particles
        }
    });

    requestAnimationFrame(animate); // Call animate recursively
}

// Check for clicks on elements
canvas.addEventListener('click', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    elements.forEach((element) => {
        if (
            element.alive &&
            mouseX > element.x &&
            mouseX < element.x + element.size &&
            mouseY > element.y &&
            mouseY < element.y + element.size
        ) {
            element.smash(); // Smash the element
        }
    });
});

spiderImg.onload = () => {
    pumpkinImg.onload = () => {
        init();
        animate(); // Start animation
    };
};
