const express = require('express');
const path = require('path');
const app = express();
const uniqid = require('uniqid');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
  //^^ set up all the needed packages and set up the port
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
// ^^Middleware for parsing JSON and urlencoded form data

app.get('/', (req,res) => {
res.sendFile(path.join(__dirname, 'public/index.html'))});
//^^sets route for homepage
app.get('/notes', (req,res) => {
res.sendFile(path.join(__dirname, 'public/notes.html'))});
//^^sets route for notes page
//vv POST route to add new notes
app.post('/api/notes', (req, res) => {
    console.log(req.body);
  
  
      fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
        if (err) {
          console.log(err)
        } else {
        const notes = JSON.parse(data);
        const noteInfo = req.body;
        const noteId = uniqid();
        //^^ uniqid creates a uniquw id that will be used to identify notes
        const newNote = {
            id: noteId,
            title: noteInfo.title,
            text: noteInfo.text
        };
        notes.push(newNote);
        res.json(newNote);
        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes, null, 2), function(err) {
            if (err) throw err;
        });
          //^^ takes the new note and adds it to the notes database
      }
    })});
//vv DELETE route for notes
  app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
      const notes = JSON.parse(data)
      if (err) {
        console.log(err)
        } else {
          var idx = notes.map(item => item.id).indexOf(noteId)
          //^^finds the index of a specific note in the array by using the id number of desired note
          if (idx != -1) notes.splice(idx,1);
          //^^takes the index of the desired note and uses it to splice the note out of the array
          fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes, null, 2), function(err) {
            if (err) throw err;
          res.json(`Item ${noteId} has been deleted`);
          })
    }});
});
//vv GET route for notes pulls the saved notes from the database
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
})

app.listen(PORT, () =>
console.log('App Listening at Port ' ,PORT))
//^^ Starts Port and console logs so that user knows port is functioning