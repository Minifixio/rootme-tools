var express = require('express');
var app = express();
const port = 3001;

app.listen(port, () => {
    console.log(`Le serveur est live à l'adresse : https://localhost:${port}`);
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world');
});

app.post('/', function(req, res) {
    console.log(req.body)
    res.send('hello world');
});
console.log('je')
