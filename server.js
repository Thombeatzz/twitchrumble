const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const participants = {};
const userSignatures = {};
const userFinishers = {}; // Entferne das doppelte Semikolon
const botWrestlers = [
    "Roman Reigns", "Cody Rhodes", "Seth Rollins", "Brock Lesnar", "Drew McIntyre",
    "Bobby Lashley", "Gunther", "Randy Orton", "Kevin Owens", "Sami Zayn",
    "Finn Bálor", "Damian Priest", "Rey Mysterio", "Dominik Mysterio", "Edge",
    "AJ Styles", "LA Knight", "Shinsuke Nakamura", "The Miz", "Karrion Kross",
    "Austin Theory", "Ricochet", "Braun Strowman", "Sheamus", "Pete Dunne",
    "Jey Uso", "Jimmy Uso", "Solo Sikoa", "Grayson Waller", "Santos Escobar",
    "Chad Gable", "Otis", "JD McDonagh", "Carmelo Hayes", "Baron Corbin",
    "Johnny Gargano", "Tommaso Ciampa", "Bron Breakker", "Ivar", "Cedric Alexander",
    "Xavier Woods", "Kofi Kingston", "Big E", "Elias", "Rick Boogs",
    "Angelo Dawkins", "Montez Ford", "Luke Gallows", "Karl Anderson", "Uncle Howdy",
    "Rey Fenix", "Penta El Zero Miedo", "Tyler Bate", "Ilja Dragunov", "Trick Williams",
    "Nathan Frazer", "Dragon Lee", "Axiom", "Charlie Dempsey", "Julius Creed",
    "Brutus Creed", "Von Wagner", "Tony D'Angelo", "Stacks", "Andre Chase",
    "Joe Gacy", "Dijak", "Apollo Crews", "Cameron Grimes", "Scrypts",
    "Josh Briggs", "Brooks Jensen", "Noam Dar", "Mark Coffey", "Wolfgang",
    "Gallus", "T-Bar", "Ludwig Kaiser", "Giovanni Vinci", "Shawn Spears",
    "The Undertaker", "Stone Cold Steve Austin", "The Rock", "John Cena", "Triple H",
    "Shawn Michaels", "Hulk Hogan", "Kurt Angle", "Batista", "Edge",
    "Booker T", "Goldberg", "Eddie Guerrero", "Chris Jericho", "Big Show",
    "Ric Flair", "Kane", "Sting", "Bret Hart", "Macho Man Randy Savage",
    "Joe Hendry"
];
const moves = [
    "Clothesline", "Suplex", "Powerbomb", "DDT", "Chokeslam", "RKO", "Spear", "Superkick", "German Suplex",
    "Body Slam", "Dropkick", "Spinebuster", "Frog Splash", "Elbow Drop", "Tombstone Piledriver",
    "Moonsault", "Enzuigiri", "Sharpshooter", "Camel Clutch", "Hurricanrana", "GTS", "F5", "Pedigree",
    "Stunner", "619", "Boston Crab", "Figure-Four Leg Lock", "Backbreaker", "Running Knee",
    "Dragon Suplex", "Corkscrew Moonsault", "Falcon Arrow", "Blue Thunder Bomb", "Michinoku Driver",
    "Canadian Destroyer", "Burning Hammer", "V-Trigger Knee", "Shining Wizard", "Discus Lariat",
    "Cutter", "Uranage Slam", "Deadlift German Suplex", "Pump Handle Slam", "Fireman's Carry Slam",
    "Package Piledriver", "One-Winged Angel", "Death Valley Driver", "Swanton Bomb", "Coast to Coast",
    "Avalanche Brainbuster", "Tornado DDT", "Snake Eyes", "Big Boot", "Lariat",
    "Spinning Heel Kick", "Rolling Thunder", "Springboard Clothesline", "Double Foot Stomp",
    "Tilt-a-Whirl Backbreaker", "Crossbody", "Military Press Slam", "Alabama Slam", "Pumphandle Suplex",
    "High Knee Strike", "Exploder Suplex", "Overhead Belly-to-Belly Suplex", "Swinging Neckbreaker",
    "Fisherman Suplex", "Half Nelson Suplex", "Full Nelson Slam", "Emerald Flowsion", "Diving Headbutt"
];
let gameActive = false;
let champion = "Kein Champion";
let history = [];

function startRumble() {
    console.log("📢 startRumble() wurde aufgerufen!");
    if (gameActive) return sendChat(" Ein Rumble läuft bereits!");
    gameActive = true;
    Object.keys(participants).forEach(key => delete participants[key]);
    sendChat(" **Der Rumble ist gestartet!**  Wer wird der nächste King of the Chat Champion? **60 Sekunden zum Eintragen!** Gib !rumble ein, um teilzunehmen!");
    let fillBotsTimer = setInterval(() => {
    console.log("⏳ 40 Sekunden vergangen - Fülle mit Bots wird aufgerufen");
    fillWithBots();
    clearInterval(fillBotsTimer);
}, 40000);
    let fightTimer = setInterval(() => {
    console.log("🚀 60 Sekunden vergangen - beginFight() wird aufgerufen");
    beginFight();
    clearInterval(fightTimer);
}, 60000);
}

app.get("/joinRumble", (req, res) => {
    let user = req.query.user;
    if (!user) return res.send("❌ Fehler: Kein Benutzername angegeben!");

    if (!gameActive) return res.send("❌ Kein aktiver Rumble!");
    if (participants[user]) return res.send("❌ Du bist bereits dabei!");

    
    res.send(`💪 **${user}** sprintet zum Ring! Das Publikum rastet aus!`);
});

const entranceMessages = [
    " sprintet zum Ring und reißt die Arme in die Luft – das Publikum rastet aus!",
    " marschiert mit finsterem Blick zum Ring. Sein Gegner weiß: Das wird kein Spaß!",
    " kommt mit Pyro-Explosionen auf der Stage und einem lauten Kampfschrei in die Arena!",
    " läuft mit einem entschlossenen Blick in den Ring – heute wird Geschichte geschrieben!",
    " rutscht unter dem untersten Seil hindurch und springt sofort auf die Beine!",
    " marschiert in den Ring und schlägt mit den Fäusten auf die Matte – Kampfbereit!",
    " joggt die Rampe runter und slidet in den Ring wie ein echter Profi!",
    " steigt auf die Ringecke und fordert das gesamte Teilnehmerfeld heraus!",
    " tänzelt zum Ring, doch sein Gegner unterbricht ihn mit einem Angriff!",
    " lässt sich extra Zeit beim Einzug und provoziert das Publikum!",
    " stolpert auf dem Weg zum Ring über seine eigenen Füße – Peinlicher Start!",
    " schnappt sich ein Mikrofon, doch wird direkt mit einem Dropkick niedergestreckt!",
    " kommt mit einem Einkaufswagen voller Waffen zum Ring, doch der Referee stoppt ihn!",
    " will spektakulär über das oberste Seil springen, bleibt aber hängen!",
    " sprintet zum Ring, doch sein Gegner empfängt ihn direkt mit einem harten Schlag!",
    " lässt sich von der Crowd feiern, während sich bereits zwei andere prügeln!",
    " dreht eine extra Runde um den Ring, bevor er sich endlich in den Kampf stürzt!",
    " marschiert mit einem Stahlstuhl in der Hand zum Ring – das könnte Ärger geben!",
    " wird von seinem Tag Team-Partner begleitet, doch der wird direkt vom Referee rausgeworfen!",
    " macht eine dramatische Pose auf der Rampe, während sein Gegner ihn genervt beobachtet!",
    " rutscht aus, steht aber sofort wieder auf und schreit: 'Das war geplant!'",
    " springt spektakulär von den Seilen in den Ring und landet perfekt auf den Füßen!",
    " zieht erst einmal seine Jacke aus und genießt den Applaus, bevor er in den Ring geht!",
    " klettert langsam die Ringtreppe hoch, nur um dann spektakulär ins Seilgeviert zu springen!"
];

function fillWithBots() {
    let totalEntrances = 0;
    function addNextBot() {
        if (Object.keys(participants).length >= 30 || botWrestlers.length === 0) return;
        
        let bot = botWrestlers.splice(Math.floor(Math.random() * botWrestlers.length), 1)[0];
        participants[bot] = { hp: 100 };
        let message = `#${totalEntrances + 1} **${bot}**${entranceMessages[Math.floor(Math.random() * entranceMessages.length)]}`;
        totalEntrances++;
        sendChat(message);
        
        setTimeout(addNextBot, 30000); // Alle 30 Sekunden neuer Kämpfer
    }
    addNextBot(); // Starte das Einfügen von Bots
}
    

    
    let totalEntrances = 0;
    function addNextBot() {
        if (Object.keys(participants).length >= 30 || botWrestlers.length === 0) return;
        
        let bot = botWrestlers.splice(Math.floor(Math.random() * botWrestlers.length), 1)[0];
        participants[bot] = { hp: 100 };
        let message = `#${totalEntrances + 1} **${bot}**${entranceMessages[Math.floor(Math.random() * entranceMessages.length)]}`;
        totalEntrances++;
        sendChat(message);
        
        entryIndex++;
        setTimeout(addNextBot, 30000); // Alle 30 Sekunden neuer Kämpfer
    } // <- Geschlossene } für addNextBot
    

function beginFight() {
    console.log("⚡ Der Rumble beginnt jetzt!");
    sendChat(" **Der Rumble beginnt!** Alle Kämpfer stehen bereit!  *Bell rings* ");
    rumbleRound();
}

function rumbleRound() {
    console.log("🔥 Nächste Kampfrunde beginnt!");
    const finisherChance = 0.1; // 10% Wahrscheinlichkeit für Finisher
    const signatureChance = 0.2; // 20% Wahrscheinlichkeit für Signature

    if (Object.keys(participants).length < 2) {
        let winner = Object.keys(participants)[0];
        history.push(winner);
        champion = winner;
        sendChat(` **${winner}** überlebt das Chaos und ist der **NEUE KING OF THE CHAT CHAMPION**! `);
        sendChat(` **Champion History:** ${history.join(", ")}`);
        gameActive = false;
        return;
    }
    
    let players = Object.keys(participants);
    let attacker = players[Math.floor(Math.random() * players.length)];
    let defender = players.filter(p => p !== attacker)[Math.floor(Math.random() * (players.length - 1))];
    
    let move;
    let damage = 0;
    if (Math.random() < finisherChance) {
        move = userFinishers[attacker] || "Finishing Move";
        let damage = Math.floor(Math.random() * 40) + 60; // 60-100 Schaden
    } else if (Math.random() < signatureChance) {
        move = userSignatures[attacker] || "Signature Move";
        let damage = Math.floor(Math.random() * 20) + 40; // 40-60 Schaden
    } else {
        move = moves[Math.floor(Math.random() * moves.length)];
        let damage = Math.floor(Math.random() * 30) + 10;
    }
    
    participants[defender].hp -= damage;
    
    sendChat(` **${attacker}** setzt einen **${move}** gegen **${defender}** ein! (-${damage} HP) `);
    if (move === userFinishers[attacker]) {
        sendChat(`💀 **${attacker}** hat seinen Finisher **${move}** eingesetzt! 💥`);
    } else if (move === userSignatures[attacker]) {
        sendChat(`🔥 **${attacker}** zeigt seinen Signature Move **${move}**!`);
    }
    
    if (participants[defender].hp <= 0) {
        sendChat(` **${defender}** fliegt aus dem Ring! **ELIMINIERT!** `);
        delete participants[defender];
        let remainingPlayers = Object.keys(participants).length;
        let roundTime = Math.max(2000, 7000 - remainingPlayers * 150); // Startet bei 7 Sek, wird mit weniger Kämpfern schneller
        setTimeout(rumbleRound, roundTime);
    } else {
        setTimeout(rumbleRound, 5000);
    }
}

function sendChat(message) {
    fetch("https://twitch-rumble-production.up.railway.app/sendChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    })
    .then(response => response.text())
    .then(data => console.log("Server Response:", data))
    .catch(error => console.error("Fehler beim Senden der Nachricht:", error));
}

app.get("/", (req, res) => {
    res.send(" Twitch Rumble Server läuft!");
});

app.get("/sendChat", (req, res) => {
    let message = req.query.message || "Fehlende Nachricht";
    console.log("Empfangene Nachricht:", message);
    res.send(decodeURIComponent(message));
});

app.post("/sendChat", (req, res) => {
    if (!req.body || !req.body.message) {
        return res.status(400).send("Fehlende Nachricht");
    }
    
    let message = req.body.message;
    console.log("Empfangene Nachricht:", message);
    res.send("OK");
});

app.listen(port, () => console.log(` Server läuft auf Port ${port}`));
