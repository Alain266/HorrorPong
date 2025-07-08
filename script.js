const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const screamerContainer = document.getElementById('screamerContainer');
const screamerImage = document.getElementById('screamerImage');
const screamerSound = document.getElementById('screamerSound');

// NOUVEAU : Référence à l'élément audio de la musique de fond
const backgroundMusic = document.getElementById('backgroundMusic');

// Propriétés du jeu
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 150;
const BALL_SIZE = 15;
let paddle1Y = (canvas.height - PADDLE_HEIGHT) / 2;
let paddle2Y = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let player1Score = 0;
let player2Score = 0;

// NOUVEAU/CORRIGÉ : Tableau GLOBAL des screamers avec PRECHARGEMENT des objets Audio
const SCREAMERS = [
    {
        image: 'img/01.jpg',
        audioElement: new Audio('jumpscare/scary_Screamer.mp3') // Précharge l'audio
    },
    {
        image: 'img/02.jpg',
        audioElement: new Audio('jumpscare/ascending-jumpscare-102061.mp3')
    },
    {
        image: 'img/03.jpg',
        audioElement: new Audio('jumpscare/fuzzy-jumpscare-80560.mp3')
    },
    {
        image: 'img/04.jpg',
        audioElement: new Audio('jumpscare/jump-scare-sound-2-82831.mp3')
    },
    // Ajoute d'autres objets { image: 'chemin/image.jpg', audioElement: new Audio('chemin/son.mp3') }
];
// Assure-toi que tous les chemins sont corrects et que les fichiers existent !

const SCREAMER_DURATION = 1000; // Durée du screamer en ms (1 seconde)

// NOUVEAU : Définition des délais MIN/MAX pour la progression de la difficulté
const INITIAL_MIN_SCREAMER_DELAY = 15 * 1000; // Délai minimum initial (15 secondes)
const INITIAL_MAX_SCREAMER_DELAY = 45 * 1000; // Délai maximum initial (45 secondes)

const FINAL_MIN_SCREAMER_DELAY = 5 * 1000;   // Délai minimum cible à haute difficulté (5 secondes)
const FINAL_MAX_SCREAMER_DELAY = 25 * 1000;  // Délai maximum cible à haute difficulté (25 secondes)

const SCORE_THRESHOLD_FOR_MAX_DIFFICULTY = 20; // Score à partir duquel la difficulté maximale (délais finaux) est atteinte

let nextScreamerTime = Date.now() + getRandomScreamerDelay(); // Calcule la première fois où un screamer peut se déclencher
let isScreamerActive = false; // Pour éviter de déclencher plusieurs screamers en même temps

// Fonction utilitaire pour obtenir un délai aléatoire dans notre fourchette
// Cette fourchette est maintenant ajustée en fonction du score du joueur 1.
function getRandomScreamerDelay() {
    // Calcule un facteur de difficulté basé sur le score du joueur 1.
    // Ce facteur va de 0 (quand player1Score est 0) à 1 (quand player1Score atteint ou dépasse SCORE_THRESHOLD_FOR_MAX_DIFFICULTY).
    const difficultyFactor = Math.min(player1Score / SCORE_THRESHOLD_FOR_MAX_DIFFICULTY, 1);

    // Interpolation linéaire : Les délais diminuent à mesure que difficultyFactor augmente.
    const currentMinDelay = INITIAL_MIN_SCREAMER_DELAY - (INITIAL_MIN_SCREAMER_DELAY - FINAL_MIN_SCREAMER_DELAY) * difficultyFactor;
    const currentMaxDelay = INITIAL_MAX_SCREAMER_DELAY - (INITIAL_MAX_SCREAMER_DELAY - FINAL_MAX_SCREAMER_DELAY) * difficultyFactor;

    // Retourne un délai aléatoire dans la fourchette calculée.
    return Math.random() * (currentMaxDelay - currentMinDelay) + currentMinDelay;
}

// --- Fonctions de dessin ---
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
}

function drawText(text, x, y, color = 'white', fontSize = '30px Arial') {
    ctx.fillStyle = color;
    ctx.font = fontSize;
    ctx.fillText(text, x, y);
}

// --- Logique du jeu ---
function moveAll() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Rebond sur les murs haut et bas
    if (ballY + BALL_SIZE / 2 > canvas.height || ballY - BALL_SIZE / 2 < 0) {
        ballSpeedY *= -1;
    }

    // Collision avec la raquette droite
    if (ballX + BALL_SIZE / 2 >= canvas.width - PADDLE_WIDTH && ballSpeedX > 0) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX *= -1;
            let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
        }
    }

    // Collision avec la raquette gauche
    if (ballX - BALL_SIZE / 2 <= PADDLE_WIDTH && ballSpeedX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX *= -1;
            let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
        }
    }

    // Gestion des points (si la balle sort de l'écran)
    if (ballX + BALL_SIZE / 2 > canvas.width) { // Balle sort à droite
        player1Score++;
        resetBall();
    } else if (ballX - BALL_SIZE / 2 < 0) { // Balle sort à gauche
        player2Score++;
        resetBall();
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1; // Change la direction initiale de la balle
}

function drawAll() {
    // Fond noir
    drawRect(0, 0, canvas.width, canvas.height, 'black');

    // Raquettes
    drawRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
    drawRect(canvas.width - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

    // Balle
    drawCircle(ballX, ballY, BALL_SIZE / 2, 'white');

    // Score
    drawText(player1Score, canvas.width / 4, 50);
    drawText(player2Score, canvas.width * 3 / 4, 50);
}

// --- Gestion des screamers (MISE À JOUR pour le préchargement et la gestion de la musique de fond) ---
function triggerScreamer() {
    if (isScreamerActive) {
        return;
    }

    isScreamerActive = true;

    // Mettre en pause la musique de fond
    backgroundMusic.pause();
    console.log("Musique de fond mise en pause pour le screamer.");

    const randomIndex = Math.floor(Math.random() * SCREAMERS.length);
    const selectedScreamer = SCREAMERS[randomIndex];

    screamerImage.src = selectedScreamer.image;

    screamerSound.src = selectedScreamer.audioElement.src;
    screamerSound.load();

    screamerSound.volume = 0.8; // Volume du son du screamer (80%)
    
    screamerSound.play().catch(e => {
        console.error("Erreur lors de la lecture du son du screamer :", e);
    });

    screamerContainer.classList.add('screamer-active');

    setTimeout(() => {
        screamerContainer.classList.remove('screamer-active');
        screamerSound.pause();
        screamerSound.currentTime = 0;
        isScreamerActive = false;

        if (audioInitialized) {
            backgroundMusic.play().catch(e => {
                console.error("Erreur lors de la reprise de la musique de fond :", e);
            });
            console.log("Musique de fond relancée après le screamer.");
        }

    }, SCREAMER_DURATION);
}

// --- Boucle de jeu principale (AVEC VÉRIFICATION ALÉATOIRE DU SCREAMER) ---
function gameLoop() {
    moveAll();
    drawAll();

    // Vérification aléatoire du screamer
    // On vérifie si aucun screamer n'est actif ET si le temps actuel a dépassé le temps de déclenchement prévu
    if (!isScreamerActive && Date.now() >= nextScreamerTime) {
        triggerScreamer();
        // Calcule le temps pour le prochain screamer en utilisant la nouvelle difficulté
        nextScreamerTime = Date.now() + getRandomScreamerDelay();
    }

    requestAnimationFrame(gameLoop); // Boucle optimisée pour les animations
}

// --- Contrôles (souris pour simplifier le test sur PC) ---
canvas.addEventListener('mousemove', (evt) => {
    let mouseY = evt.clientY - canvas.getBoundingClientRect().top;
    paddle1Y = mouseY - (PADDLE_HEIGHT / 2);
});

// IA simple pour la raquette de droite
function moveComputerPaddle() {
    const computerPaddleCenter = paddle2Y + PADDLE_HEIGHT / 2;
    // La raquette de l'IA est moins réactive, avec un léger décalage pour la rendre battable
    if (computerPaddleCenter < ballY - 35) {
        paddle2Y += 6; // Vitesse de la raquette de l'IA
    } else if (computerPaddleCenter > ballY + 35) {
        paddle2Y -= 6;
    }
    // S'assurer que la raquette de l'IA ne sort pas du canvas
    if (paddle2Y < 0) paddle2Y = 0;
    if (paddle2Y > canvas.height - PADDLE_HEIGHT) paddle2Y = canvas.height - PADDLE_HEIGHT;
}


// NOUVEAU : GESTION DE LA MUSIQUE DE FOND ET INITIALISATION AUDIO AU PREMIER CLIC
let audioInitialized = false; // Drapeau pour suivre si l'initialisation audio a eu lieu

canvas.addEventListener('click', function setupAudio() {
    if (audioInitialized) return; // Ne s'exécute qu'une seule fois

    backgroundMusic.volume = 0.1; // Ajuste le volume de la musique
    backgroundMusic.play().then(() => {
        console.log("Musique de fond démarrée après le clic.");
        audioInitialized = true;
    }).catch(e => {
        console.error("Échec de la lecture de la musique de fond au clic (probablement bloqué par le navigateur) :", e);
    });

    // IMPORTANT : Retirer cet écouteur pour qu'il ne se déclenche qu'une seule fois
    canvas.removeEventListener('click', setupAudio);
    console.log("Contexte audio initialisé par l'interaction utilisateur.");
}, { once: true });


// Exécute la boucle de jeu principale
gameLoop();
// Exécute le mouvement de l'IA à la même fréquence que le rafraîchissement d'écran pour qu'elle soit fluide
setInterval(moveComputerPaddle, 1000 / 60); // 60 FPS