const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

// ====================================================================
// --- CONFIGURATION DES FILMS ET IMAGES (À PERSONNALISER) ---
// ====================================================================
// Assurez-vous que les chemins d'accès aux images sont corrects
// et que les titres des films sont en MAJUSCULES pour faciliter la comparaison des réponses.


// ====================================================================
// --- Variables d'état du jeu (initialisation) ---
// ====================================================================
let players = {}; // { socket.id: { pseudo: "pseudo", score: 0, foundThisRound: false, foundFilmThisRound: false } }
let hostId = null; // ID du socket de l'hôte (le premier connecté)
let gameStarted = false; // Vrai si une partie est en cours

// --- VARIABLES D'ÉTAT UNIFIÉES ET CORRIGÉES ---
let waitingForHostToAdvance = false; // Indique si le jeu attend que l'hôte passe au film suivant
let currentFilmIndex = 0; // Index du film actuel dans le tableau 'films'
let currentImageIndex = 0; // Index de l'image actuelle pour le film en cours (de 0 à 4)
let timerInterval; // Variable unique pour stocker l'intervalle du minuteur côté serveur
let currentTimer = 0; // Temps restant actuel du minuteur
const MAX_TIMER = 45; // Constante pour la durée du minuteur

const roundDuration = 45; // Durée d'une manche par image en secondes (peut-être la même que MAX_TIMER)
const pointsPerImage = [5, 4, 3, 2, 1]; // Points gagnés pour la 1ère (la plus dure) à la 5ème (la plus facile) image

// --- FILMS (Assurez-vous que votre tableau 'films' est bien défini ici ou importé) ---
// Exemple (ajustez avec votre vrai contenu):
const films = [
    {
        titre: "ANYONE BUT YOU", // Titre en MAJUSCULES pour la comparaison
        alias: ["Tout sauf toi", "Anyone But You"], // NOUVEL AJOUT : Alias français et autre casse
        images: [
            "images/Film1_1.jpg", // La plus difficile (indice minimal)
            "images/Film1_2.jpg",
            "images/Film1_3.jpg",
            "images/Film1_4.jpg",
            "images/Film1_5.jpg"  // La plus facile (indice maximal)
        ]
    },
    {
        titre: "CAPTAIN AMERICA 4", // Titre en MAJUSCULES
        alias: ["Captain America Brave New World", "Captain America: Brave New World", "Brave New World"], // NOUVEL AJOUT : Liste des alias
        images: [
            "images/Film2_1.jpg", // Utilisez les noms de fichiers que vous avez créés
            "images/Film2_2.jpg",
            "images/Film2_3.jpg",
            "images/Film2_4.jpg",
            "images/Film2_5.jpg"
        ]
    },

    {
        titre: "AGE OF EMPIRE 2", // Titre en MAJUSCULES
        alias: ["AOE", "AOE 2", "Age of Empire", "Age of empire 2"], // NOUVEL AJOUT : Liste des alias
        images: [
            "images/Game1_1.png", // Utilisez les noms de fichiers que vous avez créés
            "images/Game1_2.png",
            "images/Game1_3.png",
            "images/Game1_4.png",
            "images/Game1_5.jpg"
        ]
    },

    {
        titre: "ELDEN RING", // Titre en MAJUSCULES
        alias: ["ER", "elden ring"], // NOUVEL AJOUT : Liste des alias
        images: [
            "images/Game2_1.png", // Utilisez les noms de fichiers que vous avez créés
            "images/Game2_2.png",
            "images/Game2_3.jpeg",
            "images/Game2_4.png",
            "images/Game2_5.jpg"
        ]
    },

    {
        titre: "MONSTRE : L'HISTOIRE DE JEFFREY DAHMER", // Titre en MAJUSCULES
        alias: ["Dahmer", "Monstre", "Monstre : L'histoire de Jeffrey Dahmer", "Jeffrey Dahmer"], // NOUVEL AJOUT : Liste des alias
        images: [
            "images/Serie1_1.jpg", 
            "images/Serie1_2.jpg",
            "images/Serie1_3.jpg",
            "images/Serie1_4.jpg",
            "images/Serie1_5.jpg"
        ]
    },
    {
        titre: "LOKI", // Titre en MAJUSCULES
        alias: ["Loki", "Marvel Loki"], 
        images: [
            "images/Serie2_1.jpg", 
            "images/Serie2_2.jpg",
            "images/Serie2_3.jpg",
            "images/Serie2_4.jpg",
            "images/Serie2_5.jpg"
        ]
    },

    {
        titre: "LES ETERNELS", // Titre en MAJUSCULES
        alias: ["Les eternels", "Eternels", "Eternals", "The eternals"], 
        images: [
            "images/Film3_1.jpg", 
            "images/Film3_2.jpg",
            "images/Film3_3.jpg",
            "images/Film3_4.jpg",
            "images/Film3_5.jpg"
        ]
    },

    {
        titre: "POKEMON DONJON MYSTERE", // Titre en MAJUSCULES
        alias: ["Pokemon dj mystere", "Pokemon donjon mystere", "Pokemon dungeon mystere", "Pokemon mystery dungeon"], // NOUVEL AJOUT : Liste des alias
        images: [
            "images/Game3_1.png", 
            "images/Game3_2.png",
            "images/Game3_3.png",
            "images/Game3_4.jpg",
            "images/Game3_5.png"
        ]
    },

    {
        titre: "THE ELDER SCROLLS V : SKYRIM", // Titre en MAJUSCULES
        alias: ["Skyrim", "The elder scrolls V", "The elder scrolls 5", "TES 5"], // NOUVEL AJOUT : Liste des alias
        images: [
            "images/Games4_1.png", 
            "images/Games4_2.png",
            "images/Games4_3.jpg",
            "images/Games4_4.jpg",
            "images/Games4_5.jpg"
        ]
    },

    {
        titre: "BETTER CALL SAUL", // Titre en MAJUSCULES
        alias: ["Better call saul"], 
        images: [
            "images/Serie3_1.jpg", 
            "images/Serie3_2.jpg",
            "images/Serie3_3.jpg",
            "images/Serie3_4.jpg",
            "images/Serie3_5.jpg"
        ]
    },


    {
        titre: "SPYRO", // Titre en MAJUSCULES
        alias: ["Spyro"], // NOUVEL AJOUT : Liste des alias
        images: [
            "images/Games5_1.png", 
            "images/Games5_2.png",
            "images/Games5_3.png",
            "images/Games5_4.png",
            "images/Games5_5.jpg"
        ]
    },

    {
        titre: "GODZILLA X KONG : LE NOUVEL EMPIRE", // Titre en MAJUSCULES
        alias: ["Godzilla x kong", "Godzilla x Kong :  le nouvel empire"], 
        images: [
            "images/Film4_1.jpg", 
            "images/Film4_2.jpg",
            "images/Film4_3.jpg",
            "images/Film4_4.jpg",
            "images/Film4_5.jpg"
        ]
    },

    {
        titre: "THE STANLEY PARABLE",
        alias: ["The stanley parable", "Stanley Parable"], 
        images: [
            "images/Games6_1.jpg", 
            "images/Games6_2.jpg",
            "images/Games6_3.png",
            "images/Games6_4.jpg",
            "images/Games6_5.jpg"
        ]
    },

    {
        titre: "SEVERANCE", // Titre en MAJUSCULES
        alias: ["severance"], 
        images: [
            "images/Serie4_1.jpg", 
            "images/Serie4_2.jpg",
            "images/Serie4_3.jpg",
            "images/Serie4_4.jpg",
            "images/Serie4_5.jpg"
        ]
    },

    {
        titre: "HARRY POTTER ET LES RELIQUES DE LA MORT PARTIE 2", // Titre en MAJUSCULES
        alias: ["HARRY POTTER 8 ", "Harry potter et les reliques de la mort", "harry potter les reliques de la mort", "hp 8"], 
        images: [
            "images/Film5_1.jpg", 
            "images/Film5_2.jpg",
            "images/Film5_3.jpg",
            "images/Film5_4.jpg",
            "images/Film5_5.jpg"
        ]
    },

    {
        titre: "CLAIR OBSCUR EXPEDITION 33",
        alias: ["clair obscur expedition 33", "Clair obscur", "Expedition 33"], 
        images: [
            "images/Games7_1.jpg", 
            "images/Games7_2.jpg",
            "images/Games7_3.jpg",
            "images/Games7_4.jpg",
            "images/Games7_5.jpg"
        ]
    },

    {
        titre: "LEAGUE OF LEGENDS",
        alias: ["League of legends", "lol"], 
        images: [
            "images/Games8_1.jpg", 
            "images/Games8_2.jpg",
            "images/Games8_3.jpg",
            "images/Games8_4.jpg",
            "images/Games8_5.jpg"
        ]
    },

    {
        titre: "DESPERATE HOUSEWIVES", // Titre en MAJUSCULES
        alias: ["Desperate housewives", "Desesperate housewifes", "Desperate housewife", "Desperate housewive"], 
        images: [
            "images/Serie5_1.jpg", 
            "images/Serie5_2.jpg",
            "images/Serie5_3.jpg",
            "images/Serie5_4.jpg",
            "images/Serie5_5.jpg"
        ]
    },

    {
        titre: "RUST",
        alias: ["rust"], 
        images: [
            "images/Games9_1.jpg", 
            "images/Games9_2.jpg",
            "images/Games9_3.jpg",
            "images/Games9_4.jpg",
            "images/Games9_5.jpg"
        ]
    },

    {
        titre: "BLACK ADAM", // Titre en MAJUSCULES
        alias: ["Black adam"], 
        images: [
            "images/Film6_1.jpg", 
            "images/Film6_2.jpg",
            "images/Film6_3.jpg",
            "images/Film6_4.jpg",
            "images/Film6_5.jpg"
        ]
    },

    {
        titre: "SEA OF THIEVES",
        alias: ["Sea of thieves", "Sot"], 
        images: [
            "images/Games10_1.jpg", 
            "images/Games10_2.jpg",
            "images/Games10_3.jpg",
            "images/Games10_4.jpg",
            "images/Games10_5.jpg"
        ]
    },

    {
        titre: "GAME OF THRONES", // Titre en MAJUSCULES
        alias: ["Game of thrones", "game of throne", "got"], 
        images: [
            "images/Serie6_1.jpg", 
            "images/Serie6_2.jpg",
            "images/Serie6_3.jpg",
            "images/Serie6_4.jpg",
            "images/Serie6_5.jpg"
        ]
    },

    {
        titre: "RUSSIAN DOLL", // Titre en MAJUSCULES
        alias: ["russian doll", "poupée russe", "russian dolls"], 
        images: [
            "images/Serie7_1.jpg", 
            "images/Serie7_2.jpg",
            "images/Serie7_3.jpg",
            "images/Serie7_4.jpg",
            "images/Serie7_5.jpg"
        ]
    },

    {
        titre: "THE 100", // Titre en MAJUSCULES
        alias: ["the 100", "les 100"], 
        images: [
            "images/Serie8_1.jpg", 
            "images/Serie8_2.jpg",
            "images/Serie8_3.jpg",
            "images/Serie8_4.jpg",
            "images/Serie8_5.jpg"
        ]
    },

    {
        titre: "JURASSIC WORLD FALLEN KINGDOM", // Titre en MAJUSCULES
        alias: ["jurassic world fallen kingdom", "Jurassic world 2"], 
        images: [
            "images/Film7_1.jpg", 
            "images/Film7_2.jpg",
            "images/Film7_3.jpg",
            "images/Film7_4.jpg",
            "images/Film7_5.jpg"
        ]
    },

    {
        titre: "SUBNAUTICA",
        alias: ["subnautica"], 
        images: [
            "images/Games11_1.jpg", 
            "images/Games11_2.jpg",
            "images/Games11_3.jpg",
            "images/Games11_4.jpg",
            "images/Games11_5.jpg"
        ]
    },

    {
        titre: "THE BEAR", // Titre en MAJUSCULES
        alias: ["the bear"], 
        images: [
            "images/Serie9_1.jpg", 
            "images/Serie9_2.jpg",
            "images/Serie9_3.jpg",
            "images/Serie9_4.jpg",
            "images/Serie9_5.jpg"
        ]
    },

    {
        titre: "TOMB RAIDER",
        alias: ["tomb raider"], 
        images: [
            "images/Games12_1.png", 
            "images/Games12_2.png",
            "images/Games12_3.png",
            "images/Games12_4.png",
            "images/Games12_5.jpg"
        ]
    },

    {
        titre: "GRAND THEFT AUTO VICE CITY",
        alias: ["grand theft auto vice city", "gta vice city", "vice city"], 
        images: [
            "images/Games13_1.png", 
            "images/Games13_2.jpg",
            "images/Games13_3.jpg",
            "images/Games13_4.jpg",
            "images/Games13_5.jpg"
        ]
    },

    {
        titre: "THE BOYS", // Titre en MAJUSCULES
        alias: ["the boys"], 
        images: [
            "images/Serie10_1.jpg", 
            "images/Serie10_2.jpg",
            "images/Serie10_3.jpg",
            "images/Serie10_4.jpg",
            "images/Serie10_5.jpg"
        ]
    },

    {
        titre: "THE END OF THE FUCKING WORLD", // Titre en MAJUSCULES
        alias: ["The end of the fucking world", "teotfw"], 
        images: [
            "images/Serie11_1.jpg", 
            "images/Serie11_2.jpg",
            "images/Serie11_3.jpg",
            "images/Serie11_4.jpg",
            "images/Serie11_5.jpg"
        ]
    },

    {
        titre: "TRAP", // Titre en MAJUSCULES
        alias: ["trap"], 
        images: [
            "images/Film8_1.jpg", 
            "images/Film8_2.jpg",
            "images/Film8_3.jpg",
            "images/Film8_4.jpg",
            "images/Film8_5.jpg"
        ]
    },

    {
        titre: "WAKFU",
        alias: ["wakfu"], 
        images: [
            "images/Games14_1.png", 
            "images/Games14_2.png",
            "images/Games14_3.png",
            "images/Games14_4.jpg",
            "images/Games14_5.png"
        ]
    },

    {
        titre: "THE GOOD PLACE", // Titre en MAJUSCULES
        alias: ["The good place"], 
        images: [
            "images/Serie12_1.jpg", 
            "images/Serie12_2.jpg",
            "images/Serie12_3.jpg",
            "images/Serie12_4.jpg",
            "images/Serie12_5.jpg"
        ]
    },

    {
        titre: "WORLD OF WARCRAFT",
        alias: ["world of warcraft", "wow"], 
        images: [
            "images/Games15_1.png", 
            "images/Games15_2.png",
            "images/Games15_3.png", 
            "images/Games15_4.jpg",
            "images/Games15_5.png"
        ]
    },

    {
        titre: "THE LAST OF US", // Titre en MAJUSCULES
        alias: ["the last of us", "tlou"], 
        images: [
            "images/Serie13_1.jpg", 
            "images/Serie13_2.jpg",
            "images/Serie13_3.jpg",
            "images/Serie13_4.jpg",
            "images/Serie13_5.jpg"
        ]
    },





    
    // AJOUTEZ VOS AUTRES FILMS ICI EN SUIVANT LE MÊME FORMAT.
    // Chaque film doit avoir un 'titre' en MAJUSCULES et un tableau 'images' de 5 chemins.
];

// Sert les fichiers statiques (ton HTML, CSS, JS frontend, et tes images !)
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static('public')); // Permet de servir les fichiers du dossier 'public'

// Route par défaut qui envoie le fichier index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ====================================================================
// --- Gestion des connexions Socket.IO et de la logique de jeu ---
// ====================================================================
io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté : ' + socket.id);

    if (hostId === null) {
        hostId = socket.id;
        socket.emit('host connected');
        console.log(`Le joueur avec l'ID ${hostId} est maintenant l'hôte.`);
    }

    if (gameStarted) {
        socket.emit('game started');
        if (films[currentFilmIndex]) {
            socket.emit('display image', {
                url: films[currentFilmIndex].images[currentImageIndex],
                points: pointsPerImage[currentImageIndex],
                initialTime: currentTimer // Envoyer le temps restant exact
            });
            io.emit('update scores', getPlayerScores());
        }
    }

    io.emit('update player list', Object.values(players).map(p => p.pseudo));
    io.emit('update scores', getPlayerScores());

    socket.on('set pseudo', (pseudo) => {
        if (pseudo && !Object.values(players).some(p => p.pseudo === pseudo)) {
            players[socket.id] = { pseudo: pseudo, score: 0, foundThisRound: false, foundFilmThisRound: false };
            socket.pseudo = pseudo;
            console.log(`Le joueur ${pseudo} (${socket.id}) s'est connecté au lobby.`);
            socket.emit('pseudo accepted');
            io.emit('update player list', Object.values(players).map(p => p.pseudo));
            io.emit('update scores', getPlayerScores());
        } else {
            socket.emit('pseudo taken', 'Ce pseudo est déjà pris ou invalide. Veuillez en choisir un autre.');
            console.log(`Tentative de pseudo invalide ou déjà pris: "${pseudo}"`);
        }
    });

    socket.on('disconnect', () => {
        if (socket.pseudo) {
            console.log(`Le joueur ${socket.pseudo} (${socket.id}) s'est déconnecté.`);
            delete players[socket.id];

            if (socket.id === hostId) {
                hostId = null;
                if (Object.keys(players).length > 0) {
                    hostId = Object.keys(players)[0];
                    io.to(hostId).emit('host connected');
                    console.log(`L'ancien hôte s'est déconnecté. Le nouvel hôte est ${players[hostId].pseudo} (${hostId}).`);
                } else {
                    console.log("Tous les joueurs se sont déconnectés. Il n'y a plus d'hôte.");
                    gameStarted = false;
                    currentFilmIndex = 0;
                    currentImageIndex = 0;
                    clearInterval(timerInterval); // Utiliser timerInterval
                    waitingForHostToAdvance = false; // Réinitialiser le drapeau
                }
            }
            io.emit('update player list', Object.values(players).map(p => p.pseudo));
            io.emit('update scores', getPlayerScores());
            // Pas besoin de checkRoundEnd ici directement, la déconnexion d'un joueur ne devrait pas faire avancer le jeu
        } else {
            console.log('Un utilisateur anonyme s\'est déconnecté : ' + socket.id);
        }
    });

    socket.on('start game', () => {
        if (socket.id === hostId && !gameStarted && Object.keys(players).length > 0) {
            gameStarted = true;
            io.emit('game started');
            console.log("La partie a été lancée par l'hôte !");
            moveToNextFilm(); // Lance le premier film de la partie
        } else if (Object.keys(players).length === 0) {
            console.log("Impossible de lancer la partie, aucun joueur connecté.");
        } else if (gameStarted) {
            console.log("La partie est déjà en cours.");
        }
    });

    // --- Écouteur pour que l'hôte demande le film suivant (UNIFIÉ) ---
    socket.on('request next film', () => {
        if (socket.id === hostId && gameStarted && waitingForHostToAdvance) {
            console.log("Hôte a demandé le passage au film suivant. Progression du jeu.");
            moveToNextFilm(); // Déclenche le passage au film suivant
        } else {
            console.log("Tentative de passer au film suivant par un non-hôte, hors partie, ou pas en attente d'avancement.");
        }
    });

    // --- Écouteur pour le bouton "Passer l'image" par l'hôte ---
    socket.on('skip current image', () => {
        if (socket.id === hostId && gameStarted) {
            console.log(`L'hôte (${players[hostId].pseudo}) a demandé de passer l'image actuelle.`);
            clearInterval(timerInterval); // Utiliser timerInterval
            io.emit('timer expired'); // Notifie les clients que le temps est écoulé
            moveToNextImageOrRound(); // Force le passage à la prochaine image ou révélation du film
        } else {
            console.log("Tentative de passer l'image par un non-hôte ou hors partie.");
        }
    });

    // --- Gestion de la soumission de réponse ---
    socket.on('submit answer', (answer) => {
        const player = players[socket.id];

        if (gameStarted && player && !player.foundFilmThisRound) {
            const currentFilm = films[currentFilmIndex];
            const currentFilmTitle = currentFilm.titre;
            const currentFilmAlias = currentFilm.alias || [];

            if (hostId && hostId !== socket.id) {
                io.to(hostId).emit('live answer', {
                    pseudo: player.pseudo,
                    answer: answer
                });
            }

            const normalizedUserAnswer = answer.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, '');
            const acceptedAnswers = [currentFilmTitle, ...currentFilmAlias].map(title =>
                title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, '')
            );

            let isCorrect = false;
            if (acceptedAnswers.includes(normalizedUserAnswer)) {
                isCorrect = true;
            }

            if (isCorrect) {
                const pointsEarned = pointsPerImage[currentImageIndex];
                player.score += pointsEarned;
                player.foundFilmThisRound = true; // Le joueur a trouvé le FILM pour cette manche
                player.foundThisRound = true; // Marque qu'il a répondu pour l'image actuelle

                console.log(`${player.pseudo} a trouvé le film "${currentFilmTitle}" et gagne ${pointsEarned} points !`);
                io.to(socket.id).emit('answer result', { correct: true, message: `Bonne réponse ! Tu gagnes ${pointsEarned} points.` });
                io.emit('update scores', getPlayerScores());

                // Un joueur a trouvé le film, on va directement à la logique de révélation/attente
                moveToNextImageOrRound();

            } else {
                console.log(`${player.pseudo} a répondu "${answer}" (incorrect).`);
                player.foundThisRound = true; // Marque qu'il a répondu pour l'image actuelle

                io.to(socket.id).emit('answer result', { correct: false, message: `Mauvaise réponse. Essaie encore avec la prochaine image !` });

                // Vérifie si tous les joueurs ont répondu pour cette image.
                // Si oui, on avance à la prochaine image ou au prochain film.
                checkRoundEnd(); 
            }
        } else if (players[socket.id] && players[socket.id].foundFilmThisRound) {
            io.to(socket.id).emit('answer result', { correct: false, message: "Tu as déjà trouvé ce film. Attends la prochaine manche !" });
        } else {
            console.log("Tentative de réponse ignorée (jeu non démarré ou joueur non valide).");
        }
    });
}); // Fin de io.on('connection')

// ====================================================================
// --- Fonctions de logique du jeu (côté serveur) ---
// ====================================================================

function getPlayerScores() {
    return Object.values(players)
        .map(p => ({ pseudo: p.pseudo, score: p.score }))
        .sort((a, b) => b.score - a.score);
}

// --- FONCTION startTimer UNIFIÉE ET CORRIGÉE ---
function startTimer() {
    clearInterval(timerInterval); // S'assurer qu'aucun minuteur précédent ne tourne
    currentTimer = MAX_TIMER; // Réinitialiser le temps
    io.emit('timer update', currentTimer); // Envoyer la première valeur du timer
    timerInterval = setInterval(() => {
        currentTimer--;
        io.emit('timer update', currentTimer);
        if (currentTimer <= 0) {
            clearInterval(timerInterval); // Arrêter le minuteur quand il atteint 0
            console.log("Minuteur terminé. Vérification de la fin du round.");
            checkRoundEnd(); // Vérifier la fin du round
        }
    }, 1000);
}

// --- FONCTION sendCurrentImageAndStartTimer UNIFIÉE ET CORRIGÉE ---
function sendCurrentImageAndStartTimer() {
    // S'assurer qu'on réinitialise foundThisRound pour TOUS les joueurs pour la nouvelle image
    // Sauf si le joueur a déjà trouvé le FILM pour cette manche
    for (let id in players) {
        if (!players[id].foundFilmThisRound) { // Si le joueur n'a PAS encore trouvé le FILM
            players[id].foundThisRound = false; // Alors il peut répondre pour cette nouvelle image
        }
    }

    if (currentFilmIndex < films.length && currentImageIndex < films[currentFilmIndex].images.length) {
        const imageUrl = films[currentFilmIndex].images[currentImageIndex];
        const points = pointsPerImage[currentImageIndex]; // Assurez-vous que pointsPerImage est bien défini
        console.log(`Affichage de l'image ${currentImageIndex + 1} (${points} points) pour "${films[currentFilmIndex].titre}"`);

        io.emit('display image', { url: imageUrl, points: points, initialTime: MAX_TIMER }); // Utilise MAX_TIMER pour la synchronisation client
        io.emit('reset input'); // Demande aux clients de réactiver leur input/bouton

        startTimer(); // Lance le minuteur pour cette image

    } else {
        // Si toutes les images d'un film sont passées sans que le film soit trouvé,
        // ou si l'index est invalide, on force la fin du film.
        console.log("Toutes les images pour le film actuel ont été affichées ou index invalide. Passage à la révélation.");
        moveToNextImageOrRound(); 
    }
}


// --- FONCTION checkRoundEnd UNIFIÉE ET CORRIGÉE ---
function checkRoundEnd() {
    const activePlayersCount = Object.keys(players).length;
    let playersWhoCanStillAnswer = 0;
    
    for (let id in players) {
        if (!players[id].foundFilmThisRound && !players[id].foundThisRound) {
            // Ce joueur peut encore répondre pour ce film OU pour cette image
            playersWhoCanStillAnswer++;
        }
    }

    // Si le minuteur est à 0 OU si tous les joueurs qui pouvaient répondre ont répondu
    // On passe à la logique d'avancement
    if (currentTimer <= 0 || playersWhoCanStillAnswer === 0) {
        clearInterval(timerInterval); // S'assurer que le minuteur est arrêté
        console.log("Fin de round détectée (timer expiré ou tous les joueurs ont répondu).");
        moveToNextImageOrRound(); // Passe à l'image suivante ou à la révélation du film
    }
}

// --- FONCTION moveToNextImageOrRound UNIFIÉE ET CORRIGÉE ---
function moveToNextImageOrRound() {
    const currentFilm = films[currentFilmIndex];

    // Arrêter le minuteur systématiquement dès qu'on entre dans cette fonction
    // pour gérer la transition de fin d'image/film.
    clearInterval(timerInterval); 

    // Vérifie si le film actuel est terminé (soit trouvé par un joueur, soit toutes les images ont été montrées)
    const filmFinished = Object.values(players).some(p => p.foundFilmThisRound) || currentImageIndex >= 4; // index 4 pour la 5ème image

    if (filmFinished) {
        // Si le film est terminé, on va le révéler et attendre l'hôte
        if (!waitingForHostToAdvance) { // S'assurer qu'on ne le fait qu'une fois
            io.emit('reveal film', currentFilm.titre);
            console.log("Film révélé. En attente du signal de l'hôte pour passer au film suivant.");
            waitingForHostToAdvance = true; // Définir l'état d'attente de l'hôte
        }
        // Si déjà en attente, ne rien faire.
    } else {
        // Si le film n'est pas encore terminé, passer à l'image suivante
        currentImageIndex++;
        sendCurrentImageAndStartTimer();
    }
}

// --- FONCTION moveToNextFilm UNIFIÉE ET CORRIGÉE ---
function moveToNextFilm() {
    // Réinitialiser le drapeau d'attente car on passe à un nouveau film
    waitingForHostToAdvance = false; 

    // Réinitialiser les états des joueurs pour le nouveau film
    for (const id in players) {
        players[id].foundFilmThisRound = false;
        players[id].foundThisRound = false; 
    }

    currentImageIndex = 0; // Réinitialiser l'index de l'image pour le nouveau film
    currentFilmIndex++; // Passer au film suivant

    if (currentFilmIndex < films.length) {
        console.log(`Démarrage du film suivant : ${films[currentFilmIndex].titre}`);
        sendCurrentImageAndStartTimer(); // Commence le nouveau film avec sa première image
    } else {
        // Tous les films ont été joués, la partie est terminée
        endGame();
    }
}

// --- FONCTION endGame UNIFIÉE ET CORRIGÉE ---
function endGame() {
    gameStarted = false;
    clearInterval(timerInterval); // Utiliser timerInterval
    waitingForHostToAdvance = false; // Réinitialiser l'état d'attente

    console.log("La partie est terminée ! Voici les scores finaux :");
    const finalScores = getPlayerScores();
    console.log(finalScores);
    io.emit('game over', finalScores);

    // Si tu avais un bouton spécifique pour l'hôte à cacher, assure-toi que le client le gère
    // io.to(hostId).emit('hide next film button'); // Si cette émission est nécessaire

    currentFilmIndex = 0;
    currentImageIndex = 0;
    // Ne pas réinitialiser players et hostId ici pour permettre le rejouer avec les mêmes joueurs.
}

// ====================================================================
// --- Démarrage du serveur ---
// ====================================================================
server.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
    console.log(`Pour arrêter le serveur, appuie sur Ctrl+C dans ce terminal.`);
});