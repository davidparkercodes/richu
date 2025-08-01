const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.02;
        this.gravity = 0.1;
        this.size = Math.random() * 4 + 3;
    }

    update() {
        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;
        this.velocity.y += this.gravity;
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Firework {
    constructor(startX, startY, targetX, targetY) {
        this.x = startX;
        this.y = startY;
        this.startX = startX;
        this.startY = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        
        const angle = Math.atan2(targetY - startY, targetX - startX);
        const distance = Math.sqrt((targetX - startX) ** 2 + (targetY - startY) ** 2);
        
        this.velocity = {
            x: Math.cos(angle) * 8,
            y: Math.sin(angle) * 8
        };
        
        this.distanceToTarget = distance;
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        
        while(this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
    }

    update() {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        
        this.velocity.y += 0.2;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        this.distanceTraveled = Math.sqrt((this.x - this.startX) ** 2 + (this.y - this.startY) ** 2);
        
        if(this.distanceTraveled >= this.distanceToTarget) {
            this.explode();
            return false;
        }
        return true;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 8;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffaa00';
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffaa00';
        ctx.fill();
    }

    explode() {
        const particleCount = 50;
        const colors = ['#ff0066', '#ff9900', '#66ff00', '#0099ff', '#9900ff', '#ffff00', '#ff6600'];
        
        for(let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2) / particleCount * i;
            const velocity = {
                x: Math.cos(angle) * (Math.random() * 6 + 4),
                y: Math.sin(angle) * (Math.random() * 6 + 4)
            };
            
            particles.push(new Particle(
                this.x,
                this.y,
                colors[Math.floor(Math.random() * colors.length)],
                velocity
            ));
        }
    }
}

const fireworks = [];
const particles = [];

function createFirework() {
    const startX = Math.random() * canvas.width;
    const startY = canvas.height;
    const targetX = Math.random() * canvas.width;
    const targetY = Math.random() * canvas.height * 0.5;
    
    fireworks.push(new Firework(startX, startY, targetX, targetY));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(let i = fireworks.length - 1; i >= 0; i--) {
        if(!fireworks[i].update()) {
            fireworks.splice(i, 1);
        } else {
            fireworks[i].draw();
        }
    }
    
    for(let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if(particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener('click', (e) => {
    const startX = Math.random() * canvas.width;
    const startY = canvas.height;
    fireworks.push(new Firework(startX, startY, e.clientX, e.clientY));
});

function createConfetti() {
    const confettiCount = 100;
    const colors = ['#ff0066', '#ff9900', '#66ff00', '#0099ff', '#9900ff', '#ffff00'];
    
    for(let i = 0; i < confettiCount; i++) {
        const x = Math.random() * canvas.width;
        const y = -10;
        const velocity = {
            x: (Math.random() - 0.5) * 4,
            y: Math.random() * 3 + 2
        };
        
        particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)], velocity));
    }
}


const protossMusic = document.getElementById('protossMusic');
const jimmyMusic = document.getElementById('jimmyMusic');
const protoss2Music = document.getElementById('protoss2Music');
let musicStarted = false;

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
}

function startMusicSequence() {
    if (musicStarted) return;
    musicStarted = true;
    
    console.log('Attempting to start music sequence...');
    const mobile = isMobile();
    console.log('Mobile detected:', mobile);
    
    protossMusic.volume = 0.6;
    const protossPromise = protossMusic.play();
    
    if (protossPromise !== undefined) {
        protossPromise.then(() => {
            console.log('Protoss music started playing at 60% volume');

            protossMusic.addEventListener('ended', () => {
                console.log('Protoss music ended, starting Protoss 2...');
                protoss2Music.volume = 0.6;
                const protoss2Promise = protoss2Music.play();
                
                if (protoss2Promise !== undefined) {
                    protoss2Promise.then(() => {
                        console.log('Protoss 2 music started playing at 60% volume');
                    }).catch(e => {
                        console.log('Protoss 2 music failed to play:', e);
                    });
                }
            });
            
            setTimeout(() => {
                if (mobile) {
                    console.log('Mobile detected - stopping protoss music before playing Jimmy');
                    protossMusic.pause();
                    protossMusic.currentTime = 0;
                }
                
                jimmyMusic.volume = 1.0;
                const jimmyPromise = jimmyMusic.play();
                
                if (jimmyPromise !== undefined) {
                    jimmyPromise.then(() => {
                        console.log('Jimmy music started playing at 100% volume');
                    }).catch(e => {
                        console.log('Jimmy music failed to play:', e);
                        console.log('Jimmy music current time:', jimmyMusic.currentTime);
                        console.log('Jimmy music ready state:', jimmyMusic.readyState);
                    });
                }
            }, 8000);
            
        }).catch(e => {
            console.log('Protoss music failed to play:', e);
            console.log('Protoss music current time:', protossMusic.currentTime);
            console.log('Protoss music ready state:', protossMusic.readyState);
            console.log('User interaction may be required - click or press any key!');
        });
    }
}

document.addEventListener('click', () => {
    // Reset the flag to allow retries
    musicStarted = false;
    startMusicSequence();
});

document.addEventListener('keydown', () => {
    startMusicSequence();
});

let assetsLoaded = 0;
const totalAssets = 1;

function checkAssetsLoaded() {
    assetsLoaded++;
    console.log(`Assets loaded: ${assetsLoaded}/${totalAssets}`);
    if (assetsLoaded >= totalAssets) {
        startCelebration();
    }
}

function startCelebration() {
    console.log('Starting celebration!');
    const loadingScreen = document.getElementById('loadingScreen');
    const celebration = document.getElementById('celebration');
    const topText = document.getElementById('topText');
    const bottomText = document.getElementById('bottomText');
    
    startMusicSequence();
    
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
    }, 1000);
    
    setTimeout(() => {
        const starsStyle = document.createElement('style');
        starsStyle.textContent = 'body::before { opacity: 1 !important; }';
        document.head.appendChild(starsStyle);
    }, 2000);
    
    setTimeout(() => {
        const protossBackground = document.getElementById('protossBackground');
        protossBackground.style.backgroundImage = 'url("protoss.jpg")';
        protossBackground.classList.add('slide-in');
    }, 5000);
    
    setTimeout(() => {
        celebration.classList.add('visible');
    }, 7000);
    
    setTimeout(() => {
        topText.classList.add('slide-in');
    }, 8000);
    
    setTimeout(() => {
        bottomText.classList.add('slide-in');
    }, 9000);
}

const backgroundImage = new Image();
backgroundImage.onload = checkAssetsLoaded;
backgroundImage.src = 'protoss.jpg';

window.addEventListener('load', () => {
    console.log('Page loaded, checking audio readiness...');
    console.log('Protoss music ready state:', protossMusic.readyState);
    console.log('Jimmy music ready state:', jimmyMusic.readyState);
});
