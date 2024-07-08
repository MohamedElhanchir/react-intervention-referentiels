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
        console.log(response.data.referentiel_parent);
      }).catch((error) => {
        console.log(error);
      });
  }, []);

// Gestionnaire d'événements pour mettre à jour les valeurs sélectionnées et charger les options suivantes
const handleChange = (level, value) => {
  const newSelectedValues = { ...selectedValues, [level]: value };
  setSelectedValues(newSelectedValues);

  
  // Construire l'URL en fonction des sélections précédentes
  let apiUrl = 'http://localhost:8000/api/referentiels-intervention';
  for (let i = 0; i <= level; i++) {
    if (newSelectedValues[i]) {
      apiUrl += `/${newSelectedValues[i]}`;
    }
  }

  console.log(apiUrl);
  console.log(level +' cbcb '+value)

  // Si le niveau est impair, charger les données de l'API
  if (level % 2 === 0) {
    axios.get(apiUrl)
      .then((response) => {
        setValues({ ...values, [level + 1]: response.data });
      }).catch((error) => {
        console.log(error);
      });
  } else {
    axios.get(apiUrl)
    .then((response) => {
      setValues({ ...values, [level + 1]: response.data.enfants });
    }).catch((error) => {
      console.log(error);
    });
    
  }
};  

// Fonction pour obtenir la valeur d'affichage
function getDisplayValue(value) {
  return value.valeur || value.nom;
}
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
      <option value="">Sélectionnez une option</option>
      {Array.isArray(values[level]) ? values[level].map((value, index) => (
        <option key={index} value={value.id}>
        {getDisplayValue(value)}
          </option>
      )) : []}
    </select>
  </div>
))}
    </div>
  );
}

export default App;