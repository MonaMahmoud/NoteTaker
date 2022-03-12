// Import express package
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001;
var notesObjects;

// Initialize our app variable by setting it to the value of express()
const app = express();
app.use(express.static('public'));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>

    res.render(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
        };
        newNote.id = uuidv4();

        fs.readFile('db/db.json', 'utf8', (err, notesString) => {
            if (err) {
                return;
            }
            notesObjects = [];
            if (notesString) {

                obj = JSON.parse(notesString);
                if (obj.length != 0) {
                    for (var i in obj) {
                        notesObjects.push(obj[i]);
                    }
                }
            }

            notesObjects.push(newNote);
            // write JSON string to a file
            fs.writeFile('db/db.json', JSON.stringify(notesObjects), (err) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(notesObjects);
            });
        });
    } else {
        res.status(500).json('Error in adding note');
    }
});


// GET request for notes
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, notesString) => {
        if (err) {
            return;
        }
        if (notesString) {
            res.status(200);
            res.json(JSON.parse(notesString));
        }
    });

});


// GET request for deleting a note
app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params);

    const id = req.params["id"];
    console.log(id);
    fs.readFile('db/db.json', 'utf8', (err, notesString) => {
        if (err) {
            return;
        }
        notesObjects = [];
        if (notesString) {

            obj = JSON.parse(notesString);
            if (obj.length != 0) {
                for (var i in obj) {
                    console.log(obj[i]);
                    if (obj[i]["id"] != id) {
                        notesObjects.push(obj[i]);
                    }
                }
            }
            fs.writeFile('db/db.json', JSON.stringify(notesObjects), (err) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(notesObjects);
            });
        }
    });

});


app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);