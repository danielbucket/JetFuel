const chai           = require('chai');
const should         = chai.should();
const chaiHTTP       = require('chai-http');
const server         = require('../server/server');

const environment    = process.env.NODE_ENV || 'development';
const configuration  = require('../knexfile')[environment];
const db             = require('knex')(configuration);

const { urlsByFolderID,
        allURLs,
        allFolders,
        folderByID,
        redirect,
        host  } = require('../server/routes.js')

chai.use(chaiHTTP);

describe('shortURL routes', () => {
  beforeEach(done => {
    db.migrate.latest()
    .then(() => db.seed.run())
    .then(() => done())
    .catch(error => console.log(error))
  })

  describe('POST api/v1/shortURL', () => {
    it('01_SAD: should not be able to post a new url without a valid id', done => {
      chai.request(server)
      .post(allURLs)
      .send({ folder_id:988433, shortURL:'b4u8me'} )
      .end((err, res) => {
        res.should.have.status(500)
        done()
      })
    })

    it('02_SAD: should require a specific key value to post a new url', done => {
      chai.request(server)
      .post(allFolders)
      .send({ name:'Broad Hard Shoulders' })
      .end((err, res) => {
        let id = res.body.id

        res.should.have.status(200)
        res.body.should.have.property('id')

        chai.request(server)
        .post(allURLs)
        .send({folder_id: id, shartURL: 'b4u8me'})
        .end((err, res) => {
          res.should.have.status(422)
          res.error.text.should.equal('{"error":"Missing required parameter shortURL"}')
          done()
        })
      })
    })

    it('03: should require a valid id to post to the shortURL table', done => {
      chai.request(server)
      .post(allFolders)
      .send({name: 'deadGuyDuties'})
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('id')
        res.should.be.json

        let id = res.body.id

        chai.request(server)
        .post(allURLs)
        .send({folder_id:id, shortURL:'53778008'})
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.json
          done()
        })
      })
    })

    it('04: should be able to find the folder by its unique id', done => {
      chai.request(server)
      .post(allFolders)
      .send({name: 'I wanna talk to Sampson!'})
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('id')
        res.should.be.json
        done()
      })
    })
  })

  describe('GET /api/v1/shortURL', () => {
    it('01: should return the following values: ', done => {
      chai.request(server)
      .get(allURLs)
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

  // HOW DO I TEST A REDIRECT??
  xit('04: should respond with a redirect when server is hit', done => {
    chai.request(server)
    .post(allFolders)
    .send({name: 'I wanna talk to Sampson!'})
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.have.property('id')
      res.should.be.json

      let id = res.body.id

      chai.request(server)
      .post(allURLs)
      .send({folder_id:id, shortURL:'tootsieRoll'})
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.json
        res.body.longURL.should.equal('tootsieRoll')

        let short = res.body.shortURL

        chai.request(server)
        .get(`${allURLs}${short}`)
        .end((err, res) => {
          // WHAT DO I DO NOW?
        })
      })
    })
  })

  it('should get all urls linked to the specified folder', done => {
      chai.request(server)
      .post(allFolders)
      .send({name:'HoldMyBeer'})
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.have.property('id')

        let id = res.body.id

        chai.request(server)
        .post(allURLs)
        .send({'folder_id':id, shortURL:'flabmaster'})
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('folder_id')

          let id = res.body.folder_id

          chai.request(server)
          .get(`${allFolders}${id}/shortURL`)
          .end((err, res) => {
            res.body.should.have.property('urlData')
            res.body.urlData.length.should.equal(1)
            res.body.urlData[0].longURL.should.equal('flabmaster')
            res.body.urlData[0].folder_id.should.equal(id)
            done()
          })
        })
      })
  })
})
