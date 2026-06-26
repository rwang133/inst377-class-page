const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile('public/home.html', { root: __dirname });
});

app.get('/stocks', (req, res) => {
  res.sendFile('public/stocks.html', { root: __dirname });
});

app.get('/dogs', (req, res) => {
  res.sendFile('public/dogs.html', { root: __dirname });
});

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});
