// Récupérer l'élément canvas par son ID et configurer le contexte de dessin en 2D
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Paramètres du jeu - ces paramètres définissent les propriétés de base des éléments du jeu
let ballRadius = 10; // Rayon de la balle
let paddleHeight = 10; // Hauteur de la raquette
let paddleWidth = 75; // Largeur de la raquette
let brickRowCount = 3; // Nombre de rangées de briques
let brickColumnCount = 5; // Nombre de colonnes de briques
let brickWidth = 75; // Largeur de chaque brique
let brickHeight = 20; // Hauteur de chaque brique
let brickPadding = 10; // Espacement entre les briques
let brickOffsetTop = 30; // Décalage depuis le haut pour les briques
let brickOffsetLeft = 30; // Décalage depuis la gauche pour les briques

// Variables du jeu :
// x, y : Position actuelle de la balle sur le canvas
// dx, dy : Vitesse de la balle, indiquant sa rapidité et sa direction
// paddleX : Position horizontale actuelle de la raquette sur le canvas
// score : Le score actuel du joueur, augmenté lorsqu'une brique est touchée
// bricks : Un tableau 2D représentant les briques du jeu, où chaque brique a des propriétés comme la position et le statut (intacte ou détruite)
// rightPressed, leftPressed : Drapeaux booléens indiquant si les touches flèche droite ou flèche gauche sont actuellement pressées, utilisés pour déplacer la raquette
let x, y, dx, dy, paddleX, score, bricks, rightPressed, leftPressed;

// Fonction pour initialiser ou réinitialiser le jeu
function init() {
    // Initialiser la position de la balle au centre inférieur du canvas
    x = canvas.width / 2;
    y = canvas.height - 30;
    
    // Définir la vitesse initiale de la balle (rapidité et direction)
    dx = 2;
    dy = -2;
    
    // Positionner la raquette au centre horizontal
    paddleX = (canvas.width - paddleWidth) / 2;
    
    // Initialiser le score à 0
    score = 0;
    
    // Initialiser les drapeaux de pression des touches
    rightPressed = false;
    leftPressed = false;
    
    // Initialiser les briques comme un tableau vide
    bricks = [];

    // Remplir le tableau de briques en fonction du nombre de rangées et de colonnes
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            // Chaque brique est un objet avec des coordonnées x, y et un statut (1 signifie qu'elle est encore là, 0 signifie qu'elle est cassée)
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

// Écouteurs d'événements pour la saisie au clavier
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Gestionnaire d'événements pour la pression d'une touche
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

// Gestionnaire d'événements pour le relâchement d'une touche
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Vérification des collisions entre la balle et les briques
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            // Vérifier si la brique est encore visible (status = 1)
            if (b.status === 1) {
                // Vérifier si la balle a touché la brique
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    // Inverser la direction de la balle en cas de collision
                    dy = -dy;
                    // Marquer la brique comme cassée (status = 0)
                    b.status = 0;
                    // Augmenter le score
                    score++;
                    // Vérifier si toutes les briques sont détruites
                    if (score === brickRowCount * brickColumnCount) {
                        alert("Vous avez gagné !");
                        if (confirm("Voulez-vous rejouer ?")) {
                            init(); // Réinitialiser le jeu si le joueur choisit de continuer
                        } else {
                            return; // Terminer le jeu si le joueur choisit de ne pas continuer
                        }
                    }
                }
            }
        }
    }
}

// Fonction pour dessiner la balle sur le canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2); // Dessiner la balle sous forme de cercle
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ball-color') || "#0095dd"; // Définir la couleur de la balle
    ctx.fill();
    ctx.closePath();
}

// Fonction pour dessiner la raquette sur le canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight); // Dessiner la raquette sous forme de rectangle
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--paddle-color') || "#0095dd"; // Définir la couleur de la raquette
    ctx.fill();
    ctx.closePath();
}

// Fonction pour dessiner les briques sur le canvas
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft; // Calculer la position x de la brique
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop; // Calculer la position y de la brique
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight); // Dessiner la brique sous forme de rectangle
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--brick-color') || "#0095dd"; // Définir la couleur de la brique
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Fonction pour afficher le score actuel sur le canvas
function drawScore() {
    ctx.font = "16px Arial"; // Définir la police pour le score
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--score-color') || "#0095dd"; // Définir la couleur du texte du score
    ctx.fillText("Score: " + score, 8, 20); // Afficher le score en haut à gauche
}

// Fonction principale pour dessiner les éléments du jeu sur le canvas et gérer la logique du jeu
function draw() {
    // Effacer le canvas pour la prochaine image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner les éléments du jeu
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    
    // Vérifier les collisions entre la balle et les briques
    collisionDetection();

    // Logique de mouvement de la balle
    // Inverser la direction de la balle si elle touche le mur gauche ou droit
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // Inverser la direction de la balle si elle touche le mur du haut
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        // Vérifier si la balle touche la raquette
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy; // Inverser la direction de la balle en cas de collision avec la raquette
        } else {
            // Si la balle rate la raquette (Game Over)
            if (confirm("Game Over. Voulez-vous rejouer ?")) {
                init(); // Réinitialiser le jeu si le joueur choisit de continuer
            } else {
                return; // Arrêter le jeu si le joueur ne veut pas continuer
            }
        }
    }

    // Logique de mouvement de la raquette
    // Déplacer la raquette vers la droite si la touche flèche droite est pressée et que la raquette est dans les limites
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    // Déplacer la raquette vers la gauche si la touche flèche gauche est pressée et que la raquette est dans les limites
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    // Mettre à jour la position de la balle
    x += dx;
    y += dy;

    // Demander la prochaine image pour maintenir la boucle du jeu
    requestAnimationFrame(draw);
}

// Initialiser le jeu et démarrer la boucle de dessin
init();
draw();
