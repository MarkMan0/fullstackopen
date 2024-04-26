import { useEffect, useState } from 'react'
import axios from 'axios'

const URL = "https://studies.cs.helsinki.fi/restcountries/api"

function App() {
  const [query, setQuery] = useState("")
  const [countries, setCountries] = useState(null)

  useEffect(() => {
    if (!query) {
      setCountries(null)
      return
    }
    axios
      .get(`${URL}/all`)
      .then(response => {
        const data = response.data
        const filtered = data.filter(country => {
          return country.name.common.toLowerCase().includes(query.toLowerCase())
        })
        const exact = filtered.find(c => c.name.common.toLowerCase() === query.toLowerCase())
        setCountries(exact ? [exact] : filtered)
      })
  }, [query])

  return (
    <div>
      <div>
        find countries
        <input value={query} onChange={(event) => setQuery(event.target.value)}/>
      </div>
      <Countries countries={countries} setQuery={setQuery} />
    </div>
  )
}

const Countries = ({countries, setQuery}) => {
  if (countries === null) {
    return <div>Enter a filter</div>
  }
  if (countries.length === 0) {
    return <div>No countries found</div>
  }
  if (countries.length > 10) {
    return <div>Too many countries match the filter</div>
  }
  if (countries.length === 1) {
    return <DetailedCountry country={countries[0]} />
  }

  return (
    <div>
      { countries.map(c => <Country key={c.name.official} country={c} setQuery={setQuery} />) }
    </div>
  )
}

const DetailedCountry = ({country}) => {

  const [capitalInfo, setCapitalInfo] = useState(null)

  const api_key = import.meta.env.VITE_OPEN_WEATHER_MAP_KEY
  const capitals = country.capital
  const capital = capitals[0]

  const latLng = country.capitalInfo.latlng

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latLng[0]}&lon=${latLng[1]}&appid=${api_key}&units=metric`

  useEffect(() => {
    axios
      .get(url)
      .then(response => {
        setCapitalInfo(response.data)
      })
      .catch((error) => {
        setCapitalInfo(null)
      })
  }, [])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital{capitals.length > 1 ? "s" : ""} {capitals.join(", ")}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.keys(country.languages).map(key => {
          return <li key={key}>{country.languages[key]}</li>
        })}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt}/>
      <h3>Weather in {capital}</h3>
      <WeatherInfo weather={capitalInfo} />
    </div>
  )
}

const Country = ({country, setQuery}) => (
  <div>
    {country.name.common} <button onClick={() => setQuery(country.name.common)}>Select</button>
  </div>
)

const WeatherInfo = ({weather}) => {
  if (!weather) return null

  return (
    <div>
    <div>temperature is {weather.main.temp} celsius</div>
    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
    <div>wind is {weather.wind.speed} m/s</div>
    </div>
  )
}

export default App
