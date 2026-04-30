import { useState, useEffect } from 'react'
import axios from 'axios'
import getAll from './services/countries'
import Filter from './components/Filter'
import CountryList from './components/CountryList'
import CountryDetails from './components/CountryDetails'


const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const re = new RegExp(filter, "i");
  const filteredCountries = countries.filter(country => re.test(country.name.common))
  const handleFilterChange = (event) => setFilter(event.target.value)
  const handleFilterClick = (value) => setFilter(value)

  console.log(filteredCountries.length)

  return (
    <div>
      <Filter filter={filter} handler={handleFilterChange} />
      <CountryList countries={filteredCountries} handleFilterClick={handleFilterClick}/>
      <CountryDetails countries={filteredCountries}/>
    </div>
  )
}

export default App