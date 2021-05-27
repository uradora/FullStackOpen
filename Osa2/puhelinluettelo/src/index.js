import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Person from './components/Person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [filtre, setFiltre] = useState('')
  const [message, setMessage] = useState({ 
    text: null, 
    isError: false
  })

  const hook = () => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }

  useEffect(hook, [])

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
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const personToUpdate = persons.find(
          (person) => person.name === newName
        )
        const idOfPerson = personToUpdate.id
        const updatedPerson = {
          name: newName,
          number: newNumber
        }
        if (personToUpdate) {
          personService
            .update(idOfPerson, updatedPerson)
            .then((returnedPerson) => {
              setPersons(
                persons.map((person) => 
                person.id !== idOfPerson ? person : returnedPerson)
                )
                setMessage({
                  text: `${returnedPerson.name} number updated`,
                  isError: false
                })
                setTimeout(() => {
                  setMessage({ text: null, isError: false })
                }, 5000)
              })
              .catch((error) => {
                setMessage({
                  text: `Information of ${newName} has already been removed from the server`,
                  isError: true
                })
                setTimeout(() => {
                  setMessage({ text: null, isError: true })
                }, 5000)
              })
            }
        }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))
          setMessage({
            text: `Added ${returnedPerson.name}`,
            isError: false
          })
          setTimeout(() => {
            setMessage({ text: null, isError: false })
          }, 5000)
          console.log(persons)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          const errorMessage = error.response.data.error
          console.log(error)
          setMessage({
            text: `'${errorMessage}`,
            isError: true
          })
          setTimeout(() => {
            setMessage({ text: null, isError: false })
          }, 5000)
        })
    }
  }

  const deletePerson = ({ person }) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(person.id)
        .then(setPersons(persons.filter((p) => p.id !== person.id)))
        setMessage({
          text: `Deleted ${person.name}`,
          isError: false
        })
        setTimeout(() => {
          setMessage({ text: null, isError: false })
        }, 5000)
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
      <Notification message={message} />
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
          <Person key={person.name} person={person} deletePerson={deletePerson} />
        ))} 
      </ul>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

