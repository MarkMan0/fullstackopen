import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const checkUnique = () => {
    return persons.find(person => person.name === newName) === undefined
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!checkUnique()) {
      alert(`${newName} is already added to phonebook`)
      return;
    }
    setPersons(persons.concat({name: newName, number: newNumber, id: persons.length + 1}))
    setNewName("")
    setNewNumber("")
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
            .map(person => <Person key={person.id} person={person}/>)
      }
    </div>
  )
}

const Person = ({person}) => <div>{person.name} {person.number}</div>

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
