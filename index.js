require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require("body-parser");
const URL = require('url').URL;
let dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({extended: false}));

let redirectedURL;

app.post("/api/shorturl", (req,res) => {
  const originalURL = req.body.url;
  redirectedURL = originalURL;
  try {
  const urlObject = new URL(originalURL);
  dns.lookup(urlObject.hostname, (err) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      res.json({ original_url: req.body.url, short_url: Math.floor(Math.random() * 100000) });
    }
  });
  } catch (er) {
    res.json({ error: 'invalid url' });
  }
});

app.get("/api/shorturl/:number?", (req,res) => {
    if( !Number.isNaN(Number(req.params.number))) {
      if(Number(req.params.number) !== 0) {
        res.redirect(redirectedURL);
      } else {
        res.json({ error: 'Wrong format' });
      } 
    } else {
      res.json({ error: 'Wrong format' });
    }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
