const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV ||
  'development';
const configuration = require('../knexfile')
[environment];
const database = require('knex')(configuration)

chai.use(chaiHttp);

describe('GET /api/v1/folders', (done) => {

  it('should return an array of projects', () => {
    chai.request(server)
    .get('/api/v1/folders')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.a('array');
      response[0].should.be.a('object');
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

describe('GET /api/v1/palettes', (done) => {

  it('should return an array of palettes', () => {
    chai.request(server)
      .get('/api/v1/palettes')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.a('array');
        response[0].should.be.a('object');
        done();
      })
  })
})

describe('PUT /api/v1/folders/:id', () => {

  it('should insert a new folder into database', () => {

  })
})