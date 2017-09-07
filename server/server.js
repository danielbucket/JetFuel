const   express = require('express');
const   app = express();
const   bodyParser = require('body-parser');
const   path = require('path');
const   shortHash = require('short-hash');


// DATABASE CONFIGURATION
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)

app.set('port', process.env.PORT || 3300)

app.use(express.static(path.join(__dirname + '/../public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended: true} ))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/../public/index.html'))
})

// GET ALL EXISTING FOLDERS FROM THE SERVER // **
app.get('/api/v1/folders/', (request, response) => {
  db('folders').select()
  .then(data => response.status(200).json({ data }))
  .catch(error => response.status(500).json({ error }))
})

// NOT IN USE
// RETURN POSTED FOLDER ONLY IF IT IS NOT A DUPLICATE
app.get('/api/v1/checkfolders/:folderName', (request, response) => {
  db('folders').where('name', request.params.folderName).select()
  .then(folders => {
    if (folders.length === 0) {
      response.status(500).json({ stat: "FOLDER_DOES_NOT_EXIST", folder: folders[0] })
    } else if (folders[0].name === request.params.folderName) {
      response.status(302).json({ stat: "FOLDER_EXISTS", folderID: folders[0].id })
    }
  })
  .catch(error => response.status(302).json({ error }))
})

// GET ALL EXSTING URLS FROM THE SERVER --TESTED // **
app.get('/api/v1/shortURL/', (request, response) => {
  db('urls').select()
    .then(data => response.status(200).json({ data }))
    .catch(error => response.status(500).json({ error }))
})

// GET AN EXISTING URL THAT REDIRECTS // **
app.get('/api/v1/shortURL/:shorturl', (request, response) => {
  db('urls').where('shortURL', request.params.shorturl).select('longURL')
  .then(data => response.redirect('http://' + data[0].longURL))
  .catch(error => response.status(500).json({ error }))
})

// GET A FOLDER SPECIFIED BY THE FOLDER ID // **
app.get('/api/v1/folders/:id', (request, response) => {
  db('folders').where('id', request.params.id).select()
  .then(folder => response.status(200).json( folder[0] ))
  .catch(error => response.status(500).json({ error }))
})

// POST A NEW FOLDER // **
app.post('/api/v1/folders/', (request, response) => {
  for (let requireParameter of ['name']) {
    if (!request.body[requireParameter]) {
      return response.status(422).json({
        error: `Missing required parameter ${requireParameter}`
      })
    }
  }

  db('folders').insert(request.body, 'id')
  .then(data => response.status(200).json({ id: data[0] }))
  .catch(error => response.status(500).json({ error }))
})

// POST A NEW shortURL // **
app.post('/api/v1/shortURL', (request, response) => {
  for (let requireParameter of ['shortURL']) {
    if (!request.body[requireParameter]) {
      return response.status(422).json({
        error: `Missing required parameter ${requireParameter}`
      })
    }
  }

  const newShortURL = {
    folder_id: request.body.folder_id,
    shortURL: shortHash(request.body.shortURL),
    longURL: request.body.shortURL
   }

  db('urls').insert(newShortURL, "*")
  .then(data => response.status(200).json( data[0] ))
  .catch(error => response.status(500).json({ error }))
})

// GET ALL URLS LINKED TO A SPECIFIC FOLDER // **
app.get('/api/v1/folders/:id/shortURL', (request, response) => {

  db('urls').where('folder_id', request.params.id).select()
  .then(urlData => response.status(200).json({ urlData }))
  .catch(error => response.status(500).json({ error }))
})

app.listen(app.get('port'), () => {
  console.log(`Server is running on localhost:${app.get('port')}`)
})

module.exports = app;
