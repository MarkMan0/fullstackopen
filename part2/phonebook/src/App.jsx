import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    phonebookService
      .getAll()
      .then(entries => {
        setPersons(entries)
      })
  }, [])


  const onSubmit = (event) => {
    event.preventDefault()

    const found = persons.find(person => person.name === newName)

    if (found) {
      if (!window.confirm(`Update the number for ${found.name}?`)) return
      phonebookService
        .update(found.id, {...found, number: newNumber})
        .then(updated => {
          setPersons(persons.map(p => p.id === found.id ? updated : p))
          setNewName("")
          setNewNumber("")
        })
    } else {
      phonebookService
        .create({name: newName, number: newNumber})
        .then(created => {
          setPersons(persons.concat(created))
          setNewName("")
          setNewNumber("")
        })
    }
  }

  const deleteEntry = person => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }

    phonebookService
      .delete_(person.id)
      .then(deleted => {
        setPersons(persons.filter(p => p.id != person.id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Input text="filter" value={nameFilter} setter={setNameFilter}/>
      </div>
      <h2>Add new</h2>
      <PersonForm personName={newName} nameSetter={setNewName} number={newNumber} numberSetter={setNewNumber}
          onSubmit={onSubmit}/>
      <h2>Numbers</h2>
      {
        persons
            .filter(person => person.name.includes(nameFilter))
            .map(person => <Person key={person.id} person={person} onDelete={() => deleteEntry(person)}/>)
      }
    </div>
  )
}

const Person = ({person, onDelete}) => (
  <div>
    {person.name} {person.number} <button onClick={onDelete}>Delete</button>
  </div>
)

const Input = ({text, value, setter}) => (
  <div>
    {text}: <input value={value} onChange={(event) => setter(event.target.value)}/>
  </div>
)

const PersonForm = ({personName, nameSetter, number, numberSetter, onSubmit}) => (
  <form onSubmit={onSubmit}>
    <Input text="name" value={personName} setter={nameSetter}/>
    <Input text="number" value={number} setter={numberSetter}/>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

export default App
