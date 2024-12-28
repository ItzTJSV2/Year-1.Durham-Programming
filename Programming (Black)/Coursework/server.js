// NPM Imports
const fs = require('fs')
const express = require('express');
const axios = require('axios')

const hostname = '127.0.0.1';
const port = 8080;
const app = express(); // Create express instance
app.use(express.static('Client'));

fileName = 'Client/Games.JSON'
if (!fs.existsSync(fileName)) { // Create the game directory file if it's not already created
    console.log("[STARTUP] Game Storage JSON not found, creating...")
    fs.writeFileSync(fileName, '[]');
}
// Approach from https://stackoverflow.com/questions/10011011/how-do-i-read-a-json-file-into-server-memory 
let file, gameCount, agentfile, mapfile;
try {
    file = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    agentfile = JSON.parse(fs.readFileSync('Client/Agents.JSON', 'utf8'));
    mapfile = JSON.parse(fs.readFileSync('Client/Maps.JSON', 'utf8'));
    gameCount = file.length;
    console.log("[STARTUP] No issues with files. | gameCount = " + gameCount)
} catch (e) {
    console.log(e);
}

app.get('/api/status', function(req, res) {
    console.log("Recieved GET for server status.")
    res.status(200).send()
});

app.get('/api/agents', function(req, res) {
    cconsole.log('Recieved GET for all Agents.')
    res.status(200).send(agentfile)
    console.log('Sent all Agents.')
});

app.get('/api/maps', function(req, res) {
    cconsole.log('Recieved GET for all Maps.')
    res.status(200).send(mapfile)
    console.log('Sent all Maps.')
});

// 127.0.0.1:8080/api/addGame?BO=5&MapPool=1|2|3|4|5|6|7&AgentOrder=1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20&MapOrder=1|2|3|4|5|6|7

app.get('/api/addGame', function(req, res) { // POST
    // 8080/addGame?BO=#&MapPool=###&MapOrder=###&MapOrder=###&AgentOrder=###
    // Format Checking
    if (req.query.BO == undefined || req.query.MapPool == undefined || req.query.AgentOrder == undefined || req.query.MapOrder == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: Field(s) empty.");
        return
    }
    if ((req.query.MapPool).split('|').length != 7) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: MapPool is not 7 maps.");
        return
    }
    if ((req.query.AgentOrder).split('|').length != 20 && req.query.AgentOrder != "") {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: AgentOrder is not 20 agents and is not empty.");
        return
    }
    if ((req.query.MapOrder).split('|').length != 7 && req.query.MapOrder != "") {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: AgentOrder is not 20 agents and is not empty.");
        return
    }

    addGame = {
        BO: req.query.BO,
        MapPool: req.query.MapPool,
        MapOrder: req.query.MapOrder,
        AgentOrder: req.query.AgentOrder,
        GameID: gameCount.toString()
    }
    console.log('Recieved POST for GameID: ' + gameCount)
    file.push(addGame)
    gameCount++
    fs.writeFileSync(fileName, JSON.stringify(file))
    res.status(200).send((gameCount-1).toString())
})

app.get('/api/getAllGames', function(req, res) { // GET
    console.log('Recieved GET for all Games.')
    res.status(200).send(file)
    console.log('Sent all Games.')
});

app.get('/api/getGame', function(req, res) { // GET
    // 8080/getGame?id=### will return the game with the id of ###
    query = parseInt(req.query.id)
    console.log('Recieved GET for GameID: ' + query)
    for (let x = 0; x < file.length; x++) {
        if (file[x].GameID == query) {
            res.status(200).send(file[x])
            console.log('Sent GameID: ' + query)
            return
        }
    }
    console.log('400 "Bad Request" error raised.');
    res.status(400).send("Error 400: GameID not found.")
});

app.get('/api/editGame', function(req, res) { // POST
    if (req.query.BO == undefined || req.query.MapPool == undefined || req.query.AgentOrder == undefined || req.query.MapOrder == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: Fields Empty.");
        return
    }
    if (req.query.GameID == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: No GameID.");
        return
    }
    if ((req.query.MapPool).split('|').length != 7) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: MapPool is not 7 maps.");
        return
    }
    if ((req.query.AgentOrder).split('|').length != 20 && req.query.AgentOrder != "") {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: AgentOrder is not 20 agents and is not empty.");
        return
    }
    if ((req.query.MapOrder).split('|').length != 7 && req.query.MapOrder != "") {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: AgentOrder is not 20 agents and is not empty.");
        return
    }
    editGame = {
        BO: req.query.BO,
        MapPool: req.query.MapPool,
        MapOrder: req.query.MapOrder,
        AgentOrder: req.query.AgentOrder,
        GameID: req.query.GameID
    }
    console.log('Recieved POST for GameID: ' + req.query.GameID)
    if (file[req.query.GameID] == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: GameID not found.")
        return
    }
    file[req.query.GameID] = editGame
    fs.writeFileSync(fileName, JSON.stringify(file))

    res.status(200).send("Edit Successful.")
});

app.get('/api/deleteGame', function(req, res) { // POST
    if (req.query.GameID == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: No GameID.");
        return
    }
    console.log('Recieved POST for GameID: ' + req.query.GameID)

    for (let x = 0; x < file.length; x++) {
        if (file[x].GameID == req.query.GameID) {
            file[x] = "{}"
            fs.writeFileSync(fileName, JSON.stringify(file))
            res.status(200).send("Delete Successful.")
            return
        }
    }
    console.log('400 "Bad Request" error raised.');
    res.status(400).send("Error 400: GameID not found.")
});

// 404 Detection
app.use(function(req, res, next) {
    console.log('404 "Not Found" error raised.');
    res.status(404);
    if (req.accepts('html')) { // Check if it's a client that can render HTML
        res.redirect('/404.html');
        return;
    }
    // If not, just send plain text message.
    res.send("Error 404: Page Not Found.");
});

////////////////////////// CREATE SERVER //////////////////////////
app.listen(port, hostname, () => { // Server starts and listens on port 8080
    console.log(`Server running at http://${hostname}:${port}/`); // Server is running
  });
