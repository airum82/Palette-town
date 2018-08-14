const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);

app.locals.folders = []

app.post('/newFolder', (request, response) => {
  const { name } = request.body;
  if(!name) {
    return response.status(401).send({
      error: 'no new folder provided'
    })
  } else {
    app.locals.folders.push(name)
    return response.status(200).send({
      message: 'new folder added'
    })
  }
})

app.get('/folders', (request, response) => {
  return response.status(200).json({ "folders": app.locals.folders })
})

app.listen(3000, () => {
  console.log('Palette town running on localhost:3000');
});