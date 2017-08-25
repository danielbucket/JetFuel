process.env.NODE_ENV = 'test';
const chai      = require('chai')
const should    = chai.should()
const chaiHTTP  = require('chai-http')
const server    = require('../server/server');

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)

chai.use(chaiHTTP)

describe('Client Routes', () => {
  xit('should return status(200)', done => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200)
      done()
    })
  })

  xit('sad panda path', done => {
    chai.request(server)
    .get('/home')
    .end((err, response) => {
      response.should.have.status(404)
      done()
    })
  })

  it('', () => {
    
  })
})

describe('API Routes', () => {
  before( done => {
    // RUN MIGRATIONS HERE WHEN TESTING AN ACTUAL DATABASE
    done()
  })

  beforeEach( done => {
    // RUN SEED FILE(S)
    knex.migrate.rollback()
    .then( () => {
      knex.migrate.latest()
      .then( () => {
        knex.seed.run()
        .then( () => {
          done()
        })
      })
    })
  })
})

describe('GET/api/v1/folders', () => {
  xit('should return', done => {
    chai.request(server)
    .get('/api/v1/folders')
    .end((err, response) => {
      response.should.have.status(200)
      response.should.be.json
      response.should.be.a('object')
      response.body.data.should.be.a('array')
      response.body.data[0].should.be.a('object')
      response.body.data[0].should.have.property('id')
      response.body.data[0].should.have.property('name')
      response.body.data[0].should.have.property('created_at')
      response.body.data[0].should.have.property('updated_at')
      done()
    })
  })
})

describe('GET/api/v1/shortURL', () => {
  xit('should return these values: ', done => {
    chai.request(server)
    .get('/api/v1/shortURL')
    .end((err, response) => {
      response.should.have.status(200)
      response.should.be.json
      response.body.should.be.a('object')
      response.body.data.should.be.a('array')
      response.body.data[0].should.be.a('object')
      response.body.data[0].should.have.property('id')
      response.body.data[0].should.have.property('shortURL')
      response.body.data[0].should.have.property('folder_id')
      response.body.data[0].should.have.property('created_at')
      response.body.data[0].should.have.property('updated_at')
      done()
    })
  })
})
