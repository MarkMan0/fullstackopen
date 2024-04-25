import Note from './components/Note'
import { useState } from 'react'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)

  const addNote = (event) => {
    event.preventDefault();

    const n2 = notes.concat({
      id: notes.length + 1,
      content: newNote,
      important:  Math.random() < 0.5
    })
    setNotes(n2)
    setNewNote("")
  }

  const onNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={onNoteChange} placeholder='a new note...'/>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App
