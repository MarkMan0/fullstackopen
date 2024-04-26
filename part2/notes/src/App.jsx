import Note from './components/Note'
import { useState, useEffect } from 'react'
import noteservice from './services/notes'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteservice
      .getAll()
      .then(initialNotes  => {
        setNotes(initialNotes.concat({id: "qqq", content: "xxx", important: false}))
      })
  }, [])

  const addNote = (event) => {
    event.preventDefault();

    const note = {
      content: newNote,
      important:  Math.random() < 0.5
    }

    noteservice
      .create(note)
      .then(returnedNote  => {
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })
  }

  const onNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = id => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(note => note.id === id)
    const updated = {...note, important: !note.important}

    noteservice
      .update(id, updated)
      .then(returnedNote  => {
        setNotes(notes.map(n => n.id === id ? returnedNote  : n))
      })
      .catch(error => {
        setErrorMessage(`the note '${note.content}' was already deleted from the server`)
        setTimeout(() => setErrorMessage(null), 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={onNoteChange} placeholder='a new note...'/>
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}

export default App
