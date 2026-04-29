import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    personsService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPersonObject = {
      name: newName,
      number: newNumber
    }
    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson != undefined) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personsService.update(existingPerson.id, newPersonObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === existingPerson.id ? returnedPerson : person))
          })
      }
    }
    else {
      personsService.create(newPersonObject)
        .then(updatedPersons => {
          setPersons(persons.concat(updatedPersons))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)
  const handleDelete = (id) => {
    event.preventDefault()
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name}?`)) {
      personsService.deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id != id))
        })
    }
  }

  const re = new RegExp(filter, "i");
  const filteredNames = persons.filter(person => re.test(person.name))


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handler={handleFilterChange} />
      <h2>Add new</h2>
      <PersonForm name={newName} nameHandler={handleNameChange} number={newNumber} numberHandler={handleNumberChange} submitHandler={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={filteredNames} deleteHandler={handleDelete} />
    </div>
  )
}

export default App