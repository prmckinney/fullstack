import { useState, useEffect } from 'react'
import getWeather from '../services/weather'

const Weather = ({ city }) => {
    const [weather, setWeather] = useState([])

    useEffect(() => {
        getWeather({city})
            .then(initialWeather => {
                setWeather(initialWeather)
            })
    }, [])

    if (weather.length != 0) {
        const weatherSymbolURL = `https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`
        return (
            <div>
                <h2>Weather in {city}</h2>
                <li>Temperature {weather.main.temp - 273.15} °C</li>
                <img src={weatherSymbolURL}></img>
                <li>Wind {weather.wind.speed} m/s</li>
            </div>
        )
    }
    else return null
}

export default Weather
