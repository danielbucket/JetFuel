const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const path        = require('path');
const shortHash   = require('short-hash');

// DATABASE CONFIGURATION
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)

app.set('port', process.env.PORT || 3300)

app.use(express.static(path.join(__dirname + '/../public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended: true} ))

// client side route(?)
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/../public/index.html'))
})



// GET ALL EXISTING FOLDERS FROM THE SERVER
app.get('/api/v1/folders', (request, response) => {
  // CHECKS OUT
  db('folders').select()
  .then(data => {
    response.status(200).json({ data })
  })
  .catch(error => {
    response.status(500).json({ error })
  })
})

// GET ALL EXSTING URLS FROM THE SERVER
app.get('/api/v1/shortURL', (request, response) => {
  // CHECKS OUT
  db('urls').select()
    .then(data => {
      response.status(200).json({ data })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

// GET LONG URL FOR REDIRECT
// app.get('/api/v1/longURL/:id', (request, response) => {
//
//   db('urls').where('shortURL', request.body.shortURL).select('longURL')
//   .then(longURL => response.redirect(301, longURL))
// })




// POST A NEW FOLDER
app.post('/api/v1/folders', (request, response) => {
  // CHECKS OUT
  const newFolder = request.body

  for (let requireParameter of ['name']) {
    if (!newFolder[requireParameter]) {
      return response.status(422).json({
        error: `Missing required parameter ${requireParameter}`
      })
    }
  }

  db('folders').insert(newFolder, 'id')
    .then(data => {
      response.status(200).json({ id: data[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

// POST A NEW shortURL
app.post('/api/v1/shortURL', (request, response) => {
  // CHECKS OUT
  const newShortURL = {
    folder_id: request.body.folder_id,
    shortURL: shortHash(request.body.url),
    longURL: request.body.url
   }

  for (let requireParameter of ['shortURL']) {
    if (!newShortURL[requireParameter]) {
      return response.status(422).json({
        error: `Missing required parameter ${requireParameter}`
      })
    }
  }

  db('urls').insert(newShortURL, "*")
    .then(data => {
      response.status(200).json( data[0] )
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

// GET ALL URLS LINKED TO A SPECIFIC FOLDER
app.get('/api/v1/folders/:id/shortURL', (request, response) => {
  // CHECKS OUT
  db('urls').where('folder_id', request.params.id).select()
    .then(shortURLs => {
      response.status(200).json({ shortURLs })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

// GET A FOLDER SPECIFIED BY THE ID
app.get('/api/v1/folders/:id', (request, response) => {
  // CHECKS OUT
  db('folders').where('id', request.params.id).select()
    .then(folder => {
        if (folder.length) {
        response.status(200).json({ folder })
      } else {
        response.status(404).json({
          error: `Could not find a folder with the id of ${request.params.id}`
        })
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.listen(app.get('port'), () => {
  console.log(`Server is running on ${app.get('port')}`)
})

module.exports = app;
