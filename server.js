const express = require('express');
const path = require('path');
const app = express();
const uniqid = require('uniqid');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
  
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


app.get('/index', (req,res) => {
res.sendFile(path.join(__dirname, 'public/index.html'))});

app.get('/notes', (req,res) => {
res.sendFile(path.join(__dirname, 'public/notes.html'))});

app.post('/api/notes', (req, res) => {
    console.log(req.body);
  
  
      fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
        if (err) {
          console.log(err)
        } else {
        const notes = JSON.parse(data);
        const noteInfo = req.body;
        const noteId = uniqid();
        const newNote = {
            id: noteId,
            title: noteInfo.title,
            text: noteInfo.text
        };
        notes.push(newNote);
        res.json(newNote);
        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes, null, 2), function(err) {
            if (err) throw err;
            res.json(`Note added successfully`);
        });
 
      }
    })});

  app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
      const notes = JSON.parse(data)
      if (err) {
        console.log(err)
        } else {
          var idx = notes.map(item => item.id).indexOf(noteId)
          console.log(noteId)
          console.log(idx)
          if (idx != -1) notes.splice(idx,1);
          fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes, null, 2), function(err) {
            if (err) throw err;
          res.json(`Item ${noteId} has been deleted`);
          })
    }});
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
})

app.listen(PORT, () =>
console.log('App Listening at Port ' ,PORT))
