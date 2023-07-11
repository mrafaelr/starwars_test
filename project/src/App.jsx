import { useState, useEffect } from 'react'

import './App.css'

function App() {
  const [data, setData] = useState([]);
  const [dist, setDist] = useState("");

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
  
    return (cons);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://swapi.dev/api/starships/');
        if (response.ok) {
          const jsonData = await response.json();
          const ships = [];
          let i = 0;
          for(const ship of jsonData.results) {
            const newRecord = {'id': i,
                               'name': ship.name,
                               'MGLT': Number(ship.MGLT),
                               'consumables': parse_consumables(ship.consumables)
              }
            ships.push(newRecord);
            i++;
          }
          setData(ships);
        }
        else {
          console.error('GET request failed with status code:', response.status);
        }
      } catch (error) {
        console.error('Error:', error)
      }
    };

    fetchData();

  }, []);

  function handleClick() {

    const newData = data.map(ship => {
      const stops = (dist/(ship.MGLT*ship.consumables.value))
      return {... ship,
      'stops': Math.trunc(stops)};
    })

    setData(newData);
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
        }} />
        <input type='submit' disabled={!(typeof(dist) == 'number')}/>
        {(!(typeof(dist) == 'number')) && <p>O valor deve ser um número!</p>}
      </form>
    </>
  )
}

export default App
