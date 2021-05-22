import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Person from './components/Person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [filtre, setFiltre] = useState('')

  const personsToShow = showAll
    ? persons
    : persons.filter(
        (person) =>
          person.name.toLowerCase().includes(filtre.toLowerCase()) === true
    )

  const addPerson = (event) => {
    event.preventDefault()
    const names = persons.map((person) => person.name)
    if (names.includes(newName)) {
        window.alert(`${newName} is already added to phonebook`)
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })

    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Filter filtre={filtre} setShowAll={setShowAll} setFiltre={setFiltre} />
      </div>
      <div>
        <PersonForm 
          addPerson={addPerson}
          newName={newName}
          newNumber={newNumber}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}
        /> 
      </div>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map((person) => (
          <Person key={person.name} person={person} />
        ))} 
      </ul>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

