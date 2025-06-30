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

// ====================================================================
// --- Variables d'état du jeu (initialisation) ---
// ====================================================================
let players = {}; // { socket.id: { pseudo: "pseudo", score: 0, foundThisRound: false } }
let hostId = null; // ID du socket de l'hôte (le premier connecté)
let gameStarted = false; // Vrai si une partie est en cours
let waitingForHostToAdvanceFilm = false; // Indique si le jeu attend que l'hôte passe au film suivant
let currentFilmIndex = 0; // Index du film actuel dans le tableau 'films'
let currentImageIndex = 0; // Index de l'image actuelle pour le film en cours (de 0 à 4)
let currentRoundTimer; // Variable pour stocker l'intervalle du minuteur côté serveur
const roundDuration = 45; // Durée d'une manche par image en secondes
const pointsPerImage = [5, 4, 3, 2, 1]; // Points gagnés pour la 1ère (la plus dure) à la 5ème (la plus facile) image

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

    // Si c'est le premier joueur à se connecter, il devient l'hôte
    if (hostId === null) {
        hostId = socket.id;
        socket.emit('host connected'); // Informe le client qu'il est l'hôte
        console.log(`Le joueur avec l'ID ${hostId} est maintenant l'hôte.`);
    }

    // Envoie l'état initial du jeu aux nouveaux connectés (s'ils rejoignent en cours de partie)
    if (gameStarted) {
        socket.emit('game started'); // Les informe que le jeu est en cours
        if (films[currentFilmIndex]) { // S'assurer que le film existe
            // Envoie l'image actuelle, le temps restant, et désactive l'input s'ils ont déjà trouvé
            socket.emit('display image', {
                url: films[currentFilmIndex].images[currentImageIndex],
                points: pointsPerImage[currentImageIndex],
                initialTime: roundDuration // Pour que le client puisse synchroniser son minuteur
            });
            // Il faudrait aussi envoyer les scores et le temps restant exact pour les late-joiners
            io.emit('update scores', getPlayerScores()); // Met à jour les scores pour les late-joiners
        }
    }

    // Met à jour la liste des joueurs pour TOUS les clients (nouveaux et existants)
    // Cela se fait au début de chaque connexion et après chaque changement de joueur/pseudo
    io.emit('update player list', Object.values(players).map(p => p.pseudo));
    io.emit('update scores', getPlayerScores());


    // Écoute quand un client envoie son pseudo
    socket.on('set pseudo', (pseudo) => {
        // Validation du pseudo : non vide et non déjà pris
        if (pseudo && !Object.values(players).some(p => p.pseudo === pseudo)) {
            // C'est ici que le joueur est initialisé avec la nouvelle propriété foundFilmThisRound
            players[socket.id] = { pseudo: pseudo, score: 0, foundThisRound: false, foundFilmThisRound: false };
            socket.pseudo = pseudo; // Stocke le pseudo directement sur l'objet socket du client
            console.log(`Le joueur ${pseudo} (${socket.id}) s'est connecté au lobby.`);

            socket.emit('pseudo accepted'); // Confirme au client que le pseudo est bon
            io.emit('update player list', Object.values(players).map(p => p.pseudo)); // Met à jour la liste pour tous
            io.emit('update scores', getPlayerScores()); // Met à jour les scores pour tous
        } else {
            // Rejeter le pseudo si vide ou déjà pris
            socket.emit('pseudo taken', 'Ce pseudo est déjà pris ou invalide. Veuillez en choisir un autre.');
            console.log(`Tentative de pseudo invalide ou déjà pris: "${pseudo}"`);
        }
    });

    // Écoute quand un client se déconnecte
    socket.on('disconnect', () => {
        if (socket.pseudo) { // S'assure que le pseudo existe
            console.log(`Le joueur ${socket.pseudo} (${socket.id}) s'est déconnecté.`);
            delete players[socket.id]; // Supprime le joueur de la liste

            // Si l'hôte actuel se déconnecte, on en désigne un nouveau
            if (socket.id === hostId) {
                hostId = null; // L'ancien hôte est parti
                if (Object.keys(players).length > 0) { // S'il reste d'autres joueurs
                    hostId = Object.keys(players)[0]; // Le premier ID de socket restant devient le nouvel hôte
                    io.to(hostId).emit('host connected'); // Informe le nouvel hôte
                    console.log(`L'ancien hôte s'est déconnecté. Le nouvel hôte est ${players[hostId].pseudo} (${hostId}).`);
                } else {
                    console.log("Tous les joueurs se sont déconnectés. Il n'y a plus d'hôte.");
                    // Si plus personne, on réinitialise l'état du jeu pour une prochaine partie
                    gameStarted = false;
                    currentFilmIndex = 0;
                    currentImageIndex = 0;
                    clearInterval(currentRoundTimer); // Arrête le minuteur si en cours
                }
            }
            io.emit('update player list', Object.values(players).map(p => p.pseudo)); // Met à jour la liste pour tous
            io.emit('update scores', getPlayerScores()); // Met à jour les scores pour tous
            checkRoundEnd(); // Vérifie si tous les joueurs restants ont déjà trouvé/répondu
        } else {
            console.log('Un utilisateur anonyme s\'est déconnecté : ' + socket.id);
        }
    });

    // Écoute l'événement 'start game' de l'hôte
    socket.on('start game', () => {
        // Seul l'hôte peut lancer la partie, et seulement si elle n'est pas déjà lancée et qu'il y a des joueurs
        if (socket.id === hostId && !gameStarted && Object.keys(players).length > 0) {
            gameStarted = true;
            io.emit('game started'); // Informe tous les clients que la partie commence
            console.log("La partie a été lancée par l'hôte !");
            startNextRound(); // Démarre la première manche
        } else if (Object.keys(players).length === 0) {
            console.log("Impossible de lancer la partie, aucun joueur connecté.");
        } else if (gameStarted) {
            console.log("La partie est déjà en cours.");
        }
    });


    
    // NOUVEL AJOUT : Écoute l'événement 'host next film' envoyé par l'hôte
socket.on('host next film', () => {
    // Seul l'hôte peut déclencher cela, et seulement si le jeu est en attente
    if (socket.id === hostId && waitingForHostToAdvanceFilm) {
        waitingForHostToAdvanceFilm = false; // L'attente est terminée
        currentFilmIndex++; // Passe à l'index du prochain film
        console.log("L'hôte a demandé de passer au film suivant. Démarrage de la nouvelle manche.");
        startNextRound(); // Démarre la nouvelle manche (qui affichera la 1ère image du nouveau film)
    } else if (socket.id !== hostId) {
        console.log(`Joueur ${socket.pseudo} a tenté de passer au film suivant sans être l'hôte.`);
    } else if (!waitingForHostToAdvanceFilm) {
        console.log(`L'hôte a tenté de passer au film suivant mais le jeu n'était pas en état d'attente.`);
    }
});


// NOUVEL AJOUT : Écouteur pour que l'hôte demande le film suivant
socket.on('request next film', () => {
    if (socket.id === hostId && gameStarted) {
        console.log("Hôte a demandé le passage au film suivant. Progression du jeu.");
        moveToNextFilm(); // Déclenche le passage au film suivant
    } else {
        console.log("Tentative de passer au film suivant par un non-hôte ou hors partie.");
    }
});
// MODIFIÉ : Gestion du bouton "Passer l'image" par l'hôte pour forcer l'avancement
socket.on('skip current image', () => {
    if (socket.id === hostId && gameStarted) { // Vérifie que c'est bien l'hôte et que le jeu est en cours
        console.log(`L'hôte (${players[hostId].pseudo}) a demandé de passer l'image actuelle.`);

        // Arrête le minuteur immédiatement
        clearInterval(currentRoundTimer);
        io.emit('timer expired'); // Notifie les clients que le temps est écoulé (pour désactiver l'input etc.)

        // *** C'EST LA PARTIE CRUCIALE : Appeler directement la fonction qui fait avancer le jeu ***
        moveToNextImageOrRound(); 

    } else {
        console.log("Tentative de passer l'image par un non-hôte ou hors partie.");
    }
});

// NOUVEL AJOUT : Écoute l'événement 'host restart game' de l'hôte
socket.on('submit answer', (answer) => {
    const player = players[socket.id];

    // Le joueur ne peut pas répondre si le jeu n'est pas commencé, s'il n'a pas de pseudo,
    // ou s'il a déjà trouvé le film durant cette manche.
    if (gameStarted && player && !player.foundFilmThisRound) { // Utilisation directe de 'player' au lieu de 'players[socket.id]' après vérif
        const currentFilm = films[currentFilmIndex]; // Récupère l'objet film entier
        const currentFilmTitle = currentFilm.titre;
        const currentFilmAlias = currentFilm.alias || []; // Récupère les alias, ou un tableau vide

        // NOUVEL AJOUT : Envoyer la réponse à l'hôte pour le live feedback
        // Assurez-vous que la variable `hostId` est bien définie dans votre server.js
        if (hostId && hostId !== socket.id) { // N'envoie pas sa propre réponse à l'hôte s'il est aussi joueur
            io.to(hostId).emit('live answer', {
                pseudo: player.pseudo, // Utilise player.pseudo
                answer: answer
            });
        }

        // Normalise la réponse de l'utilisateur
        // Ajout de la suppression de ponctuation et des caractères spéciaux
        const normalizedUserAnswer = answer.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, '');

        // Prépare toutes les réponses acceptées (titre principal + alias), toutes normalisées
        const acceptedAnswers = [currentFilmTitle, ...currentFilmAlias].map(title =>
            title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, '')
        );

        let isCorrect = false;
        // Vérifie si la réponse normalisée de l'utilisateur correspond à l'une des réponses acceptées
        if (acceptedAnswers.includes(normalizedUserAnswer)) {
            isCorrect = true;
        }

        if (isCorrect) {
            const pointsEarned = pointsPerImage[currentImageIndex];
            player.score += pointsEarned;
            player.foundFilmThisRound = true; // Le joueur a trouvé le FILM pour cette manche
            player.foundThisRound = true; // Marque aussi qu'il a répondu pour l'image actuelle (pour checkRoundEnd)

            console.log(`${player.pseudo} a trouvé le film "${currentFilmTitle}" et gagne ${pointsEarned} points !`); // CORRIGÉ
            io.to(socket.id).emit('answer result', { correct: true, message: `Bonne réponse ! Tu gagnes ${pointsEarned} points.` });
            io.emit('update scores', getPlayerScores());

            // Si un joueur trouve le film, on vérifie si tous les joueurs encore en jeu ont maintenant trouvé.
            // Cela peut potentiellement faire avancer le jeu plus vite.
            checkRoundEnd(); // Laisse checkRoundEnd gérer l'arrêt du timer et l'avancement

        } else {
            console.log(`${player.pseudo} a répondu "${answer}" (incorrect).`); // CORRIGÉ
            // Le joueur n'a qu'une seule chance par IMAGE, donc on le marque comme ayant tenté pour cette image.
            player.foundThisRound = true; // Marque qu'il a répondu pour l'image actuelle

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
// ATTENTION : S'il y a un autre '});' ici, il ferme probablement l'io.on('connection'). Ne le supprimez pas.
// Normalement, vous avez un '});' après celui-ci pour la connexion socket.
});



// ====================================================================
// --- Fonctions de logique du jeu (côté serveur) ---
// ====================================================================

// Retourne un tableau trié des joueurs avec leurs scores
function getPlayerScores() {
    return Object.values(players)
        .map(p => ({ pseudo: p.pseudo, score: p.score }))
        .sort((a, b) => b.score - a.score); // Trie du plus grand score au plus petit
}

// MODIFIÉE : Fonction startNextRound()
function startNextRound() {
    clearInterval(currentRoundTimer); // Arrête le minuteur précédent si actif

    // Réinitialise l'état 'foundThisRound' pour tous les joueurs pour la NOUVELLE IMAGE.
    // Réinitialise 'foundFilmThisRound' pour tous les joueurs UNIQUEMENT AU DÉBUT D'UN NOUVEAU FILM.
    for (let id in players) {
        players[id].foundThisRound = false; // Réinitialise pour chaque nouvelle image
        // Si on passe à un NOUVEAU FILM, on réinitialise aussi foundFilmThisRound
        if (currentImageIndex === 0) { // Cela indique le début d'une nouvelle manche de film
             players[id].foundFilmThisRound = false;
        }
    }

    if (currentFilmIndex < films.length) {
        currentImageIndex = 0; // Toujours commencer par la première image du film pour une nouvelle manche
        // Assurez-vous que foundFilmThisRound est réinitialisé ICI aussi,
        // car startNextRound est appelée au début d'un nouveau film.
        for (let id in players) {
            players[id].foundFilmThisRound = false;
        }
        console.log(`Début de la manche avec le film : ${films[currentFilmIndex].titre}`);
        sendCurrentImageAndStartTimer();
    } else {
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

// MODIFIÉE : Fonction pour passer à l'image suivante ou au film suivant
function moveToNextImageOrRound() {
    const currentFilm = films[currentFilmIndex];

    currentImageIndex++;

    // Si toutes les images du film actuel ont été montrées OU si le film a été trouvé
    if (currentImageIndex >= 5 || Object.values(players).every(p => p.foundFilmThisRound)) {
        // ÉMETTRE L'ÉVÉNEMENT DE RÉVÉLATION
        io.emit('reveal film', currentFilm.titre);

        // NOUVELLE LOGIQUE : NE PAS appeler moveToNextFilm() directement ici.
        // Le serveur attendra un signal de l'hôte ('request next film').
        console.log("Film révélé. En attente du signal de l'hôte pour passer au film suivant.");

    } else {
        // Sinon, passer à la prochaine image du même film
        sendCurrentImageAndStartTimer();
    }
}

// Vérifie si tous les joueurs actifs ont soumis une réponse (correcte ou non)
function checkRoundEnd() {
    const activePlayersCount = Object.keys(players).length; // Nombre de joueurs connectés
    let playersAnsweredThisRound = 0;

    for (let id in players) {
        if (players[id].foundThisRound) { // Ceux qui ont trouvé ou tenté ont 'foundThisRound' à true
            playersAnsweredThisRound++;
        }
    }

    // Si tous les joueurs (ou tous ceux qui restent) ont soumis une réponse, on passe à la suite.
    if (playersAnsweredThisRound === activePlayersCount) {
        clearInterval(currentRoundTimer); // Arrête le minuteur si tous ont répondu avant la fin
        console.log("Tous les joueurs actifs ont soumis leur réponse ou trouvé le film. Passage à la suite.");
        moveToNextImageOrRound(); // Passe à l'image suivante ou au film suivant
    }
}

// Ancienne version à remplacer :
// function allActivePlayersFound() {
//     if (!gameStarted || Object.keys(players).length === 0) {
//         return false;
//     }
//     return Object.values(players).every(p => p.foundThisRound);
// }

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


// ====================================================================
// MODIFIÉE : Fonction moveToNextImageOrRound()
function moveToNextImageOrRound() {
    // Incrémente l'index de l'image pour la prochaine image à afficher
    currentImageIndex++;

    // Vérifie s'il reste des images POUR LE FILM ACTUEL
    if (currentImageIndex < films[currentFilmIndex].images.length) {
        // Il reste des images pour ce film, on affiche la prochaine
        console.log(`Passage à l'image ${currentImageIndex + 1} du film "${films[currentFilmIndex].titre}".`);
        sendCurrentImageAndStartTimer(); // Envoie la nouvelle image et relance le minuteur
    } else {
        // Toutes les 5 images de ce film ont été montrées
        console.log(`Fin des images pour le film "${films[currentFilmIndex].titre}".`);

        // Vérifie s'il reste d'autres films à jouer
        if (currentFilmIndex >= films.length - 1) { // Si c'était le DERNIER film
            endGame(); // Le jeu est terminé
        } else {
            // Il y a encore des films à jouer, mais on attend l'hôte pour passer au suivant
            waitingForHostToAdvanceFilm = true; // Met le jeu en état d'attente

            // Informe tous les clients que cette manche de film est finie
            // (peut-être pour afficher un message "Manche terminée, attente hôte...")
            io.emit('round ended, waiting for host'); 

            // Spécifiquement, informe l'hôte d'afficher son bouton
            if (hostId) { // S'assurer qu'un hôte est défini
                io.to(hostId).emit('show next film button');
            }
            console.log("Toutes les images du film actuel ont été montrées. En attente de l'hôte pour passer au film suivant.");
        }
    }
}

// MODIFIÉE : Fonction pour passer à l'image suivante ou au film suivant
function moveToNextImageOrRound() {
    const currentFilm = films[currentFilmIndex];

    // Incrémente l'index de l'image
    currentImageIndex++;

    // Si toutes les images du film actuel ont été montrées OU si le film a été trouvé
    // (La logique de foundFilmThisRound est gérée par la soumission de réponse)
    // ou si toutes les réponses ont été soumises/temps écoulé par checkRoundEnd()
    if (currentImageIndex >= 5 || Object.values(players).every(p => p.foundFilmThisRound)) { // 5 images fixes
        // Si le film est terminé (toutes images montrées ou trouvé)
        // ÉMETTRE L'ÉVÉNEMENT DE RÉVÉLATION AVANT DE PASSER AU FILM SUIVANT
        io.emit('reveal film', currentFilm.titre);

        // Attendre un court instant avant de passer au film suivant,
        // pour que les clients aient le temps d'afficher la révélation.
        setTimeout(() => {
            moveToNextFilm(); // Passe au film suivant après la révélation
        }, 3500); // Attendre 3.5 secondes (3s d'affichage + 0.5s de transition fondu)

    } else {
        // Sinon, passer à la prochaine image du même film
        sendCurrentImageAndStartTimer();
    }
}

// MODIFIÉE : Fonction pour passer au film suivant
function moveToNextFilm() {
    // Réinitialiser les états des joueurs pour le nouveau film
    for (const id in players) {
        players[id].foundFilmThisRound = false;
        players[id].foundThisRound = false; // Réinitialiser aussi pour les tentatives précédentes
    }

    currentImageIndex = 0; // Réinitialiser l'index de l'image pour le nouveau film
    currentFilmIndex++; // Passer au film suivant

    if (currentFilmIndex < films.length) {
        // S'il y a d'autres films, commencer la prochaine manche
        sendCurrentImageAndStartTimer(); // Commence le nouveau film avec sa première image
    } else {
        // Si tous les films ont été joués, la partie est terminée
        gameStarted = false;
        io.emit('game over', getPlayerScores());
        console.log("Tous les films ont été joués. Partie terminée.");
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

// ====================================================================
// --- Démarrage du serveur ---
// ====================================================================
server.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
    console.log(`Pour arrêter le serveur, appuie sur Ctrl+C dans ce terminal.`);
});