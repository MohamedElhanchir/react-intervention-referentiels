import axios from 'axios';
import React, { useEffect, useState } from 'react';

function App() {
  const [values, setValues] = useState({}); // Stocke les options pour chaque niveau
  const [selectedValues, setSelectedValues] = useState({}); // Stocke la valeur sélectionnée pour chaque niveau

  // Charger les options initiales
  useEffect(() => {
    axios.get('http://localhost:8000/api/referentiels-intervention')
      .then((response) => {
        setValues({ 0: response.data.referentiel_parent });
      }).catch((error) => {
        console.log(error);
      });
  }, []);

  // Gestionnaire d'événements pour mettre à jour les valeurs sélectionnées et charger les options suivantes
  const handleChange = (level, value) => {
    const newSelectedValues = { ...selectedValues, [level]: value };
    setSelectedValues(newSelectedValues);

    // Charger les options pour le niveau suivant
    if (value) {
      axios.get(`http://localhost:8000/api/referentiels-intervention/${value}`)
        .then((response) => {
          setValues({ ...values, [level + 1]: response.data });
        }).catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="App">
      <h1>Referentiels Intervention</h1>
      {Object.keys(values).map((level) => (
        <div key={level}>
          <select
            value={selectedValues[level] || ''}
            onChange={(e) => handleChange(parseInt(level), e.target.value)}
            required
          >
            <option value="">référentiel</option>
            {values[level].map((value, index) => (
              <option key={index} value={value.id}>{value.valeur}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default App;