// Import express package
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001;

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
        var notesObjects = [];

        // notesString = fs.readFileSync('db/db.json', { encoding: 'utf8' });

        // if (notesString) {
        //     //console.log('File data:', notesString);
        //     obj = JSON.parse(notesString);
        //     if (obj.length != 0) {
        //         for (var i in obj) {
        //             notesObjects.push(obj[i]);
        //         }
        //     }
        // }

        // notesObjects.push(newNote);

        // // write JSON string to a file
        // fs.writeFileSync('db/db.json', JSON.stringify(notesObjects), { encoding: 'utf8' });
        // //console.log("JSON data is saved.");
        // res.status(200);


        fs.readFile('db/db.json', 'utf8', (err, notesString) => {
            if (err) {
                //console.log("File read failed:", err)
                return;
            }
            if (notesString) {
                //console.log('File data:', notesString);
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
                //console.log("JSON data is saved.");
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
            // console.log("File read failed:", err)
            return;
        }
        if (notesString) {
            //console.log('File data:', notesString);
            //console.log(JSON.parse(notesString));
            res.status(200);
            res.json(JSON.parse(notesString));
        }
    });

});

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);