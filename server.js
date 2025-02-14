const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const participants = {};
const botWrestlers = [
    "Macho Mango", "Captain Suplex", "The Iron Burrito", "El Fuego", "Big Boot Barry",
    "Chad ThunderSuplex", "The Masked Avenger", "Dr. Piledriver", "Slammin’ Sam", "The Ultimate Pancake",
    "Steel Chair Steve", "Body Slam Bob", "Powerbomb Pete", "Dynamite Dave", "Jack Knife Jackson",
    "Spandex Stan", "Turbo Terry", "Vortex Vince", "Atomic Adam", "Hurricane Hank",
    "Thunder Thighs", "Sledgehammer Sam", "The Crimson Chin", "Cactus Jack Jr.", "The Velvet Nightmare",
    "Bonecrusher Bill", "El Toro Fuerte", "The Meat Grinder", "Flex Armstrong", "Iron Kneecap Kevin",
    "The Flying Dutchman", "Muscle Mountain Mike", "The Neon Assassin", "Titanium Tony", "Brawler Bob"
];
const moves = [
    "Clothesline", "Suplex", "Powerbomb", "DDT", "Chokeslam", "RKO", "Spear", "Superkick", "German Suplex",
    "Body Slam", "Dropkick", "Spinebuster", "Frog Splash", "Elbow Drop", "Tombstone Piledriver",
    "Moonsault", "Enzuigiri", "Sharpshooter", "Camel Clutch", "Hurricanrana", "GTS", "F5", "Pedigree",
    "Stunner", "619", "Boston Crab", "Figure-Four Leg Lock", "Backbreaker", "Running Knee"
];
let gameActive = false;
let champion = "Kein Champion";
let history = [];

function startRumble() {
    if (gameActive) return sendChat("❌ Ein Rumble läuft bereits!");
    gameActive = true;
    Object.keys(participants).forEach(key => delete participants[key]);
    sendChat("🔥 **Der Rumble ist gestartet!** 🔥 Wer wird der nächste King of the Chat Champion? **60 Sekunden zum Eintragen!** Gib !rumble ein, um teilzunehmen!");
    setTimeout(fillWithBots, 40000);
    setTimeout(beginFight, 60000);
}

function joinRumble(user) {
    if (!gameActive) return sendChat("❌ Kein aktiver Rumble!");
    if (participants[user]) return sendChat("❌ Du bist bereits dabei!");
    participants[user] = { hp: 100 };
    sendChat(`💪 **${user}** sprintet zum Ring! Das Publikum rastet aus!`);
}

function fillWithBots() {
    while (Object.keys(participants).length < 30 && botWrestlers.length > 0) {
        let bot = botWrestlers.splice(Math.floor(Math.random() * botWrestlers.length), 1)[0];
        participants[bot] = { hp: 100 };
        sendChat(`🤖 **${bot}** betritt den Ring! Die Menge tobt!`);
    }
}

function beginFight() {
    sendChat("🔔 **Der Rumble beginnt!** Alle Kämpfer stehen bereit! 🎵 *Bell rings* 🔔");
    rumbleRound();
}

function rumbleRound() {
    if (Object.keys(participants).length < 2) {
        let winner = Object.keys(participants)[0];
        history.push(winner);
        champion = winner;
        sendChat(`🏆 **${winner}** überlebt das Chaos und ist der **NEUE KING OF THE CHAT CHAMPION**! 🏅`);
        sendChat(`📜 **Champion History:** ${history.join(", ")}`);
        gameActive = false;
        return;
    }
    
    let players = Object.keys(participants);
    let attacker = players[Math.floor(Math.random() * players.length)];
    let defender = players.filter(p => p !== attacker)[Math.floor(Math.random() * (players.length - 1))];
    
    let move = moves[Math.floor(Math.random() * moves.length)];
    let damage = Math.floor(Math.random() * 30) + 10;
    participants[defender].hp -= damage;
    
    sendChat(`🔥 **${attacker}** setzt einen brutalen **${move}** gegen **${defender}** ein! (-${damage} HP) 💥`);
    
    if (participants[defender].hp <= 0) {
        sendChat(`🚀 **${defender}** fliegt aus dem Ring! **ELIMINIERT!** ❌`);
        delete participants[defender];
        setTimeout(rumbleRound, 5000);
    } else {
        setTimeout(rumbleRound, 5000);
    }
}

function sendChat(message) {
    fetch("https://twitch-rumble-production.up.railway.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    })
    .then(response => response.text())
    .then(data => console.log("Server Response:", data))
    .catch(error => console.error("Fehler beim Senden der Nachricht:", error));
}

app.get("/", (req, res) => {
    res.send("🚀 Twitch Rumble Server läuft!");
});

app.post("/sendChat", (req, res) => {
    let message = req.body.message;
    console.log("Empfangene Nachricht:", message);
    res.send("OK");
});

app.listen(port, () => console.log(`✅ Server läuft auf Port ${port}`));
