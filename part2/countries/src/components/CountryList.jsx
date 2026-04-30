const CountryList = ({ countries, handleFilterClick }) => {
    if (countries.length > 10)
        return (
            <li>Too many matches, specify another filter</li>
        )
    if (countries.length > 1)
        return (
            <div>
                {countries.map((country) => (
                    <li key={country.cioc}> {country.name.common}
                        <button onClick={() => handleFilterClick(country.name.common)}>filter</button>
                    </li>))}
            </div>
        )
    else
        return null
}

export default CountryList
