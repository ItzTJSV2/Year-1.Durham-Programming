const express = require('express');

const hostname = '127.0.0.1';
const port = 8080;

const app = express();

var recipes = require('./potato_recipes.json');

app.get('/recipe', function(req, res) {
    query = parseInt(req.query.max)
    console.log('Recieved Query: ' + query)
    res.send(recipes[query])
});

app.use(express.static('Client'));

//////////////////////
app.listen(port, hostname, () => { // Server starts and listens on port 8080
    console.log(`Server running at http://${hostname}:${port}/`);
  });
