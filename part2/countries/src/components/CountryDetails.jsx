import Weather from './Weather'

const CountryDetails = ({ countries }) => {
    if (countries.length === 1) {
        const country = countries[0]
        console.log(Object.values(country.languages))

        return (
            <div>
                <h1>{country.name.common}</h1>
                <li>Capital {country.capital}</li>
                <li>Area {country.area}</li>
                <h2>Languages</h2>
                <ul>
                    {Object.values(country.languages).map((language) => (
                        <li key={language}> {language}
                        </li>))}
                </ul>
                <img src={country.flags.png} alt={country.flags.alt}></img>

                <Weather city={country.capital}/>
            </div>
        )
    }
    else return null
}

export default CountryDetails
