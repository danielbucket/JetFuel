// import baseRoute from './urlEndpoints.js';
const baseRoute   = require('./urlEndpoints.js')
const http        = require('http');
const url         = require('url');
const server      = http.createServer();
const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended: true} ))
app.use(express.static('public'))

app.set('port', process.env.PORT || 3000)

app.locals.title = "Jet Fuel"

// client side route(?)
app.get('/', (request, response) => {
  response.sendFile(__dirname + './public/index.html')
})


// for when a user clicks on a folder to see a list of its contents
app.get(`${baseRoute}folder/:id`, (request, response) => {

  db('folders').where({id: request.body.id})
    .then(data => response.status(200).json({data}))
    .catch(error => console.log('error fetching folder contents: ', erorr))
})

// for the list of existing folders to load when the dropdown box is clicked
app.get(`${baseRoute}folder`, (request, response) => {

  db('folders').select()
    .then(data = response.status(200).json({data}))
    .catch(error => console.log('error getting all folders: ', error))
})

// to call a single url
app.get(`${baseRoute}shorturl/:id`, (request, response) => {

  db('shorturl').where({id: 'id'})
    .then(data => response.status(200).json({data}))
    .catch(error => console.log('error getting a single url: ', error))
})

// make a new folder
app.post(`${baseRoute}folder`, (request, response) => {

  db('folder').insert(request.body, ['*'])
    .then(data => response.status(200).json({data}))
    .catch(error => console.log('error posting a new folder: ', error))
})

// add new folder and new shortURL at the same time
app.post(`${baseRoute}folder`, () => {
  // does creating a new folder and new shorturl at the same time require that two seperate fetch calls should be made?
})

// add a new shorturl
app.post(`${baseRoute}shorturl`, (request, response) => {

  db('shorurl').insert(request.body, ['*'])
    .then(data => response.status(200).json({data}))
    .catch(error => console.log('error post a new shorturl', error))
})
