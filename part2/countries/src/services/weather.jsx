import axios from 'axios'

const api_key = import.meta.env.VITE_OPENWEATHER_APIKEY

//https://api.openweathermap.org/data/2.5/weather?q=<CITY>&appid=<APIKEY>
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getWeather = ({city}) => {
  const request = axios.get(`${baseUrl}?q=${city}&appid=${api_key}`)
  return request.then(response => response.data)
}

export default getWeather