const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

// Configuration des films et images (EXEMPLE AVEC DES IMAGES LOCALES)
// Adapte ceci avec les chemins de TES images dans le dossier 'images'
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
    // Ajoute d'autres films ici, assure-toi que le titre est en MAJUSCULES
    // et qu'il y a 5 images pour chaque film.
];

// --- Variables d'état du jeu ---
let players = {}; // { socket.id: { pseudo: "pseudo", score: 0, foundThisRound: false } }
let hostId = null;
let gameStarted = false;
let waitingForHostToAdvanceFilm = false; // Vrai quand on attend le clic de l'hôte pour passer au film suivant
let currentFilmIndex = 0; // Index du film actuel dans le tableau 'films'
let currentImageIndex = 0; // Index de l'image actuelle (de 0 à 4)
let currentRoundTimer; // Pour gérer le minuteur côté serveur
const roundDuration = 45; // Durée d'une manche en secondes
const pointsPerImage = [5, 4, 3, 2, 1]; // Points pour les images 1 à 5

// Sert les fichiers statiques
app.use(express.static(path.join(__dirname, '/')));

// Route par défaut
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté : ' + socket.id);

    // Si c'est le premier joueur à se connecter, il devient l'hôte
    if (hostId === null) {
        hostId = socket.id;
        socket.emit('host connected');
        console.log(`Le joueur avec l'ID ${hostId} est maintenant l'hôte.`);
    }

    // Envoie l'état initial du jeu aux nouveaux connectés
    if (gameStarted) {
        socket.emit('game started'); // Les informe que le jeu est en cours
        // Et leur envoie l'image actuelle
        if (films[currentFilmIndex]) {
            socket.emit('display image', films[currentFilmIndex].images[currentImageIndex]);
        }
        // Il faudrait aussi envoyer le temps restant et les scores ici pour les late-joiners
    } else {
        // Envoie la liste des joueurs mise à jour au nouveau connecté
        io.emit('update player list', Object.values(players).map(p => p.pseudo));
    }


    // Quand un client envoie son pseudo
    socket.on('set pseudo', (pseudo) => {
        // S'assurer que le pseudo n'est pas vide et n'est pas déjà pris
        if (pseudo && !Object.values(players).some(p => p.pseudo === pseudo)) {
            players[socket.id] = { pseudo: pseudo, score: 0, foundThisRound: false, foundFilmThisRound: false };
            socket.pseudo = pseudo; // Stocke aussi sur l'objet socket pour un accès facile
            console.log(`Le joueur ${pseudo} (${socket.id}) s'est connecté au lobby.`);

            io.emit('update player list', Object.values(players).map(p => p.pseudo));
            // Envoie aussi les scores mis à jour
            io.emit('update scores', getPlayerScores());
        } else {
            // Rejeter le pseudo (doublon ou vide)
            socket.emit('pseudo taken', 'Ce pseudo est déjà pris ou invalide. Veuillez en choisir un autre.');
            console.log(`Tentative de pseudo invalide ou déjà pris: ${pseudo}`);
        }
    });

    // Quand un client se déconnecte
    socket.on('disconnect', () => {
        if (socket.pseudo) {
            console.log(`Le joueur ${socket.pseudo} (${socket.id}) s'est déconnecté.`);
            delete players[socket.id];

            // Si l'hôte se déconnecte, on désigne un nouvel hôte si des joueurs restent
            if (socket.id === hostId) {
                hostId = null;
                if (Object.keys(players).length > 0) {
                    hostId = Object.keys(players)[0]; // Le premier joueur restant devient le nouvel hôte
                    io.to(hostId).emit('host connected');
                    console.log(`L'ancien hôte s'est déconnecté. Le nouvel hôte est ${players[hostId].pseudo} (${hostId}).`);
                } else {
                    console.log("Tous les joueurs se sont déconnectés. Il n'y a plus d'hôte.");
                    // Si plus personne, on réinitialise l'état du jeu
                    gameStarted = false;
                    currentFilmIndex = 0;
                    currentImageIndex = 0;
                    clearInterval(currentRoundTimer);
                }
            }
            io.emit('update player list', Object.values(players).map(p => p.pseudo));
            io.emit('update scores', getPlayerScores());
        } else {
            console.log('Un utilisateur anonyme s\'est déconnecté : ' + socket.id);
        }
    });

    // Lancement de la partie par l'hôte
    socket.on('start game', () => {
        if (socket.id === hostId && !gameStarted && Object.keys(players).length > 0) { // S'assurer qu'il y a des joueurs
            gameStarted = true;
            io.emit('game started');
            console.log("La partie a été lancée par l'hôte !");
            startNextRound();
        } else if (Object.keys(players).length === 0) {
            console.log("Impossible de lancer la partie, aucun joueur connecté.");
        }
    });

    // Écoute l'événement 'host next film' de l'hôte
socket.on('host next film', () => {
    // Seul l'hôte peut passer au film suivant, et seulement si on est dans l'état d'attente
    if (socket.id === hostId && waitingForHostToAdvanceFilm) {
        waitingForHostToAdvanceFilm = false; // On n'attend plus l'hôte
        currentFilmIndex++; // Passe au film suivant
        console.log("L'hôte a demandé de passer au film suivant.");
        startNextRound(); // Démarre la nouvelle manche (nouveau film)
    }
});

// NOUVEL AJOUT : Écoute l'événement 'host restart game' de l'hôte
socket.on('host restart game', () => {
    if (socket.id === hostId) {
        console.log("L'hôte a demandé de relancer une nouvelle partie.");
        // Réinitialiser toutes les variables d'état du jeu
        gameStarted = false;
        currentFilmIndex = 0;
        currentImageIndex = 0;
        waitingForHostToAdvanceFilm = false;
        clearInterval(currentRoundTimer); // S'assurer que le minuteur est arrêté

        // Réinitialiser les scores des joueurs et leur état
        for (let id in players) {
            players[id].score = 0;
            players[id].foundThisRound = false;
            players[id].foundFilmThisRound = false;
        }

        // Envoyer un signal à tous les clients pour les ramener au lobby
        io.emit('return to lobby'); // Nouveau signal au client
        io.emit('update scores', getPlayerScores()); // Mettre à jour les scores (à zéro)
        io.emit('update player list', Object.values(players).map(p => p.pseudo));
    }
});

   // Gestion des réponses des joueurs
    socket.on('submit answer', (answer) => {
        // Le joueur ne peut pas répondre si le jeu n'est pas commencé, s'il n'a pas de pseudo,
        // ou s'il a déjà trouvé le film durant cette manche.
        if (gameStarted && players[socket.id] && !players[socket.id].foundFilmThisRound) {
            const correctAnswer = films[currentFilmIndex].titre;
            // Nettoyer les réponses pour comparaison (ignorer la casse, espaces en trop, accents)
            const cleanedAnswer = answer.toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const cleanedCorrectAnswer = correctAnswer.toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (cleanedAnswer === cleanedCorrectAnswer) {
                const pointsEarned = pointsPerImage[currentImageIndex];
                players[socket.id].score += pointsEarned;
                players[socket.id].foundFilmThisRound = true; // Le joueur a trouvé le FILM pour cette manche
                players[socket.id].foundThisRound = true; // Marque aussi qu'il a répondu pour l'image actuelle (pour checkRoundEnd)

                console.log(`${socket.pseudo} a trouvé le film "${correctAnswer}" et gagne ${pointsEarned} points !`);
                io.to(socket.id).emit('answer result', { correct: true, message: `Bonne réponse ! Tu gagnes ${pointsEarned} points.` });
                io.emit('update scores', getPlayerScores());

                // Si un joueur trouve le film, on vérifie si tous les joueurs encore en jeu ont maintenant trouvé.
                // Cela peut potentiellement faire avancer le jeu plus vite.
                checkRoundEnd();

            } else {
                console.log(`${socket.pseudo} a répondu "${answer}" (incorrect).`);
                // Le joueur n'a qu'une seule chance par IMAGE, donc on le marque comme ayant tenté pour cette image.
                players[socket.id].foundThisRound = true; // Marque qu'il a répondu pour l'image actuelle

                io.to(socket.id).emit('answer result', { correct: false, message: `Mauvaise réponse. Essaie encore avec la prochaine image !` });
                
                checkRoundEnd(); // Vérifie si tous les joueurs ont maintenant soumis leur réponse pour cette image
            }
        } else if (players[socket.id] && players[socket.id].foundFilmThisRound) {
            // Informe le joueur qu'il a déjà trouvé le film
            io.to(socket.id).emit('answer result', { correct: false, message: "Tu as déjà trouvé ce film. Attends la prochaine manche !" });
        } else {
            // Cas où le jeu n'est pas démarré ou joueur non valide
            console.log("Tentative de réponse ignorée (jeu non démarré ou joueur non valide).");
        }
    });
});


// --- Fonctions de logique du jeu ---

function getPlayerScores() {
    // Retourne un tableau trié des joueurs avec leurs scores
    return Object.values(players)
        .map(p => ({ pseudo: p.pseudo, score: p.score }))
        .sort((a, b) => b.score - a.score); // Trie du plus grand score au plus petit
}

// MODIFIÉE : Fonction startNextRound()
function startNextRound() {
    clearInterval(currentRoundTimer); // Arrête le minuteur précédent si actif

    // Réinitialise 'foundThisRound' et 'foundFilmThisRound' pour tous les joueurs au début d'un nouveau film/manche.
    // C'est important de le faire ici car c'est le point d'entrée d'une nouvelle "manche" de film.
    for (let id in players) {
        players[id].foundThisRound = false; // Réinitialise pour chaque nouvelle image
        players[id].foundFilmThisRound = false; // Réinitialise au début de chaque NOUVEAU FILM
    }

    if (currentFilmIndex < films.length) {
        currentImageIndex = 0; // Toujours commencer par la première image du film pour une nouvelle manche
        console.log(`Début de la manche avec le film : ${films[currentFilmIndex].titre}`);
        sendCurrentImageAndStartTimer();
    } else {
        // Tous les films ont été joués, la partie est terminée (géré par moveToNextImageOrRound ou directement si pas de films)
        endGame();
    }
}

// MODIFIÉE : Fonction sendCurrentImageAndStartTimer()
function sendCurrentImageAndStartTimer() {
    if (currentFilmIndex < films.length && currentImageIndex < films[currentFilmIndex].images.length) {
        const imageUrl = films[currentFilmIndex].images[currentImageIndex];
        const points = pointsPerImage[currentImageIndex];
        console.log(`Affichage de l'image ${currentImageIndex + 1} (${points} points) pour "${films[currentFilmIndex].titre}"`);

        // Réinitialiser 'foundThisRound' pour tous les joueurs à chaque nouvelle image,
        // SAUF pour ceux qui ont déjà trouvé la bonne réponse pour ce FILM.
        for (let id in players) {
            // Un joueur ne peut plus répondre pour ce film s'il l'a déjà trouvé.
            // On aura besoin d'une nouvelle propriété pour savoir si un joueur a VRAIMENT trouvé le film.
            // Pour l'instant, on va réinitialiser foundThisRound pour TOUS,
            // et on bloquera l'envoi de réponse si le joueur a déjà trouvé le film dans la manche.
            players[id].foundThisRound = false; // Réinitialise pour toutes les images de la manche
        }

        io.emit('display image', { url: imageUrl, points: points, initialTime: roundDuration });
        io.emit('reset input'); // Demande aux clients de réactiver leur input/bouton

        let timeLeft = roundDuration;
        io.emit('timer update', timeLeft);

        currentRoundTimer = setInterval(() => {
            timeLeft--;
            io.emit('timer update', timeLeft);

            if (timeLeft <= 0) {
                clearInterval(currentRoundTimer);
                console.log(`Temps écoulé pour l'image ${currentImageIndex + 1} du film "${films[currentFilmIndex].titre}".`);
                io.emit('timer expired');
                moveToNextImageOrRound();
            }
        }, 1000);
    } else {
        moveToNextImageOrRound();
    }
}

// MODIFIÉE : Fonction moveToNextImageOrRound()
function moveToNextImageOrRound() {
    // Incrémente l'index de l'image
    currentImageIndex++;

    // Vérifie s'il reste des images pour le film actuel
    if (currentFilmIndex < films.length && currentImageIndex < films[currentFilmIndex].images.length) {
        // Il reste des images pour le film actuel, on envoie la suivante
        console.log(`Passage à l'image ${currentImageIndex + 1} du film "${films[currentFilmIndex].titre}".`);
        sendCurrentImageAndStartTimer();
    } else {
        // Toutes les images de ce film ont été montrées.
        console.log(`Fin des images pour le film "${films[currentFilmIndex].titre}".`);

        // Si tous les films ont été joués, on termine le jeu
        if (currentFilmIndex >= films.length - 1) { // -1 car l'index est 0-based
            endGame();
        } else {
            // Il reste des films, on attend l'hôte pour passer au film suivant
            waitingForHostToAdvanceFilm = true;
            // Informe tous les clients que la manche est finie et qu'on attend l'hôte
            io.emit('round ended, waiting for host'); // Nouveau signal au client
            // Affiche le bouton "Passer au film suivant" pour l'hôte
            io.to(hostId).emit('show next film button');
            console.log("En attente de l'hôte pour passer au film suivant.");
        }
    }
}

// MODIFIÉE : Fonction pour vérifier si une manche doit se terminer
function checkRoundEnd() {
    const activePlayersCount = Object.keys(players).length; // Nombre de joueurs connectés
    let playersAnsweredThisRound = 0; // Compte ceux qui ont soumis une réponse (correcte ou non)

    for (let id in players) {
        if (players[id].foundThisRound) {
            playersAnsweredThisRound++;
        }
    }

    // Si tous les joueurs actifs ont soumis une réponse (qu'elle soit juste ou fausse)
    if (playersAnsweredThisRound === activePlayersCount) {
        clearInterval(currentRoundTimer); // Arrête le minuteur
        console.log("Tous les joueurs actifs ont soumis leur réponse ou trouvé le film. Passage à la suite.");
        // Appel direct à moveToNextImageOrRound()
        moveToNextImageOrRound();
    }
}

// NOUVELLE VERSION de allActivePlayersFound()
function allActivePlayersFound() {
    // Vérifie si tous les joueurs CONNECÉTS ET DONT LE PSEUDO A ÉTÉ ACCEPTÉ ont trouvé le film
    if (!gameStarted || Object.keys(players).length === 0) {
        return false;
    }
    // Si tous les joueurs *qui sont encore en jeu* ont trouvé le film
    // (c'est-à-dire que leur `foundThisRound` est vrai et qu'ils ont soumis une bonne réponse)
    // Pour l'instant, on laisse la logique telle quelle pour allActivePlayersFound car elle est liée à checkRoundEnd
    // et sera affinée par la modification de checkRoundEnd().
    // On veut que moveToNextImageOrRound se déclenche si le temps est écoulé OU si TOUS les joueurs ont tenté (bon ou faux)
    return Object.values(players).every(p => p.foundThisRound);
}

// ====================================================================
// NOUVELLE OU MODIFIÉE : Fonction pour vérifier si une manche doit se terminer
// ====================================================================
function checkRoundEnd() {
    const activePlayersCount = Object.keys(players).length; // Nombre de joueurs connectés
    let playersAnsweredThisRound = 0; // Compte ceux qui ont soumis une réponse (correcte ou non)

    for (let id in players) {
        if (players[id].foundThisRound) { // Ceux qui ont trouvé (correctement) ou tenté (incorrectement)
            playersAnsweredThisRound++;
        }
    }

    // Le tour se termine si :
    // 1. Tous les joueurs actifs ont soumis une réponse (qu'elle soit juste ou fausse).
    // 2. Le temps est écoulé (cette condition est gérée par le minuteur lui-même).
    if (playersAnsweredThisRound === activePlayersCount) {
        clearInterval(currentRoundTimer); // Arrête le minuteur si tous ont répondu avant la fin
        console.log("Tous les joueurs actifs ont soumis leur réponse ou trouvé le film. Passage à la suite.");
        moveToNextImageOrRound(); // Passe à l'image suivante ou au film suivant
    }
}


// MODIFIÉE : Fonction endGame()
function endGame() {
    gameStarted = false;
    clearInterval(currentRoundTimer);
    console.log("La partie est terminée ! Voici les scores finaux :");
    const finalScores = getPlayerScores();
    console.log(finalScores);
    io.emit('game over', finalScores); // Envoie les scores finaux aux clients

    // Masque le bouton "Passer au film suivant" pour l'hôte
    if (hostId) {
        io.to(hostId).emit('hide next film button');
    }

    // NE PAS réinitialiser hostId et players ICI, car ils doivent être conservés
    // pour que l'hôte puisse relancer et que les pseudos soient maintenus.
    // La réinitialisation se fera si l'hôte clique sur "Rejouer".
    currentFilmIndex = 0; // Réinitialise pour une potentielle nouvelle partie
    currentImageIndex = 0;
    waitingForHostToAdvanceFilm = false; // Réinitialise cet état
}