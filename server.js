const express = require('express');
const path = require('path');
const app = express();
const note = require('express').Router();
const uniqid = require('uniqid');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const writeToFile = () =>
  fs.writeFile('db.json', JSON.stringify(notes, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
  const readAndAppend = () => {
    fs.readFile('db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(newNote);
        writeToFile('db.json', parsedData);
      }
    });
  };
  
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/index', (req,res) => {
res.sendFile(path.join(__dirname, 'public/index.html'))});

app.get('/notes', (req,res) => {
res.sendFile(path.join(__dirname, 'public/notes.html'))});

note.post('/', (req, res) => {
    console.log(req.body);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
        note_id: uniqid(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully`);
    } else {
      res.error('Error in adding note');
    }
  });

  note.delete('/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.note_id !== tipId);
        writeToFile('./db/db.json', result);
        res.json(`Item ${noteId} has been deleted`);
    });
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
})

app.listen(PORT, () =>
console.log('App Listening at Port ' ,PORT))
