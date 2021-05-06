const express = require ('express');
const cors = require('cors');
const logger = require('./loggerMiddleware');
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

let notes = [
  {
    id: 1,
    content: "Esta es la primera de las notas, es muy importante",
    important: true
  },
  {
    id: 2,
    content: "Esta es la segunda de las notas, es poco importante",
    important: false
  },
  {
    id: 3,
    content: "Esta es la tercera de las notas, es muy importante",
    important: true
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
});

// Finds All Notes
app.get('/api/notes', (request, response) => {
  response.json(notes);
});

// Finds One Note by ID
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);

  if(note) {
    response.json(note);
  } 
  else {
    response.status(404).end();
  } 
});

// Deletes One Note by ID
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);
  response.status(204).end();
})

// Creates a New Note
app.post('/api/notes', (request, response) => {
  const note = request.body;
  const ids = notes.map(note => note.id);
  const maxId = Math.max(...ids);

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false
  }

  notes = [...notes, newNote];
  response.status(201).json(newNote);

})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not Found, err 404'
  })
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
