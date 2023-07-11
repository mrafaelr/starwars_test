import { useState, useEffect } from 'react'

import './App.css'

function App() {
  const [data, setData] = useState([]);

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
                               'consumables': ship.consumables
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
