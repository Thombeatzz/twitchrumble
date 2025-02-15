const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const participants = {};
const botWrestlers = [
    "Roman Reigns", "Cody Rhodes", "Seth Rollins", "Brock Lesnar", "Drew McIntyre",
    "Bobby Lashley", "Gunther", "Randy Orton", "Kevin Owens", "Sami Zayn"
];
const moves = [
    "Clothesline", "Suplex", "Powerbomb", "DDT", "Chokeslam", "RKO", "Spear"
];
let gameActive = false;
let champion = "Kein Champion";

app.get("/startRumble", (req, res) => {
    if (gameActive) return res.send("❌ Ein Rumble läuft bereits!");
    gameActive = true;
    Object.keys(participants).forEach(key => delete participants[key]);
    console.log("🔥 Der Rumble ist gestartet!");
    res.send("🔥 Der Rumble ist gestartet! Tippe !rumble, um beizutreten!");
    setTimeout(beginFight, 5000);
});
    if (gameActive) return;
    gameActive = true;
    Object.keys(participants).forEach(key => delete participants[key]);
    console.log("🔥 Der Rumble ist gestartet!");
    setTimeout(beginFight, 5000);

app.get("/joinRumble", (req, res) => {
    let user = req.query.user;
    if (!user || gameActive) return res.send("❌ Fehler oder Spiel läuft bereits!");
    participants[user] = { hp: 100 };
    console.log(`${user} tritt dem Rumble bei!`);
    res.send(`${user} ist dabei!`);
});

function beginFight() {
    console.log("🔔 Der Rumble beginnt!");
    rumbleRound();
}

function rumbleRound() {
    if (Object.keys(participants).length < 2) {
        let winner = Object.keys(participants)[0];
        champion = winner;
        console.log(`🏆 ${winner} ist der neue Champion!`);
        gameActive = false;
        return;
    }
    let players = Object.keys(participants);
    let attacker = players[Math.floor(Math.random() * players.length)];
    let defender = players.filter(p => p !== attacker)[Math.floor(Math.random() * (players.length - 1))];
    let move = moves[Math.floor(Math.random() * moves.length)];
    let damage = Math.floor(Math.random() * 30) + 10;
    participants[defender].hp -= damage;
    console.log(`${attacker} trifft ${defender} mit ${move} (-${damage} HP)`);
    if (participants[defender].hp <= 0) {
        console.log(`${defender} wurde eliminiert!`);
        delete participants[defender];
    }
    setTimeout(rumbleRound, 3000);
}

app.listen(port, () => console.log(`✅ Server läuft auf Port ${port}`));
