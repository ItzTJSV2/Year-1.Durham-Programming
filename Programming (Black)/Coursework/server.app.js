// NPM Imports
const fs = require('fs')
const express = require('express');
const path = require('path');

const app = express(); // Create express instance
app.use(express.static('Client'));
app.use(express.json());

// File Setup and Checking
fileName = 'Client/Games.JSON'
if (!fs.existsSync(fileName)) { // Create the game directory file if it's not already created
    console.log("[STARTUP] Game Storage JSON not found, creating...")
    fs.writeFileSync(fileName, '[]');
}
teamFiles = 'Client/Teams.JSON'
if (!fs.existsSync(teamFiles)) { // Create the team directory file if it's not already created
    console.log("[STARTUP] Team Storage JSON not found, creating...")
    fs.writeFileSync(teamFiles, '[]');
}
// Approach from https://stackoverflow.com/questions/10011011/how-do-i-read-a-json-file-into-server-memory 
let teamfile, teamCount, gameCount, agentfile, mapfile;
try {
    file = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    teamfile = JSON.parse(fs.readFileSync(teamFiles, 'utf8'));
    agentfile = JSON.parse(fs.readFileSync('Client/Agents.JSON', 'utf8'));
    mapfile = JSON.parse(fs.readFileSync('Client/Maps.JSON', 'utf8'));
    gameCount = file.length;
    teamCount = teamfile.length;
    console.log("[STARTUP] No issues with files. | gameCount = " + gameCount + " | teamCount = " + teamCount);
} catch (e) {
    console.log(e);
}
// API Status Request
app.get('/api/status', function(req, res) {
    console.log("Recieved GET for server status.")
    res.status(200).send()
});


// Static File Serving
app.get('/api/agents', function(req, res) {
    console.log('Recieved GET for all Agents.')
    res.status(200).json(agentfile)
    console.log('Sent all Agents.')
});

app.get('/api/maps', function(req, res) {
    console.log('Recieved GET for all Maps.')
    res.status(200).json(mapfile)
    console.log('Sent all Maps.')
});

// 127.0.0.1:8080/api/addGame?BO=5&MapPool=1|2|3|4|5|6|7&AgentOrder=1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20&MapOrder=1|2|3|4|5|6|7

// CRUD for Games
app.post('/api/addGame', function(req, res) { // POST
    // 8080/addGame?BO=#&MapPool=###&MapOrder=###&MapOrder=###&AgentOrder=###
    // Format Checking
    if (req.body.BO == undefined || req.body.MapPool == undefined || req.body.AgentOrder == undefined || req.body.MapOrder == undefined || req.body.Teams == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: Field(s) empty.");
        return
    }
    if ((req.body.MapPool).split('|').length != 7) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: MapPool is not 7 maps.");
        return
    }
    if ((req.body.AgentOrder).split('|').length != 20 && req.body.AgentOrder != "") {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: AgentOrder is not 20 agents and is not empty.");
        return
    }
    if ((req.body.Teams).split('|').length != 2) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: Teams is not 2.");
        return
    }

    addGame = {
        BO: req.body.BO,
        MapPool: req.body.MapPool,
        MapOrder: req.body.MapOrder,
        AgentOrder: req.body.AgentOrder,
        Teams: req.body.Teams,
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
    res.status(200).json(file)
    console.log('Sent all Games.')
});

app.get('/api/getGame', function(req, res) { // GET
    // 8080/getGame?id=### will return the game with the id of ###
    query = parseInt(req.query.id)
    console.log('Recieved GET for GameID: ' + query)
    for (let x = 0; x < file.length; x++) {
        if (file[x].GameID == query) {
            res.status(200).json(file[x])
            console.log('Sent GameID: ' + query)
            return
        }
    }
    console.log('400 "Bad Request" error raised.');
    res.status(400).send("Error 400: GameID not found.")
});

app.post('/api/editGame', function(req, res) { // POST
    if (req.body.BO == undefined || req.body.MapPool == undefined || req.body.AgentOrder == undefined || req.body.MapOrder == undefined || req.body.Teams == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: Fields Empty.");
        return
    }
    if (req.body.GameID == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: No GameID.");
        return
    }
    if ((req.body.MapPool).split('|').length != 7) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: MapPool is not 7 maps.");
        return
    }
    if ((req.body.AgentOrder).split('|').length != 20 && req.body.AgentOrder != "") {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: AgentOrder is not 20 agents and is not empty.");
        return
    }
    if ((req.body.Teams).split('|').length != 2) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: Teams is not 2.");
        return
    }
    editGame = {
        Teams: req.body.Teams,
        BO: req.body.BO,
        MapPool: req.body.MapPool,
        MapOrder: req.body.MapOrder,
        AgentOrder: req.body.AgentOrder,
        Teams: req.body.Teams,
        GameID: req.body.GameID
    }
    console.log('Recieved POST for GameID: ' + req.body.GameID)
    if (file[req.body.GameID] == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: GameID not found.")
        return
    }
    file[req.body.GameID] = editGame
    fs.writeFileSync(fileName, JSON.stringify(file))

    res.status(200).send("Edit Successful.")
});

// Sets the instance to empty string to not mess up the array
app.post('/api/deleteGame', function(req, res) { // POST
    if (req.body.GameID == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: No GameID.");
        return
    }
    console.log('Recieved POST for GameID: ' + req.body.GameID)
    for (let x = 0; x < file.length; x++) {
        if (file[x].GameID == req.body.GameID) {
            file[x] = "{}"
            fs.writeFileSync(fileName, JSON.stringify(file))
            res.status(200).send("Delete Successful.")
            return
        }
    }
    console.log('400 "Bad Request" error raised.');
    res.status(400).send("Error 400: GameID not found.")
});

// Actually deletes the instance (only use when you know what you're doing)
app.post('/api/harshDeleteGame', function(req, res) { // POST
    if (req.body.GameID == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: No GameID.");
        return
    }
    console.log('Recieved POST for GameID: ' + req.body.GameID)
    if (file[parseInt(req.body.GameID)] != undefined) {
        file.splice(parseInt(req.body.GameID), 1)
        fs.writeFileSync(fileName, JSON.stringify(file))
        res.status(200).send("Harsh Delete Successful.")
        return
    }
    console.log('400 "Bad Request" error raised.');
    res.status(400).send("Error 400: GameID not found.")
});

// CRUD for Teams
app.post('/api/addTeam', function(req, res) { // POST
    // Format Checking
    if (req.body.Name == undefined || req.body.Players == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: Field(s) empty.");
        return
    }
    addTeam = {
        TeamID: teamCount.toString(),
        Name: req.body.Name,
        Players: req.body.Players,
    }
    console.log('Recieved POST for TeamID: ' + teamCount)
    teamfile.push(addTeam)
    teamCount++
    fs.writeFileSync(teamFiles, JSON.stringify(teamfile))
    res.status(200).send((teamCount-1).toString())
})

app.get('/api/getAllTeams', function(req, res) { // GET
    console.log('Recieved GET for all Teams.')
    res.status(200).json(teamfile)
    console.log('Sent all Teams.')
})

app.get('/api/getTeam', function(req, res) { // GET
    // 8080/getTeam?id=### will return the game with the id of ###
    query = parseInt(req.query.id)
    console.log('Recieved GET for TeamID: ' + query)
    for (let x = 0; x < teamfile.length; x++) {
        if (teamfile[x].TeamID == query) {
            res.status(200).json(teamfile[x])
            console.log('Sent TeamID: ' + query)
            return
        }
    }
    console.log('400 "Bad Request" error raised.');
    res.status(400).send("Error 400: TeamID not found.")
});

app.post('/api/editTeam', function(req, res) { 
    if (req.body.Name == undefined || req.body.Players == undefined) {
        console.log('400 "Bad Request" error raised. | Fields Empty');
        res.status(400).send("Error 400: Fields Empty.");
        return;
    }
    if (req.body.TeamID == undefined) {
        console.log('400 "Bad Request" error raised. | No TeamID');
        res.status(400).send("Error 400: No TeamID.");
        return;
    }
    const editTeam = {
        TeamID: req.body.TeamID,
        Name: req.body.Name,
        Players: req.body.Players,
    };
    console.log('Received POST for TeamID: ' + req.body.TeamID);
    let teamFound = false;
    for (let i = 0; i < teamfile.length; i++) {
        if (teamfile[i].TeamID == req.body.TeamID) {
            teamfile[i] = editTeam;
            teamFound = true;
            break;
        }
    }
    if (!teamFound) {
        console.log('400 "Bad Request" error raised. | TeamID Not Found');
        res.status(400).send("Error 400: TeamID not found.");
        return;
    }
    fs.writeFileSync(teamFiles, JSON.stringify(teamfile));
    res.status(200).send("Edit Successful.");
});


app.post('/api/deleteTeam', function(req, res) { // POST
    if (req.body.TeamID == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: No TeamID.");
        return
    }
    console.log('Recieved POST for TeamID: ' + req.body.TeamID)

    let teamFound = false;
    for (let i = 0; i < teamfile.length; i++) {
        if (teamfile[i].TeamID == req.body.TeamID) {
            teamfile[parseInt(req.body.TeamID)] = "{}"
            fs.writeFileSync(teamFiles, JSON.stringify(teamfile))
            teamFound = true;
            break;
        }
    }
    if (!teamFound) {
        console.log('400 "Bad Request" error raised. | TeamID Not Found');
        res.status(400).send("Error 400: TeamID not found.");
        return;
    }
    res.status(200).send("Delete Successful.")
});

// Actually deletes the instance (only use when you know what you're doing)
app.post('/api/harshDeleteTeam', function(req, res) { // POST
    if (req.body.TeamID == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: No TeamID.");
        return
    }
    console.log('Recieved POST for TeamID: ' + req.body.TeamID)
    if (teamfile[parseInt(req.body.TeamID)] != undefined) {
        teamfile.splice(parseInt(req.body.TeamID), 1)
        fs.writeFileSync(teamFiles, JSON.stringify(teamfile))
        res.status(200).send("Harsh Delete Successful.")
        return
    }
    console.log('400 "Bad Request" error raised.');
    res.status(400).send("Error 400: TeamID not found.")
});


// Asset Serving
app.get('/api/getImage', function(req, res) { // GET
    if (req.query.FileName == undefined) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: No FileName.");
        return
    }
    console.log('Recieved GET for FileName: ' + req.query.FileName)
    const assetsFolder = 'Client/Assets'
    asset = assetsFolder + '/' + req.query.FileName
    if (!req.query.FileName.endsWith(".jpeg")) {
        asset = asset + ".jpeg"
    }
    if (!fs.existsSync(asset)) {
        console.log('400 "Bad Request" error raised.');
        res.status(400).send("Error 400: FileName not found.")
        return;
    }
    res.status(200).sendFile(path.join(__dirname, asset));
    return;
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


module.exports = app; // Export the express instance