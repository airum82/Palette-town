const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 
  'development';
const configuration = require('./knexfile')
  [environment];
const database = require('knex')(configuration)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);

app.locals.folders = []

app.post('/api/v1/newFolder', (request, response) => {
  const { name } = request.body;
  if(!name) {
    //user must have a palette name to submit
    //returns message saying they must have a name
    return response.status(401).send(new Error({
      message: 'no folder name provided'
    }))
  } else {
    //inserts new project into projects folder
    //then sends response saying that new folder was added
    database('projects').insert(request.body, 'id')
      .then((project) => response.status(200).send({
        message: 'new folder added'
      }))
  }
})

app.put('/api/v1/folders/:id', (request, response) => {
  if(request.body === {}) {
    //sends error message when no palette info provided
    return response.status(422).send({
      error: 'no palette provided'
    })
  } else {
    //inserts new palette into palettes table
    //tells postgres to create Id for record
    database('palettes').insert(request.body, 'id')
      .then(palette => response.status(200).send({ message: 
        'new palette added to project'}))
  }
})

app.get('/api/v1/folders', (request, response) => {
  //fetches all projects from project table in palettetown database
  //sends them to the front end
  return database('projects').select()
    .then((projects) => {
      return response.status(200).json(projects)
    })
    .catch(error => {
      return response.status(500).send({ message: 'problem fetching projects'})
    })
})

app.get('/api/v1/palettes', (request, response) => {
  //fetches all palettes from palettes table in database
  //after fetching, sends palettes to front end
  return database('palettes').select()
    .then(palettes => {
      return response.status(200).json(palettes)
    })
})

app.delete('/api/v1/delete/palette', (request, response) => {
  //removes specific palette from database by matching foreign key
  return database('palettes').select()
    .where('project_id', request.body.project_id)
    .where('name', request.body.paletteName)
    .del()
    .then(result => response.status(200).json(result))
})

app.listen(app.get('port'), () => {
  console.log('Palette town running on localhost:3000');
});

module.exports = app;