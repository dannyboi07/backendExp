const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
]

app.get('/', (req, res) => {

    res.send('<h1>Hello World</h1>');
})

app.get('/api/notes', (req, res) => {
    res.json(notes);
})

app.get('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const note = notes.find(n => n.id === id);

    if (note) {
        res.json(note);
    } else {
        res.statusMessage = "Requested note does not exist";
        res.status(404).end();
    }
})

function generateID() {
    const maxID = notes.length > 0 ? 
        Math.max(...notes.map(n => n.id)) : 0
    return maxID + 1;
}

app.post('/api/notes', (req, res) => {
    const body = req.body;

    if (!body.content) {
        return res.status(400).json({ error: 'content missing' })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateID(),
    }
    notes = notes.concat(note);
    // console.log(note);
    
    res.json(note);
})

app.put('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const body = req.body;
    const oldNote = notes.find(note => note.id === id);

    if (oldNote) {
        notes.find(note => {
            if (note.id === id) {
                note.important = !note.important;
                // console.log(note);
                return res.status(200).send(note);
            }
        })
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    notes = notes.filter(note => note.id !== id);

    res.status(204).end();
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})