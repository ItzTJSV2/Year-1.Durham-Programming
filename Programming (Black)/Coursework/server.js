const express = require('express');
const hostname = '127.0.0.1';
const port = 8080;
const app = require('./server.app');
app.listen(port, hostname, () => { // Server starts and listens on port 8080
    console.log(`Server running at http://${hostname}:${port}/`); // Server is running
  });
