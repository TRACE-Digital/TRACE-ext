const express = require('express')
const app = express()
const port = 3000

app.get('/cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', ['http://example.com']);
  res.send('Success!')
})

app.get('/allow-all-cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', ['*']);
  res.send('Success!')
})

app.get('/no-cors', (req, res) => {
  res.send('Success!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  });