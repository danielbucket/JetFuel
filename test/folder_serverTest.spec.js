const chai = require('chai');
const should = chai.should();
const chaiHTTP = require('chai-http');
const server = require('../server/server');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const db = require('knex')(configuration);

chai.use(chaiHTTP);

describe('Client Routes', () => {
  it('01: should return status(200)', done => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200)
      response.should.be.html
      done()
    })
  })

  it('02: should return status(400)', done => {
    chai.request(server)
    .get('/home')
    .end((err, response) => {
      response.should.have.status(404)
      done()
    })
  })
})

describe('API Routes', () => {
  beforeEach(done => {
    db.migrate.latest()
    .then(() => db.seed.run())
    .then(() => done())
    .catch(error => console.log(error))
  })

  describe('GET api/v1/folders', () => {
    it('01: should have certain properties', done => {
      chai.request(server)
      .get('/api/v1/folders/')
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.json
        res.should.be.a('object')
        res.body.data.should.be.a('array')
        res.body.data[0].should.have.property('id')
        res.body.data[0].should.have.property('name')
        res.body.data[0].should.have.property('created_at')
        res.body.data[0].should.have.property('updated_at')
        done()
      })
    })
  })

  describe('POST api/v1/folders', () => {
    it('01: should be able to post a new url only after receiving an id from POSTing a new folder', done => {
      chai.request(server)
      .post('/api/v1/folders/')
      .send( {name: 'TestFolder'} )
      .end((err, res) => {
        let id = res.body.id

        res.should.have.status(200)
        res.body.should.have.property('id')
        res.body.should.be.a('object')

        chai.request(server)
        .post('/api/v1/shortURL/')
        .send({folder_id:id, shortURL: 'u433nl'})
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('id')
          res.body.should.have.property('folder_id')
          res.body.folder_id.should.equal(id)
          res.body.should.have.property('longURL')
          res.body.longURL.should.equal('u433nl')
          res.body.should.have.property('shortURL')
          res.body.should.have.property('created_at')
          res.body.should.have.property('updated_at')
          done()
        })
      })
    })
  })
})
