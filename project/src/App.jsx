import { useState, useEffect, useCallback } from 'react'

import './App.css'

function App() {
  const [doneFetching, setDoneFetching] = useState(false);
  const [data, setData] = useState([]);
  const [dist, setDist] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);

  function parse_consumables(consumables) {
    const cons = {
      'value':Number(consumables.split(' ')[0]),
      'unit': consumables.split(' ')[1]
    }
  
    if(['day', 'days'].includes(cons.unit)){
      cons.value = cons.value*24;
      cons.unit = "hours"
    } if(['week', 'weeks'].includes(cons.unit)){
      cons.value = cons.value*168;
      cons.unit = "hours"
    } if(['month', 'months'].includes(cons.unit)){
      cons.value = cons.value*720;
      cons.unit = "hours"
    }  if(['year', 'years'].includes(cons.unit)){
      cons.value = cons.value*8760;
      cons.unit = "hours"
    }
  
    return (cons.value);
  }

  const fetchData = useCallback( async (url, accumulator = []) => {
    try {
      const response = await fetch(url);
      const data =  await response.json();
      
      accumulator = accumulator.concat(data.results);
  
      if (data.next) {
        return fetchData(data.next, accumulator);
      } else{
        setDoneFetching(true);
        return accumulator;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return accumulator;
    }
  }, []);

  useEffect(() => {
    const apiURL = 'https://swapi.dev/api/starships/';

    async function fetchDataFromAPI() {
      try {
        const accumulatedResults = await fetchData(apiURL);
        setResults(accumulatedResults);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchDataFromAPI();
  }, [submitted, fetchData]);



  function handleClick() {
    
    let filteredShips = []
    let i = 0;
    for(const ship of results){
      let newShip = {
      "id": i,
      "name": ship.name,
      "model": ship.model,
      "MGLT": Number(ship.MGLT),
      "consumables": parse_consumables(ship.consumables),
      "stops": Math.floor(dist/(Number(ship.MGLT)*parse_consumables(ship.consumables)))
      }
      filteredShips.push(newShip);
      i++;
    }
    setData(filteredShips);
    setSubmitted(true);
    setDoneFetching(false);
  }

  return (
    <>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleClick();
      }}>
        <p>Infome a distância a ser percorrida pelas aeronaves em mega lights:</p>
        <label htmlFor="dist">Distância: </label>
        <input id="dist" type="text" placeholder="0" value={dist} onChange={(e) => {
          setDist(Number(e.target.value))
          if(isNaN(dist)){
            setDist(0);
          }
          setData([])
          setSubmitted(false)
          setDoneFetching(false)
        }} />
        <input type='submit' disabled={!(typeof(dist) == 'number')}/>
        {(!(typeof(dist) == 'number')) && <p>O valor deve ser um número!</p>}
      </form>
      {submitted && !doneFetching && (<h3>Carregando</h3>)}
      {doneFetching && submitted &&(
        <>
          <h3>O número de paradas necessárias por cada espaçonave para percorrer {dist} mega lights é:</h3>
          <ul>
            {data.map((ship) => (
              <li key={ship.id}>{ship.name}, {isNaN(ship.stops)? "Unknown" : ship.stops}</li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}

export default App
