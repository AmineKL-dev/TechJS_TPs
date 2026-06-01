import inquirer from "inquirer";

/**
 * Récupère les données d'un Pokémon et les détails de ses 4 premières attaques
 */
async function getPokemon(idOrName) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
        
        if (!res.ok) {
            console.log(`\n [!] Erreur : Pokémon "${idOrName}" introuvable.`);
            return null;
        }

        const data = await res.json();

        // On récupère les détails de chaque move via une seconde série d'appels API
        const movePromises = data.moves.slice(0, 4).map(async (m) => {
            const moveRes = await fetch(m.move.url);
            const moveData = await moveRes.json();
            
            return {
                name: moveData.name,
                power: moveData.power || 40,      // Valeur par défaut si l'attaque ne fait pas de dégâts directs
                accuracy: moveData.accuracy || 100, // 100% si non précisé
                pp: moveData.pp || 20
            };
        });

        const detailedMoves = await Promise.all(movePromises);

        return {
            name: data.name.toUpperCase(),
            hp: 120, // Points de vie de base pour le duel
            moves: detailedMoves
        };
    } catch (error) {
        console.error("Erreur réseau :", error.message);
        return null;
    }
}

/**
 * Gère la logique d'une attaque
 */
function attack(attacker, defender, move) {
    console.log(`\n --- ${attacker.name} utilise ${move.name.toUpperCase()} ! ---`);

    // 1. Vérification de la précision
    const isHit = Math.random() * 100 <= move.accuracy;

    if (!isHit) {
        console.log(` > Mais l'attaque a échoué !`);
        return;
    }

    // 2. Calcul des dégâts 

    const damage = Math.floor((move.power * (0.8 + Math.random() * 0.4)) / 4);

    defender.hp -= damage;
    if (defender.hp < 0) defender.hp = 0;

    console.log(` > C'est super efficace ! ${defender.name} perd ${damage} HP.`);
}

/**
 * Boucle principale du jeu
 */
async function startGame() {
    console.clear();
    console.log("   BIENVENUE AU POKÉMON CLI   ");

    // Demander le Pokémon au joueur
    const input = await inquirer.prompt([
        {
            type: "input",
            name: "pokemonName",
            message: "Choisissez votre Pokémon (nom ou ID) :",
            default: "pikachu"
        }
    ]);

    console.log("\n Chargement des combattants...");
    const player = await getPokemon(input.pokemonName.toLowerCase());
    
    // Si le pokémon n'existe pas, on recommence
    if (!player) return startGame();

    // Le bot choisit un Pokémon aléatoire parmi les 151 premiers
    const bot = await getPokemon(Math.floor(Math.random() * 151) + 1);

    console.log(`\n LE COMBAT COMMENCE : ${player.name} VS ${bot.name} \n`);

    // Boucle de combat
    while (player.hp > 0 && bot.hp > 0) {
        // Affichage des barres de vie
        console.log(`--------------------------------`);
        console.log(` ${player.name}: ${player.hp} HP`);
        console.log(` ${bot.name}: ${bot.hp} HP`);
        console.log(`--------------------------------`);
        console.log(player.moves)
        // TOUR DU JOUEUR
        const { moveName } = await inquirer.prompt([
            {
                type: "list",
                name: "moveName",
                message: "Quelle attaque lancer ?",
                choices: player.moves.map(m => m.name)
            }
        ]);

        const selectedMove = player.moves.find(m => m.name === moveName);
        attack(player, bot, selectedMove);

        if (bot.hp <= 0) break;

        // TOUR DU BOT (aléatoire)
        const botMove = bot.moves[Math.floor(Math.random() * bot.moves.length)];
        attack(bot, player, botMove);

        if (player.hp <= 0) break;
    }

    // Résultat final
    console.log("\n================================");
    if (player.hp > 0) {
        console.log(` VICTOIRE ! ${player.name} a mis ${bot.name} KO !`);
    } else {
        console.log(` DÉFAITE... ${bot.name} a terrassé ${player.name}.`);
    }
    console.log("================================\n");

    // Rejouer ?
    const { restart } = await inquirer.prompt([
        {
            type: "confirm",
            name: "restart",
            message: "Voulez-vous faire un autre combat ?",
            default: true
        }
    ]);

    if (restart) {
        startGame();
    } else {
        console.log(" Merci d'avoir joué ! À bientôt.");
        process.exit();
    }
}

// Lancement du script
startGame();