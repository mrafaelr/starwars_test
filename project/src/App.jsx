import { useState, useEffect } from 'react'

import './App.css'

function App() {
  const [data, setData] = useState([]);

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

  return (
    <>
      
    </>
  )
}

export default App
