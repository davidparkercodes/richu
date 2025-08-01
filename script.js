const protossMusic = document.getElementById('protossMusic');
const jimmyMusic = document.getElementById('jimmyMusic');
const protoss2Music = document.getElementById('protoss2Music');
let musicStarted = false;
let didMessagePlay = false;

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
}

function playProtoss2AfterJimmy() {
    console.log('Jimmy finished, starting Protoss 2...');
    protoss2Music.currentTime = 0;
    protoss2Music.volume = 0.6;
    const protoss2Promise = protoss2Music.play();
    
    if (protoss2Promise !== undefined) {
        protoss2Promise.then(() => {
            console.log('Protoss 2 music started playing after Jimmy');
        }).catch(e => {
            console.log('Protoss 2 music failed to play after Jimmy:', e);
        });
    }
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
            
        }).catch(e => {
            console.log('Protoss music failed to play:', e);
            console.log('Protoss music current time:', protossMusic.currentTime);
            console.log('Protoss music ready state:', protossMusic.readyState);
            console.log('User interaction may be required - click or press any key!');
        });
    }
}

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
    
    // Start music sequence only after a user click or keydown
    document.addEventListener('click', () => {
        console.log('User clicked - initiating music sequence if needed');
        if (!musicStarted && !didMessagePlay) {
            startMusicSequence();
        }
    });
    
    document.addEventListener('keydown', () => {
        console.log('User pressed a key - initiating music sequence if needed');
        if (!musicStarted && !didMessagePlay) {
            startMusicSequence();
        }
    });
    
    const playMessageBtn = document.getElementById('playMessageBtn');
    if (playMessageBtn) {
        playMessageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Play message button clicked!');
            
            protossMusic.pause();
            protossMusic.currentTime = 0;
            protoss2Music.pause();
            protoss2Music.currentTime = 0;
            
            jimmyMusic.currentTime = 0;
            jimmyMusic.volume = 1.0;
            
            didMessagePlay = true;
            jimmyMusic.removeEventListener('ended', playProtoss2AfterJimmy);
            jimmyMusic.addEventListener('ended', playProtoss2AfterJimmy);
            
            const jimmyPromise = jimmyMusic.play();
            
            if (jimmyPromise !== undefined) {
                jimmyPromise.then(() => {
                    console.log('Jimmy message playing from button click');
                }).catch(e => {
                    console.log('Failed to play Jimmy message from button:', e);
                });
            }
        });
    }
});
