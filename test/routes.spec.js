const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('GET /api/v1/folders', (done) => {

  it('should return an array of projects', () => {
    chai.request(server)
    .get('/api/v1/folders')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be(array);
      response[0].should.be(object);
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