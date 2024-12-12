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
    fs.writeFileSync(fileName, '[]');
}
// Approach from https://stackoverflow.com/questions/10011011/how-do-i-read-a-json-file-into-server-memory 
let file;
try {
    file = JSON.parse(fs.readFileSync(fileName, 'utf8'));
} catch (e) {
    console.log(e);
}

app.get('/addGame', function(req, res) { // POST

});

app.get('/getAllGames', function(req, res) { // GET

});

app.get('/getGame', function(req, res) { // GET
    // 8080/getGame?id=### will return the game with the id of ###
    query = parseInt(req.query.id)
    console.log('Recieved GET for GameID: ' + query)
    //res.send(recipes[query])
});

app.get('editGame', function(req, res) { // POST

});

app.get('deleteGame', function(req, res) { // POST

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
    res.send("404 Not Found");
});

////////////////////////// CREATE SERVER //////////////////////////
app.listen(port, hostname, () => { // Server starts and listens on port 8080
    console.log(`Server running at http://${hostname}:${port}/`); // Server is running
  });
