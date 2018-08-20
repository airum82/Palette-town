process.env.NODE_ENV = 'test'
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const configuration = require('../knexfile')
['test'];
const database = require('knex')(configuration)

chai.use(chaiHttp);

describe('GET /api/v1/folders', () => {

  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => database.migrate.latest())
      .then(() => database.seed.run())
      .then(() => done())
  });
  
  it('should return an array of projects', (done) => {
    chai.request(server)
    .get('/api/v1/folders')
    .end((err, response) => {
      response.should.have.status(200);
      response.body.should.be.a('array');
      response.body[0].should.be.a('object');
      done();
    })
  })

  it('should return 500 error if fetch fails', (done) => {
    chai.request(server)
    .get('/sad')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    })
  })
})

describe('GET /api/v1/palettes', () => {

  it('should return an array of palettes', (done) => {
    chai.request(server)
      .get('/api/v1/palettes')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('array');
        response.body[0].should.be.a('object');
        done();
      })
  })
})

describe('PUT/POST/DELETE', () => {

  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => database.migrate.latest())
      .then(() => database.seed.run())
      .then(() => done())
  });

  it('should insert a new folder into database', (done) => {
    chai.request(server)
      .put('/api/v1/folders/:id')
      .send({
        name: 'thisPalette',
        color1: 'blue',
        color2: 'red',
        color3: 'green',
        color4: 'orange',
        color5: 'black',
        project_id: '44956'
      }).end((err, response) => {
        response.should.have.status(200);
        response.should.be.a('object');
        response.body.message.should.equal('new palette added to project');
        done()
      })
  })

  it('/api/v1/newFolder should create a new folder in database', (done) => {
    chai.request(server)
      .post('/api/v1/newFolder')
      .send({
        name: 'newProject',
        project_id: '584839'
      })
      .end((err, response) => {
        response.should.have.status(200);
        response.body.message.should.equal('new folder added');
        done()
      })
  })

  it('api/v1/newFolder should return error if no project name', (done) => {
    chai.request(server)
      .post('/api/v1/newFolder')
      .send({
        project_id: '58694'
      })
      .end((err, response) => {
        response.should.have.status(401)
        done()
      })
  })

  it('/api/v1/delete/palette', (done) => {
    chai.request(server)
      .delete('/api/v1/delete/palette')
      .send({
        paletteName: 'palette1',
        project_id: '1'
      })
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.equal(1);
      })

    chai.request(server)
      .get('/api/v1/palettes')
      .end((err, response) => {
        response.body.should.deep.equal([]);
        done();
      })
  })
})