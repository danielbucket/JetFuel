const http        = require('http')
const url         = require('url')
const server      = http.createServer()
const express     = require('express')
const app         = express()
const bodyParser  = require('body-parser')



app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended: true} ))
app.use(express.static('public'))

app.set('port', process.env.PORT || 3000)

app.locals.title = "Jet Fuel"


// create a folder
app.get('')
