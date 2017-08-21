const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const path        = require('path');
const shortHash   = require('short-hash');

// DATABASE CONFIGURATION
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)
// ^^ SET UP THE DEVELOPMENT CONFIGURATION STAGE

app.set('port', process.env.PORT || 3300)
// ^^ TELL THE SERVER WHICH PORT TO LISTEN TO DEFAULTING TO localhost:3300

app.use(express.static(path.join(__dirname + '/../public')))
// ^^ ALWAYS REFERENCE THE SPECIFIED DOCUMENTS
app.use(bodyParser.json())
// ^^
app.use(bodyParser.urlencoded( {extended: true} ))
// ^^

// client side route(?)
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/../public/index.html'))
})
// ^^ ALWAYS SERVE THE STATIC HTML FILE BY DEFAULT

// GET ALL EXISTING FOLDERS FROM THE SERVER
app.get('/api/v1/folders', (request, response) => {
// ^^ GET REQUEST TAKING IN TWO ARGUMENTS: THE ENDPOINT AND A CALLBACK
  db('folders').select()
  // ^^ ACCESS THE 'folders' TABLE IN THE DATABASE AND SELECT EVERTHING
  .then(data => response.status(200).json({ data }))
  // ^^ RESPOND WITH THE APPROPRIATE STATUS CODE AND THEN SEND THE JSONified DATA BACK
  .catch(error => response.status(500).json({ error }))
  // ^^ IN CASE OF AN ERROR RESPONSD WITH APPROPRIATE STATUS CODE AND THE JSONified ERROR MESSAGE
})

// RETURN POSTED FOLDER ONLY IF IT IS NOT A DUPLICATE
app.get('/api/v1/checkfolders/:folderName', (request, response) => {
// ^^ EXPRESS WILL RECOGNIZE :foldername AND ASSIGN IT TO RESPONSE.PARAMS
  db('folders').where('name', request.params.folderName).select()
  // ^^ SEARCH THE FOLDERS DATABASE FOR ALL ITEMS WHERE 'NAME' (A VARIABLE IN THE DATABASE TABLE) AND THE PARAMETERS MATCH
  .then(folders => {
    if (folders.length === 0) {
      response.status(500).json({ stat: "FOLDER_DOES_NOT_EXIST", folder: folders[0] })
    } else if (folders[0].name === request.params.folderName) {
      response.status(302).json({ stat: "FOLDER_EXISTS", folderID: folders[0].id })
    }
  })
  .catch(error => response.status(302).json({ error }))
})

// GET ALL EXSTING URLS FROM THE SERVER
app.get('/api/v1/shortURL', (request, response) => {

  db('urls').select()
//  ^^ ACCESS THE URLS TABLE IN THE DATABASE AND SELECT EVERYTHING
    .then(data => response.status(200).json({ data }))
    .catch(error => response.status(500).json({ error }))
})

// GET AN EXISTING URL THAT REDIRECTS
app.get('/api/v1/shortURL/:shorturl', (request, response) => {

  db('urls').where('shortURL', request.params.shorturl).select('longURL')
// ^^ FIND MATCHING VARIABLES AND RETURN THE TABLE ITEM SPECIFIED IN THE SELECT() FUNCTION
    .then(data => response.redirect('http://' + data[0].longURL))
// ^^ THE REDIRECT METHOD WILL SEND THE FLOW TO ANOTHER END POINT, OR IN THIS CASE, ANOTHER URL
    .catch(error => response.status(500).json({ error }))
})

// GET A FOLDER SPECIFIED BY THE FOLDER NAME
app.get('/api/v1/folders/:id', (request, response) => {

  db('folders').where('id', request.params.id).select()
    .then(folder => response.status(200).json(folder[0]))
    .catch(error => response.status(500).json({ error }))
})

// POST A NEW FOLDER
app.post('/api/v1/folders', (request, response) => {
  for (let requireParameter of ['name']) {
    if (!request.body[requireParameter]) {
      return response.status(422).json({
        error: `Missing required parameter ${requireParameter}`
      })
    }
  }
// ^^ THIS FOR LOOP IS MEANT TO VERIFIY THAT THE PACKAGE RECIEVED HAS THE SPECIFIED VARIABLE AND RESONDS WITH AN ERROR IF IT DOES NOT
  db('folders').insert(request.body, 'id')
    .then(data => response.status(200).json({ id: data[0] }))
    .catch(error => response.status(500).json({ error }))
})

// POST A NEW shortURL
app.post('/api/v1/shortURL', (request, response) => {
  const newShortURL = {
    folder_id: request.body.folder_id,
    shortURL: shortHash(request.body.shortURL),
    // ^^ CONVERT THE ORIGINAL LONG URL INTO A SHORT STRING
    longURL: request.body.shortURL
   }

  for (let requireParameter of ['shortURL']) {
    if (!newShortURL[requireParameter]) {
      return response.status(422).json({
        error: `Missing required parameter ${requireParameter}`
      })
    }
  }

  db('urls').insert(newShortURL, "*")
    .then(data => response.status(200).json( data[0] ))
    .catch(error => response.status(500).json({ error }))
})

// GET ALL URLS LINKED TO A SPECIFIC FOLDER
app.get('/api/v1/folders/:id/shortURL', (request, response) => {

  db('urls').where('folder_id', request.params.id).select()
    .then(urlData => response.status(200).json({ urlData }))
    .catch(error => response.status(500).json({ error }))
})

app.listen(app.get('port'), () => {
  console.log(`Server is running on ${app.get('port')}`)
})
// ^^ LISTEN TO THE PORT (AS DEFINED ABOVE) AND SEND A MESSAGE TO CONSOLE WHEN THE SERVER IS STARTED

module.exports = app;
