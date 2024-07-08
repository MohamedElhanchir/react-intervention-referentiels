import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [values, setValues] = useState({}); 
  const [selectedValues, setSelectedValues] = useState({}); 

  useEffect(() => {
    axios.get('http://localhost:8000/api/referentiels-intervention')
      .then((response) => {
        setValues({ 0: response.data.referentiel_parent });
      }).catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (level, value) => {

  let newSelectedValues = { ...selectedValues, [level]: value };

  // Réinitialiser les valeurs sélectionnées pour les niveaux suivants
  Object.keys(newSelectedValues).forEach(key => {
    if (parseInt(key) > level) {
      delete newSelectedValues[key];
    }
  });
  setSelectedValues(newSelectedValues);

  // Réinitialiser les options pour les niveaux suivants
  let newValues = { ...values };
  Object.keys(newValues).forEach(key => {
    if (parseInt(key) > level) {
      delete newValues[key];
    }
  });
  setValues(newValues);

  // Construire l'URL en fonction des sélections précédentes
  let apiUrl = 'http://localhost:8000/api/referentiels-intervention';
  for (let i = 0; i <= level; i++) {
    if (newSelectedValues[i]) {
      apiUrl += `/${newSelectedValues[i]}`;
    }
  }

console.log(apiUrl);

  axios.get(apiUrl)
    .then((response) => {
      if (response.status === 200) {
        const nextLevelData = level % 2 === 0 ? response.data : response.data.enfants;
        if (!nextLevelData.length && level % 2 !== 0) return;
        setValues({ ...newValues, [level + 1]: nextLevelData });
      } else {
        console.log(`Received non-200 status code: ${response.status}`);
      }
       }).catch((error) => {
      console.log(error);
    });
};

function getDisplayValue(value) {
  return value.valeur || value.nom;
}


  return (
    <div className="App container mt-5 col-md-6">
      <h1 className='mb-3'>Referentiels Intervention</h1>


      {Object.keys(values).map((level) => (
  <div key={level} className='mb-3'>
    <select className='form-select'
      value={selectedValues[level] || ''}
      onChange={(e) => handleChange(parseInt(level), e.target.value)}
      required
    > 
      {Array.isArray(values[level]) && <option value="">Sélectionnez une option</option>}      
      
      {Array.isArray(values[level]) ? values[level].map((value, index) => (
        <option key={index} value={value.id}>
        {getDisplayValue(value)}
          </option>
      )) : []}
    </select>
    <div className="form-text"> 
            {level % 2 === 0 ? 'Referentiel' : 'Valeur référentiel'}
          </div>
  </div>
))}


    </div>
  );
}

export default App;